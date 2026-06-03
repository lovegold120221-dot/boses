import React, { useEffect, useRef } from 'react';

interface SandboxProps {
  content: string;
}

export const Sandbox: React.FC<SandboxProps> = ({ content }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      // We use srcDoc to render the HTML directly.
      // We allow scripts as per the prompt's instruction that scripts might be used for calculations.
      iframeRef.current.srcDoc = content || `
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#94a3b8;font-family:sans-serif;background-color:#f8fafc;margin:0;">
          <div style="text-align:center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 16px auto;opacity:0.5;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            <p>Awaiting document generation...</p>
            <p style="font-size:0.875rem;margin-top:8px;opacity:0.7;">Speak to the Eburon agent to begin.</p>
          </div>
        </div>
      `;
    }
  }, [content]);

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-500 font-medium uppercase tracking-wider">
        <span>Document Sandbox</span>
        {content && <span className="text-green-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Rendered</span>}
      </div>
      <iframe
        ref={iframeRef}
        className="w-full flex-1 border-none bg-white"
        sandbox="allow-scripts allow-same-origin"
        title="Document Sandbox"
      />
    </div>
  );
};
