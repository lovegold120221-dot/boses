import { X, FolderOpen, Search } from 'lucide-react';
import { useUI, useLogStore } from '../lib/state';
import { FileStack, Table, Presentation } from 'lucide-react';

interface PickerPanelProps {
  handleOpenPicker: () => Promise<void>;
}

export default function PickerPanel({ handleOpenPicker }: PickerPanelProps) {
  const activeOverlay = useUI((state) => state.activeOverlay);
  const setActiveOverlay = useUI((state) => state.setActiveOverlay);
  const connected = false; // Will be passed via context in practice

  return (
    <div id="overlay-picker" className={`full-page-overlay ${activeOverlay === 'picker' ? 'active' : ''}`}>
      <div className="overlay-header">
        <div className="overlay-title">Google Drive Picker</div>
        <button className="close-overlay-btn" onClick={() => setActiveOverlay(null)}><X size={18} /></button>
      </div>
      <div className="overlay-content" style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
        <button
          className="save-now-btn"
          onClick={() => {
            setActiveOverlay(null);
            handleOpenPicker();
          }}
          style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', background: 'var(--accent-active)', color: '#000' }}
        >
          <FolderOpen size={18} /> Launch Live Google Picker
        </button>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface-color)', padding: '12px 16px', borderRadius: '12px' }}>
            <Search size={20} color="var(--text-muted)" style={{ marginRight: '12px' }} />
            <input type="text" placeholder="Search in Drive..." style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, color: 'var(--text-main)', fontSize: 16 }} />
          </div>
        </div>

        <h4 style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Recent Files</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '12px', cursor: 'pointer' }}
            onClick={() => {
              setActiveOverlay(null);
              const text = "I selected 'Project Brief 2026.docx' from Google Drive. Please analyze this brief and explain its main objectives to me.";
              if (connected) (window as any).client?.send?.({ text });
              useLogStore.getState().addTurn({ role: 'user', text, isFinal: true });
            }}
          >
            <FileStack size={32} color="#4285F4" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Project Brief 2026.docx</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Modified today by You</div>
            </div>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '12px', cursor: 'pointer' }}
            onClick={() => {
              setActiveOverlay(null);
              const text = "I selected 'Q3 Financials.xlsx' from Google Drive. Please review the financial sheet, check the balance, and summarize margins.";
              if (connected) (window as any).client?.send?.({ text });
              useLogStore.getState().addTurn({ role: 'user', text, isFinal: true });
            }}
          >
            <Table size={32} color="#0F9D58" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Q3 Financials.xlsx</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Modified yesterday</div>
            </div>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '12px', cursor: 'pointer' }}
            onClick={() => {
              setActiveOverlay(null);
              const text = "I selected 'Investor Pitch Deck.pptx' from Google Drive. Walk me through the pitch flows and suggest feedback to make it punchier.";
              if (connected) (window as any).client?.send?.({ text });
              useLogStore.getState().addTurn({ role: 'user', text, isFinal: true });
            }}
          >
            <Presentation size={32} color="#F4B400" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Investor Pitch Deck.pptx</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Modified last week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
