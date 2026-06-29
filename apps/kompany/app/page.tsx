"use client";

import { useEveAgent } from "eve/react";
import { useEffect, useRef } from "react";
import GraphView from "./_components/graph-view";
import "./globals.css";

const parseInline = (text: string): React.ReactNode[] => {
  const boldLinkRegex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
  const fragments = text.split(boldLinkRegex);
  
  return fragments.map((frag, idx) => {
    if (frag.startsWith("**") && frag.endsWith("**")) {
      return <strong key={idx}>{frag.slice(2, -2)}</strong>;
    }
    if (frag.startsWith("[") && frag.includes("](")) {
      const closeBracketIdx = frag.indexOf("]");
      const label = frag.slice(1, closeBracketIdx);
      const url = frag.slice(closeBracketIdx + 2, -1);
      return (
        <a 
          key={idx} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="markdown-link"
        >
          {label}
        </a>
      );
    }
    return frag;
  });
};

const renderContent = (text: string) => {
  return text.split("\n").map((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={lineIdx} style={{ height: "0.5rem" }} />;
    
    if (trimmed.startsWith("### ")) {
      return <h3 key={lineIdx} className="markdown-h3">{parseInline(trimmed.substring(4))}</h3>;
    }
    if (trimmed.startsWith("## ")) {
      return <h2 key={lineIdx} className="markdown-h2">{parseInline(trimmed.substring(3))}</h2>;
    }
    if (trimmed.startsWith("# ")) {
      return <h1 key={lineIdx} className="markdown-h1">{parseInline(trimmed.substring(2))}</h1>;
    }
    
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return (
        <ul key={lineIdx} className="markdown-ul">
          <li>{parseInline(trimmed.substring(2))}</li>
        </ul>
      );
    }
    
    return <p key={lineIdx} className="markdown-p">{parseInline(line)}</p>;
  });
};

/**
 * Company Brain Dashboard with Split Chat and Memory Graph View
 */
export default function ChatInterface() {
  const agent = useEveAgent();
  const isBusy = agent.status === "submitted" || agent.status === "streaming";
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [agent.data.messages]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = String(e.target?.result || "");
      if (content.trim()) {
        const message = `Please ingest this document: ${file.name}\n\n${content}`;
        void agent.send({ message });
      }
    };
    reader.readAsText(file);
    // Reset file input value
    event.target.value = "";
  };

  return (
    <main className="dashboard-layout">
      {/* Left Panel: Chat Interface */}
      <section className="chat-panel">
        <section className="chat-log" ref={logRef}>
          {agent.data.messages.length === 0 ? (
            <div className="empty-state">
              <h2>How can I help?</h2>
              <p>I am the Company Brain. Ask me anything about our organization.</p>
            </div>
          ) : (
            agent.data.messages.map((message) => (
              <article key={message.id} className={`message ${message.role}`}>
                <div className="role-label">{message.role === 'assistant' ? 'Brain' : 'You'}</div>
                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <div key={index} className="markdown-body">
                      {renderContent(part.text)}
                    </div>
                  ) : null
                )}
              </article>
            ))
          )}
          {isBusy && (
            <article className="message agent">
              <div className="role-label" style={{ display: "block" }}>Brain</div>
              <div className="loader-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </article>
          )}
        </section>

        <div className="form-wrapper">
          <label className="file-upload-button" title="Upload document (.txt, .md)">
            <input
              type="file"
              accept=".txt,.md"
              style={{ display: "none" }}
              disabled={isBusy}
              onChange={handleFileUpload}
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </label>
          <form
            className="form"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const message = String(form.get("message") ?? "").trim();
              if (message.length > 0) {
                void agent.send({ message });
                event.currentTarget.reset();
              }
            }}
          >
            <input 
              name="message" 
              placeholder="Ask the Company Brain..." 
              disabled={isBusy} 
              className="input"
              autoComplete="off"
            />
            <button disabled={isBusy} type="submit" className="button">
              Send
            </button>
          </form>
        </div>
      </section>

      {/* Right Panel: Interactive Graph View */}
      <section className="graph-panel">
        <GraphView />
      </section>
    </main>
  );
}
