/* @refresh reload */
import { Accordion } from 'solid-bootstrap';
import { render } from 'solid-js/web';
import { v4 } from "uuid";
import {Broadcasting} from './broadcasting';
import "./index.css";
import Peer from 'peerjs';
import {Receiving} from './receiving';
import {createSignal} from 'solid-js';

function App() {
    const [error, setError] = createSignal("");
    const peer = new Peer(v4(), {debug: 3});

    peer.on("error", (err) => setError(err.message));

    return <div class="w-full flex justify-center">
        <div class="max-w-[800px] w-full p-4">
            <h1>P2P File Sharing</h1>
            <p>Identity: <strong>{peer.id}</strong></p>
            <p class="text-red">{error()}</p>
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
