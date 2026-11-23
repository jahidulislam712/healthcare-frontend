"use client";

import { RagCitation } from "@/app/types/rag.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askRagQuestion } from "@/services/rag.services";
import {
  Bot,
  ExternalLink,
  LoaderCircle,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  citations?: RagCitation[];
}

const getSafeCitationUrl = (url: string | null) => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:"
      ? parsedUrl.toString()
      : null;
  } catch {
    return null;
  }
};

export default function RagChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask a question about our healthcare information. I’ll use relevant sources from our knowledge base.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isSending, messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isSending) return;

    setError(null);
    setIsSending(true);
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    try {
      const result = await askRagQuestion(trimmedQuestion);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.answer,
          citations: result.citations,
        },
      ]);
      setQuestion("");
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Unable to get an answer. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-labelledby="rag-chat-title"
          className="mb-3 flex h-[min(36rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl"
          role="dialog"
        >
          <header className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15">
                <Bot aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold" id="rag-chat-title">
                  Healthcare assistant
                </h2>
                <p className="text-xs text-primary-foreground/75">
                  Answers grounded in our knowledge base
                </p>
              </div>
            </div>
            <Button
              aria-label="Close healthcare assistant"
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              onClick={() => setIsOpen(false)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X aria-hidden="true" />
            </Button>
          </header>

          <div
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto p-4"
          >
            {messages.map((message) => (
              <div
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                key={message.id}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 space-y-1.5 border-t border-border/70 pt-2">
                      <p className="text-xs font-semibold">Sources</p>
                      {message.citations.map((citation) => {
                        const url = getSafeCitationUrl(citation.url);
                        return (
                          <div
                            className="text-xs text-muted-foreground"
                            key={`${citation.reference}-${citation.chunkIndex}`}
                          >
                            <span>[{citation.reference}] </span>
                            {url ? (
                              <a
                                className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-foreground"
                                href={url}
                                rel="noreferrer"
                                target="_blank"
                              >
                                {citation.title}
                                <ExternalLink
                                  aria-hidden="true"
                                  className="size-3"
                                />
                              </a>
                            ) : (
                              <span>{citation.title}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                role="status"
              >
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                Searching trusted sources...
              </div>
            )}
            {error && (
              <p
                className="rounded-md bg-destructive/10 p-2 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <p className="border-t px-4 pt-2 text-xs text-muted-foreground">
            Not for diagnosis or treatment. Consult a clinician for personal
            medical decisions.
          </p>
          <form
            className="flex items-center gap-2 p-3"
            onSubmit={handleSubmit}
          >
            <Input
              aria-label="Ask the healthcare assistant"
              autoComplete="off"
              maxLength={2000}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Type your question..."
              value={question}
            />
            <Button
              aria-label="Send question"
              disabled={!question.trim() || isSending}
              size="icon"
              type="submit"
            >
              {isSending ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" />
              ) : (
                <Send aria-hidden="true" />
              )}
            </Button>
          </form>
        </section>
      )}

      <Button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close healthcare assistant" : "Open healthcare assistant"}
        className="size-14 rounded-full shadow-lg"
        onClick={() => setIsOpen((open) => !open)}
        size="icon-lg"
        type="button"
      >
        {isOpen ? (
          <X aria-hidden="true" className="size-6" />
        ) : (
          <MessageCircle aria-hidden="true" className="size-6" />
        )}
      </Button>
    </div>
  );
}
