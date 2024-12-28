/* @refresh reload */
import { Accordion, Card } from 'solid-bootstrap';
import { render } from 'solid-js/web';
import { v4 } from "uuid";
import {Broadcasting} from './broadcasting';
import {QRCodeSVG} from "solid-qr-code";
import Peer from 'peerjs';
import {Receiving} from './receiving';
import {Show, createSignal} from 'solid-js';
import "./index.css";

function setBootstrapTheme() {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const doc = document.documentElement;

    doc.setAttribute("data-bs-theme", query.matches ? "dark" : "light");
    query.onchange = (ev) => {
        doc.setAttribute("data-bs-theme", ev.matches ? "dark" : "light");
    }
}

function App() {
    const [error, setError] = createSignal("");
    const peer = new Peer(`jmp2p_${v4().slice(0, 8)}`);
    const url = 
        `${window.location.protocol}//${window.location.hostname}/?id=${peer.id}`

    peer.on("error", (err) => setError(err.message + " Try to refresh."));
    setBootstrapTheme();

    return <div class="w-full h-dvh flex flex-col items-center justify-between">
        <div class="max-w-[800px] w-full p-4">
            <div class="w-full flex justify-between items-center">
                <div>
                    <h1>P2P File Sharing</h1>
                    <p>Identity: <strong>{peer.id}</strong></p>
                </div>
                <QRCodeSVG
                    value={url}
                    level="high"
                    width={url.length * 2}
                    height={url.length * 2}
                    backgroundColor="var(--bs-body-bg)"
                    foregroundColor="var(--bs-body-color)"
                />
            </div>
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
        <div class="bottom-0 flex items-center hover:cursor-pointer mb-3"
            onClick={() => window.location.assign("https://johanmontorfano.com")}
        >
            <img alt="Author's logo"
                src="https://johanmontorfano.com/assets/logo.svg" 
                width={30} 
                height={30} 
            />
        </div>
    </div>
}   

render(App, document.getElementById("root") as HTMLElement);
