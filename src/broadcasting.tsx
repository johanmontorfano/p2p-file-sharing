import { Button, Form, Spinner } from "solid-bootstrap";
import { Show, createSignal, onCleanup } from "solid-js";
import { DataConnection, Peer } from "peerjs";
import { getHash, supportIntegrity } from "./integrity";

const CHUNK_SIZE = 65536;

/** WARN: Disconnects the peer. */
function noFileError(conn: DataConnection, close = true) {
    conn.send({ type: "info", raw: "Not setup for file sharing" });
    if (close) conn.close();
}

/** This is the UI used to initiate and monitor files shared. */
export function Broadcasting(props: { peer: Peer }) {
    const [connectedPeers, setConnectedPeers] = createSignal(0);
    const [downloads, setDownloads] = createSignal(0);
    const [file, setFile] = createSignal<File>();
    let listenerEnabled = false;

    function onConnection(conn: DataConnection) {
        conn.on("open", () => {
            if (file() === undefined) noFileError(conn)
            else {
                conn.send({
                    type: "metadata",
                    raw: JSON.stringify({
                        fileName: file()?.name,
                        fileSize: file()?.size,
                        contentType: file()?.type,
                        cryptoOk: supportIntegrity()
                    })
                });
                setConnectedPeers(p => p + 1);
            }
        }).on("data", async (data: any) => {
            if (data.type === "allow-download") {
                let offset = 0;

                if (file() === undefined) return noFileError(conn, false);

                const f = file() as File;
                while (offset < f.size) {
                    const raw = await f.slice(offset, offset + CHUNK_SIZE)
                        .arrayBuffer();
                    const sha = await getHash(raw);

                    conn.send({ type: "data-chunk", raw, sha });
                    offset += CHUNK_SIZE;
                }
                setDownloads(p => p + 1);
                conn.send({ type: "finished", raw: "1" });
            }
        }).on("close", () => {
            setConnectedPeers(p => p - 1);
            conn.close();
        });
    }

    return (
        <div>
            <Form
                onSubmit={async (ev) => {
                    const input = document.getElementById("file-input") as 
                        HTMLInputElement;

                    if (!listenerEnabled)
                        props.peer.on("connection", onConnection);
                    if (input.files && input.files.length > 0)
                        setFile(input.files.item(0) as File);
                    ev.preventDefault();
                }}
                class="flex items-end"
            >
                <Form.Group class="flex-1">
                    <Form.Label>File to broadcast</Form.Label>
                    <Form.Control
                        type="file"
                        id="file-input"
                        required
                    />
                </Form.Group>
                <Button
                    class="text-white ml-2"
                    variant="primary"
                    type="submit"
                >
                    Broadcast
                </Button>
            </Form>
            <br />
            <Show when={file() !== undefined}>
                <div class="flex items-center">
                    <p>Available for sharing</p>
                    <Spinner
                        animation="border"
                        size={"sm" as any}
                        class="ml-2"
                    />
                </div>
                <p>Currently connected peers: {connectedPeers()}</p>
                <p>All time downloads: {downloads()}</p>
                <br />
                <Form onSubmit={(ev) => {
                    listenerEnabled = false;
                    props.peer.off("connection", onConnection);
                    setConnectedPeers(0);
                    setDownloads(0);
                    setFile(undefined);
                    ev.preventDefault();
                }}>
                    <Button
                        variant="danger"
                     class="text-white"
                        type="submit"
                    >
                        Cancel
                    </Button>
                </Form>
            </Show>
        </div>

    );
}
