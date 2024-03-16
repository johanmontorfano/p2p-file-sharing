/* @refresh reload */
import { Accordion, Card } from 'solid-bootstrap';
import { render } from 'solid-js/web';
import { v4 } from "uuid";
import {Broadcasting} from './broadcasting';
import "./index.css";
import Peer from 'peerjs';
import {Receiving} from './receiving';
import {Show, createSignal} from 'solid-js';

function App() {
    const [error, setError] = createSignal("");
    const peer = new Peer(v4());

    peer.on("error", (err) => setError(err.message + " Try to refresh."));

    return <div class="w-full flex justify-center">
        <div class="max-w-[800px] w-full p-4">
            <h1>P2P File Sharing</h1>
            <p>Identity: <strong>{peer.id}</strong></p>
            <br />
            <Show when={error() !== ""}>
                <Card bg="danger" text="white">
                    <Card.Header>
                        Critical Error
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>{error()}</Card.Text>
                    </Card.Body>
                </Card>
            </Show>
            <br />
            <Card bg="warning" text="white">
                <Card.Header>
                    Information
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        The is a known issue about socket connections not working
                        on Chromium-based browsers (sometimes) and Safari. This 
                        is abnormal and a patch will soon be published.
                    </Card.Text>
                </Card.Body>
            </Card>
            <br />
            <Accordion defaultActiveKey="1">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Share a file (Broadcast)</Accordion.Header>
                    <Accordion.Body>
                        <Broadcasting peer={peer} />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Receive a file</Accordion.Header>
                    <Accordion.Body>
                        <Receiving peer={peer} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>
}   

render(App, document.getElementById("root") as HTMLElement)
