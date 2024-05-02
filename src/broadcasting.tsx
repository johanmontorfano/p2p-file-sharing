import { Button, Form, Spinner } from "solid-bootstrap";
import { Show, createSignal } from "solid-js";
import { Peer } from "peerjs";
import { P2PDataset } from "./types";

/**
 * The size of a chunk of the broadcasted file 64ko.
 */
const FILE_CHUNK_SIZE = 65536;

/**
 * This is the UI used to initiate and monitor files shared.
 * @param peer The Peer instance of the broadcaster.
 */
export function Broadcasting(props: { peer: Peer }) {
    const [broadcastingReady, setBroadcastingReady] = createSignal(false);
    const [peerConnected, setPeerConnected] = createSignal("");
    const [progress, setProgress] = createSignal(0);

    return (
        <div>
            <Form
                onSubmit={(ev) => {
                    ev.preventDefault();
                    const fileInput = document.getElementById(
                        "file-input",
                    ) as HTMLInputElement;

                    if (
                        fileInput &&
                        fileInput.files &&
                        fileInput.files.length > 0
                    ) {
                        const file = fileInput.files.item(0) as File;
                        setBroadcastingReady(true);
                        props.peer.on("connection", (conn) => {
                            alert(conn.peer);
                            conn.on("open", () => {
                                setPeerConnected(conn.peer);
                                conn.send({
                                    type: "metadata",
                                    raw: JSON.stringify({
                                        fileName: file.name,
                                        fileSize: file.size,
                                        contentType: file.type
                                    }),
                                });
                            });
                            conn.on("data", async (data) => {
                                const dataset = data as P2PDataset;
                                if (dataset.type === "allow-download") {
                                    let startByte = 0;
                                    while (startByte < file.size) {
                                        const slice = file.slice(
                                            startByte,
                                            startByte + FILE_CHUNK_SIZE
                                        );
                                        conn.send({
                                            type: "data-chunk",
                                            raw: await slice.arrayBuffer()
                                        });
                                        startByte += FILE_CHUNK_SIZE;
                                        setProgress(startByte / file.size * 100);
                                    }
                                    conn.send({
                                        type: "finished",
                                        raw: "1"
                                    });
                                }
                            });
                            conn.on("close", () => {
                                setBroadcastingReady(false);
                                setPeerConnected("");
                            })
                        });
                    }
                }}
            >
                <Form.Group>
                    <Form.Label>File to broadcast</Form.Label>
                    <Form.Control
                        type="file"
                        id="file-input"
                        disabled={broadcastingReady()}
                        required
                    />
                </Form.Group>
                <br />
                <Button
                    disabled={broadcastingReady()}
                    class="text-white"
                    variant="primary"
                    type="submit"
                >
                    Start broadcasting
                </Button>
            </Form>
            <br />
            <Show when={broadcastingReady()}>
                <div>
                    <p>
                        <strong>
                            {peerConnected() === ""
                                ? "Waiting for a remote peer to connect."
                                : `${progress()}% transmitted.`}
                        </strong>
                    </p>
                    <Spinner animation="border" />
                </div>
            </Show>
        </div>
    );
}
