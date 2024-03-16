/** Represents a dataset sent through the P2P connection. */
export interface P2PDataset {
    type: "data-chunk" | "metadata" | "allow-download" | "finished";
    raw: string;
}
