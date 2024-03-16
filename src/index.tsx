/* @refresh reload */
import { Accordion, AccordionBody } from 'solid-bootstrap';
import {createSignal} from 'solid-js';
import { render } from 'solid-js/web';
import { v4 } from "uuid";
import {Broadcasting} from './broadcasting';
import "./index.css";
import Peer from 'peerjs';
import {Receiving} from './receiving';

function App() {
    const peer = new Peer(v4());

    return <div class="w-full flex justify-center">
        <div class="max-w-[800px] w-full p-4">
            <h1>P2P File Sharing</h1>
            <p>Identity: <strong>{peer.id}</strong></p>
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
