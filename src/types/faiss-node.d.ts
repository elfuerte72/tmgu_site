declare module 'faiss-node' {
  export class Index {
    static read(path: string): Promise<IndexFlatL2>;
  }

  export class IndexFlatL2 {
    constructor(dimensions: number);
    add(vectors: Float32Array, n: number): void;
    search(query: Float32Array, k: number): { labels: number[] };
    write(path: string): Promise<void>;
  }
}
