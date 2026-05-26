import { X } from 'lucide-react';
import { useUI } from '../lib/state';

interface HistoryPanelProps {
  historyTurns: any[];
}

export default function HistoryPanel({ historyTurns }: HistoryPanelProps) {
  const activeOverlay = useUI((state) => state.activeOverlay);
  const setActiveOverlay = useUI((state) => state.setActiveOverlay);

  return (
    <div id="overlay-history" className={`full-page-overlay ${activeOverlay === 'history' ? 'active' : ''}`}>
      <div className="overlay-header">
        <div className="overlay-title">Activity History</div>
        <button className="close-overlay-btn" onClick={() => setActiveOverlay(null)}><X size={18} /></button>
      </div>
      <div className="overlay-content" style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
        {historyTurns.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>No recent history.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
            {historyTurns.slice().reverse().map((turn, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: turn.role === 'user' ? 'var(--accent-active)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {turn.role}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {new Date(turn.timestamp).toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: '13px', lineHeight: '1.4', margin: 0, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                  {turn.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
