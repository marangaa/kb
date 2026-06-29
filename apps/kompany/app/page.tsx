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

  return (
    <main className="dashboard-layout">
      {/* Left Panel: Chat Interface */}
      <section className="chat-panel">
        <header className="panel-header">
          <h1>Company Brain</h1>
        </header>

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
