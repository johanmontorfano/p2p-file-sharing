import Peer from "peerjs";
import { Button, Form } from "solid-bootstrap";
import { Show, createEffect, createSignal } from "solid-js";
import { P2PDataset } from "./types";

export function Receiving(props: { peer: Peer }) {
    const urlParams = new URLSearchParams(document.location.search);
    let fileParts: ArrayBuffer[] = [];
    let readBytes = 0;

    const [broadcasterID, setBroadcasterID] = createSignal(
        urlParams.has("id") ? urlParams.get("id") as string : ""
    );
    const [autoPopulatedID, setAutoPopulatedID] = createSignal(
        urlParams.has("id")
    );
    const [broadcasterExists, setBroadcasterExists] = createSignal<
        null | boolean
    >(null);
    const [contentType, setContentType] = createSignal("");
    const [fileName, setFileName] = createSignal("");
    const [fileSize, setFileSize] = createSignal(0);
    const [progress, setProgress] = createSignal(0);

    function checkPeer() {
        const conn = props.peer.connect(broadcasterID());
        setAutoPopulatedID(false);
        conn.on("open", () => {
            setBroadcasterExists(true);
            fileParts = [];
        });
        conn.on("data", (data) => {
            const dataset = data as P2PDataset;
            if (dataset.type === "metadata") {
                const metadata = JSON.parse(dataset.raw);
                setFileName(metadata.fileName);
                setFileSize(metadata.fileSize);
                setContentType(metadata.contentType);
                conn.send({
                    type: "allow-download",
                    raw: "1",
                });
            }
            if (dataset.type === "data-chunk") {
                const buf = dataset.raw as unknown as ArrayBuffer;
                readBytes += buf.byteLength / 8;
                fileParts.push(buf);
                setProgress(readBytes / fileSize() * 100);
            }
            if (dataset.type === "finished") {
                const file = new Blob(fileParts, {type: contentType()});
                const downloader = document.createElement("a");
                downloader.href = URL.createObjectURL(file);
                downloader.download = fileName();
                downloader.click();
                setBroadcasterID("");
                setBroadcasterExists(null);
                conn.close();
            }
        });
    }

    return (
        <div>
            <Form
                onSubmit={(ev) => {
                    ev.preventDefault();
                    const broadcasterInput =
                        document.getElementById("broadcaster-id");
                    if (broadcasterInput) {
                        setBroadcasterID((broadcasterInput as any).value);
                        checkPeer();
                    }
                }}
            >
                <Form.Group>
                    <Form.Label>Broadcaster identifier</Form.Label>
                    <Form.Control
                        type="text"
                        id="broadcaster-id"
                        value={broadcasterID()}
                        disabled={broadcasterID() !== "" || autoPopulatedID()}
                        required
                    />
                </Form.Group>
                <br />
                <Button
                    disabled={broadcasterID() !== "" && !autoPopulatedID()}
                    variant="primary"
                    class="text-white"
                    type="submit"
                >
                    Start receiving
                </Button>
            </Form>
            <br />
            <Show when={broadcasterID() !== "" && !autoPopulatedID()}>
                <Show
                    when={broadcasterExists() !== null}
                    fallback={<p>Looking for {broadcasterID()}...</p>}
                >
                    <p>Broadcaster exists: {broadcasterExists() ? "yes" : "no"}</p>
                </Show>
                <Show when={fileName() !== ""}>
                    <p>Transferring {fileName()}</p>
                    <p>File weights {fileSize()} bytes</p>
                </Show>
                <Show when={broadcasterExists()}>
                    <p>Transferring... ({progress()}%)</p>
                </Show>
            </Show>
        </div>
    );
}
