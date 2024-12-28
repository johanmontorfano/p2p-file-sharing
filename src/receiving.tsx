import Peer, { DataConnection } from "peerjs";
import { Button, Form } from "solid-bootstrap";
import { Show, createSignal } from "solid-js";
import { Metadata, P2PDataset } from "./types";
import { getHash } from "./integrity";
import { setProperty } from "solid-js/web";

export function Receiving(props: { peer: Peer }) {
    const url = new URLSearchParams(document.location.search);
    const fileParts: ArrayBuffer[] = [];

    const [conn, setConn] = createSignal<DataConnection>();
    const [bcasterID, setBcasterID] = createSignal("");
    const [bcasterFound, setBcasterFound] = createSignal(false);
    const [metadata, setMetadata] = createSignal<Metadata>({} as any);
    const [readBytes, setReadBytes] = createSignal(0);
    const [transferStarted, setTransferStatus] = createSignal(false);
    const [progression, setProgression] = createSignal("0.00");

    if (url.has("id")) setBcasterID(url.get("id") as string);

    function clearBroadcaster() {
        setBcasterID("");
        setBcasterFound(false);
        setMetadata({} as any);
        setReadBytes(0);
        setTransferStatus(false);
    }

    function getBroadcaster() {
        const conn = props.peer.connect("jmp2p_" + bcasterID());

        setConn(conn);
        conn.on("open", () => setBcasterFound(true));
        conn.on("data", async (data: any) => {
            if (data.type === "metadata") setMetadata(JSON.parse(data.raw));
            if (data.type === "data-chunk") {
                if (metadata().cryptoOk && !data.sha) {
                    clearBroadcaster();
                    return conn.close();
                }
                if (metadata().cryptoOk && data.sha) {
                    if (await getHash(data.raw) !== data.sha) {
                        clearBroadcaster();
                        return conn.close();
                    }
                }
                setReadBytes(p => p + data.raw.byteLength / 8);
                setProgression(
                    (readBytes() / metadata().fileSize * 100).toFixed(2));
                fileParts.push(data.raw);
            }
            if (data.type === "finished") {
                const file = new Blob(fileParts, {
                    type: metadata().contentType
                });
                const downloader = document.createElement("a");

                downloader.href = URL.createObjectURL(file);
                downloader.download = metadata().fileName as string;
                downloader.click();
                clearBroadcaster();
                conn.close();
            }
        });
    }

    return (
        <div>
            <Form
                class="flex items-end"
                onSubmit={(ev) => {
                    const id = document.getElementById("broadcaster-id");
                
                    setBcasterID((id as any).value);
                    getBroadcaster();
                    ev.preventDefault();
                }}
            >
                <Form.Group class="flex-1">
                    <Form.Label>Broadcaster identifier</Form.Label>
                    <Form.Control
                        type="text"
                        id="broadcaster-id"
                        value={bcasterID()}
                        disabled={bcasterID() !== ""}
                        placeholder="Enter the broadcaster identifier here..."
                        required
                    />
                </Form.Group>
                <Button
                    disabled={bcasterID() !== ""}
                    variant="primary"
                    class="text-white ml-2"
                    type="submit"
                >
                    Connect
                </Button>
            </Form>
            <Show when={bcasterFound()}>
                <br />
                <p>Broadcaster exists: {bcasterFound() + ""}</p>
                <p>Integrity checks: {metadata().cryptoOk + ""}</p>
            </Show>
            <Show when={bcasterID() !== ""}>
                <br />
                <Form onSubmit={(ev) => {
                    conn()?.send({type: "allow-download"});
                     setTransferStatus(true);
                    ev.preventDefault();
                }}>
                    <Button
                        variant="primary"
                        class="text-white"
                        type="submit"
                    >
                        Transfer
                    </Button>
                </Form>
            </Show>
            <br />
            <Show when={transferStarted()}>
                <p>Transferring {metadata().fileName}</p>
                <p>File weights {metadata().fileSize} bytes</p>
                <p>Loaded {progression()}%</p>
            </Show>
        </div>
    );
}
