export interface RagCitation {
  reference: number;
  source: string;
  title: string;
  url: string | null;
  chunkIndex: number;
  score: number;
}

export interface RagAnswer {
  answer: string;
  sources: string[];
  citations: RagCitation[];
}
