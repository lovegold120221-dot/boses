import { X } from 'lucide-react';
import { useUI, useTools } from '../lib/state';

interface ToolsPanelProps {
  connected: boolean;
}

export default function ToolsPanel({ connected }: ToolsPanelProps) {
  const activeOverlay = useUI((state) => state.activeOverlay);
  const setActiveOverlay = useUI((state) => state.setActiveOverlay);
  const tools = useTools((state) => state.tools);

  return (
    <div id="overlay-tools" className={`full-page-overlay ${activeOverlay === 'tools' ? 'active' : ''}`}>
      <div className="overlay-header">
        <div className="overlay-title">Integrations</div>
        <button className="close-overlay-btn" onClick={() => setActiveOverlay(null)}><X size={18} /></button>
      </div>
      <div className="overlay-content" style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px', lineHeight: '1.4' }}>
          Customize which capabilities and Google Workspace APIs Beatrice has permission to invoke during this session:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
          {tools.map((t, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px'
            }}>
              <div style={{ flex: 1, paddingRight: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                    {t.name.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  {t.isEnabled ? (
                    <span style={{ fontSize: '9px', backgroundColor: 'rgba(203, 251, 69, 0.15)', color: 'var(--accent-active)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Active</span>
                  ) : (
                    <span style={{ fontSize: '9px', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Disabled</span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px', lineHeight: '1.3' }}>
                  {t.description || 'Google Workspace integration command.'}
                </div>
              </div>
              <button
                onClick={() => {
                  useTools.getState().toggleTool(t.name);
                }}
                style={{
                  background: t.isEnabled ? 'var(--accent-active)' : 'rgba(255,255,255,0.05)',
                  color: t.isEnabled ? 'var(--bg-main)' : 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '12px',
                  transition: 'all 0.2s ease'
                }}
              >
                {t.isEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
