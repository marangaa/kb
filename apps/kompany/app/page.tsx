"use client";

import { useEveAgent } from "eve/react";
import { useEffect, useRef, useState } from "react";
import GraphView from "./_components/graph-view";
import { SEED_DOCUMENTS } from "./_data/seed-docs";
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

  // Sidebar / Drag-and-drop / Dropdown states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; status: 'ingesting' | 'done' | 'error' }[]>([]);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsMenuOpen(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [agent.data.messages]);

  const processSeedDoc = async (doc: typeof SEED_DOCUMENTS[0]) => {
    setIsMenuOpen(false);
    setIsSidebarOpen(true); // Open the status sidebar to show ingestion progress
    
    // Check if document was already ingested / is in the list
    if (uploadedFiles.some(f => f.name === doc.filename && f.status === 'ingesting')) {
      return;
    }

    const fileInfo = { 
      name: doc.filename, 
      size: `${(doc.content.length / 1024).toFixed(2)} KB`, 
      status: 'ingesting' as const 
    };
    
    // Filter out previous version of this document from listing to avoid duplicates
    setUploadedFiles(prev => [fileInfo, ...prev.filter(f => f.name !== doc.filename)]);

    try {
      const message = `Please ingest this document: ${doc.filename}\n\n${doc.content}`;
      await agent.send({ message });
      setUploadedFiles(prev => 
        prev.map(f => f.name === doc.filename ? { ...f, status: 'done' } : f)
      );
    } catch (err) {
      setUploadedFiles(prev => 
        prev.map(f => f.name === doc.filename ? { ...f, status: 'error' } : f)
      );
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    const fileInfo = { 
      name: file.name, 
      size: `${(file.size / 1024).toFixed(1)} KB`, 
      status: 'ingesting' as const 
    };
    
    setUploadedFiles(prev => [fileInfo, ...prev.filter(f => f.name !== file.name)]);
    setIsSidebarOpen(true);

    reader.onload = async (e) => {
      const content = String(e.target?.result || "");
      if (content.trim()) {
        try {
          const message = `Please ingest this document: ${file.name}\n\n${content}`;
          await agent.send({ message });
          setUploadedFiles(prev => 
            prev.map(f => f.name === file.name ? { ...f, status: 'done' } : f)
          );
        } catch (err) {
          setUploadedFiles(prev => 
            prev.map(f => f.name === file.name ? { ...f, status: 'error' } : f)
          );
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        processFile(file);
      }
    });
  };

  return (
    <main className="dashboard-layout">
      {/* Left Panel: Chat Interface */}
      <section className="chat-panel">
        
        {/* Sliding Ingestion Sidebar Drawer */}
        <aside className={`ingest-sidebar ${isSidebarOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="sidebar-header">
            <h3>Document Ingestor</h3>
            <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Drag & Drop Zone */}
          <div 
            className={`dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>Drag & drop notes here</p>
            <span>Supports .txt, .md files</span>
          </div>

          {/* Active Uploads List */}
          <div className="file-list-wrapper">
            <div className="file-list-title">Ingested Documents</div>
            <div className="file-list">
              {uploadedFiles.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: '#444', textAlign: 'center', marginTop: '1rem' }}>
                  No documents uploaded in this session.
                </div>
              ) : (
                uploadedFiles.map((file, idx) => (
                  <div key={idx} className="file-item">
                    <svg className="file-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <div className="file-info">
                      <div className="file-name" title={file.name}>{file.name}</div>
                      <div className="file-size">{file.size}</div>
                    </div>
                    <div className="file-status">
                      {file.status === 'ingesting' && <div className="status-spinner" />}
                      {file.status === 'done' && (
                        <svg className="status-done" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {file.status === 'error' && (
                        <svg className="status-error" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

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
          {/* Floating Pre-baked Seed Documents Menu */}
          <div className="file-upload-button-wrapper" onClick={(e) => e.stopPropagation()}>
            <button 
              className="file-upload-button" 
              title="Add pre-baked company notes"
              disabled={isBusy}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
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
            </button>

            <div className={`seed-docs-menu ${isMenuOpen ? "open" : ""}`}>
              <div className="seed-docs-menu-title">Select note to ingest</div>
              {SEED_DOCUMENTS.map((doc) => (
                <button
                  key={doc.id}
                  className="seed-docs-menu-item"
                  onClick={() => processSeedDoc(doc)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>{doc.title}</span>
                </button>
              ))}
            </div>
          </div>

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
