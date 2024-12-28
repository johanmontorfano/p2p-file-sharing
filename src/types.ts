/** Represents a dataset sent through the P2P connection. */
export interface P2PDataset {
    type: "data-chunk" | "metadata" | "allow-download" | "finished" | "info";
    raw: string;
    sha?: string;
}

export interface Metadata {
    fileName: string;
    fileSize: number;
    cryptoOk: boolean;
    contentType: string;
}
