import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2, Printer, FileDown, X, Menu, ChevronDown } from 'lucide-react';
import { GeminiLiveService } from './services/geminiLive.js';

interface SandboxLog {
  id: string;
  type: 'system' | 'action' | 'result' | 'error';
  text: string;
}

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [sandboxLogs, setSandboxLogs] = useState<SandboxLog[]>([]);

  const liveServiceRef = useRef<GeminiLiveService | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    liveServiceRef.current = new GeminiLiveService();
    return () => {
      if (liveServiceRef.current) {
        liveServiceRef.current.disconnect();
      }
    };
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [sandboxLogs]);

  const addLog = useCallback((type: 'system' | 'action' | 'result' | 'error', text: string) => {
    setSandboxLogs(prev => [...prev, { id: Math.random().toString(36).substring(7), type, text }]);
  }, []);

  const handleConnect = useCallback(async () => {
    if (!liveServiceRef.current) return;

    setIsConnecting(true);
    setSandboxLogs([]);
    addLog('system', 'Initializing Eburon Sandbox Environment...');

    await liveServiceRef.current.connect({
      onConnect: () => {
        setIsConnected(true);
        setIsConnecting(false);
        setInputText('Listening...');
      },
      onDisconnect: () => {
        setIsConnected(false);
        setIsConnecting(false);
        setInputText('');
        setIsGenerating(false);
      },
      onError: (err) => {
        console.error(err);
        setIsConnected(false);
        setIsConnecting(false);
        setInputText(`Error: ${err.message || 'Connection failed'}`);
        setIsGenerating(false);
      },
      onHtmlGenerated: (html) => {
        setHtmlContent(html);
        setIsGenerating(false);
        setInputText('Document generated.');
      },
      onTranscript: (text, isUser) => {
        setInputText(text);
      },
      onSandboxLog: (type, text) => {
        addLog(type, text);
        if (text.includes('Task received')) {
          setIsGenerating(true);
        }
      }
    });
  }, [addLog]);

  const handleDisconnect = useCallback(() => {
    if (liveServiceRef.current) {
      liveServiceRef.current.disconnect();
    }
  }, []);

  const toggleConnection = () => {
    if (isConnected) {
      handleDisconnect();
    } else {
      handleConnect();
    }
  };

  const resetPage = () => {
    setHtmlContent('');
    setIsGenerating(false);
    setSandboxLogs([]);
    setInputText(isConnected ? 'Listening...' : '');
  };

  const triggerPrint = () => window.print();

  let workspaceClass = "workspace-card";
  if (isGenerating) workspaceClass += " gen-mode";
  else if (htmlContent) workspaceClass += " doc-ready";

  return (
    <div className="device-container" id="device-viewport">
      <header className="header">
        <button className="close-btn" aria-label="Close" onClick={resetPage}>
          <X size={22} />
        </button>
        <h1 className="header-title">Eburon PC</h1>
        <div className="dropdown-pill">
          <Menu size={16} />
          <ChevronDown size={10} />
        </div>
      </header>

      <div className="main-body">
        <div className={workspaceClass} id="workspace-container">
          
          {/* Desktop Ready State */}
          <div className="desktop-ready-state">
            <div className="monitor-graphic">
              <div className="monitor-screen"><div className="monitor-inner"></div></div>
              <div className="monitor-stand"></div>
              <div className="monitor-base"></div>
            </div>
            <p className="desktop-ready-text">Sandbox Engine Ready</p>
          </div>

          {/* Document Workspace */}
          <div className="document-workspace">
            <div className="view-header">
              <div className="processing-header">
                <Loader2 size={16} className="processing-icon" />
                Processing & Generating<span className="dots"><span>.</span><span>.</span><span>.</span></span>
              </div>
              <div className="doc-actions">
                <button onClick={triggerPrint} className="action-btn">
                  <Printer size={14} /> Print
                </button>
                <button onClick={triggerPrint} className="action-btn primary">
                  <FileDown size={14} /> PDF
                </button>
              </div>
            </div>

            <div className="workspace-split">
              {/* Top: Document Preview */}
              <div className="document-panel">
                <div className="document-skeleton" id="doc-skeleton">
                  {(!htmlContent || isGenerating) && (
                    <>
                      <div className="doc-sk-header" id="skeleton-placeholders-header">
                        <div className="doc-sk-icon"></div>
                        <div className="doc-sk-title"></div>
                      </div>
                      <div className="doc-sk-divider" id="skeleton-placeholders-div"></div>
                      <div id="skeleton-placeholders-lines">
                        <div className="doc-sk-line long"></div>
                        <div className="doc-sk-line medium"></div>
                        <div className="doc-sk-visual"></div>
                        <div className="doc-sk-line long"></div>
                        <div className="doc-sk-line short"></div>
                      </div>
                    </>
                  )}
                  {htmlContent && !isGenerating && (
                    <div id="live-render-target" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
                  )}
                </div>
              </div>

              {/* Bottom: Terminal Logs */}
              <div className="terminal-panel" ref={terminalRef}>
                {sandboxLogs.length === 0 && (
                  <div className="terminal-line system">Waiting for sandbox activity...</div>
                )}
                {sandboxLogs.map(log => (
                  <div key={log.id} className={`terminal-line ${log.type}`}>
                    {log.text}
                  </div>
                ))}
                {isGenerating && <div className="terminal-line system">_ <span className="terminal-cursor"></span></div>}
              </div>
            </div>
          </div>
        </div>

        <div className="command-bar">
          <button 
            onClick={toggleConnection} 
            className="cmd-icon hover:opacity-80 transition-opacity" 
            disabled={isConnecting}
            aria-label={isConnected ? "Stop Voice Session" : "Start Voice Session"}
          >
            {isConnecting ? <Loader2 size={20} className="animate-spin text-sky-400" /> :
             isConnected ? <MicOff size={20} className="text-red-500" /> :
             <Mic size={20} className="text-sky-400" />}
          </button>
          <input
            type="text"
            id="cmd-input"
            className="cmd-input-field"
            placeholder={isConnected ? "Listening..." : "Click mic to start Sandbox..."}
            value={inputText}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default App;
