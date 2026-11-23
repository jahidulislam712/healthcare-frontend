"use server";

import { RagAnswer } from "@/app/types/rag.types";
import { serverApiClient } from "@/lib/axios/serverApiClient";

export const askRagQuestion = async (question: string): Promise<RagAnswer> => {
  const response = await serverApiClient.post<RagAnswer>("/rag/ask", {
    question,
  });

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to get an answer.");
  }

  return response.data;
};
