import { X, Video } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useUI, useLogStore } from '../lib/state';

interface ScannerPanelProps {
  connected: boolean;
  client: any;
}

export default function ScannerPanel({ connected, client }: ScannerPanelProps) {
  const activeOverlay = useUI((state) => state.activeOverlay);
  const setActiveOverlay = useUI((state) => state.setActiveOverlay);

  return (
    <div id="overlay-scanner" className={`full-page-overlay ${activeOverlay === 'scanner' ? 'active' : ''}`}>
      <div className="overlay-header">
        <div className="overlay-title">Supermarket Scanner</div>
        <button className="close-overlay-btn" onClick={() => setActiveOverlay(null)}><X size={18} /></button>
      </div>
      <div className="overlay-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '400px', aspectRatio: '3/4', backgroundColor: '#000', borderRadius: '16px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {true ? (
            <Scanner
              onScan={(result) => {
                if (result && result.length > 0) {
                  const text = result[0].rawValue;
                  setActiveOverlay(null);
                  const scanMsg = `Supermarket Scanner scan: "${text}". Please identify this product, its nutritional info, and check if it is available nearby.`;
                  if (connected) client.send({ text: scanMsg });
                  useLogStore.getState().addTurn({ role: 'user', text: scanMsg, isFinal: true });
                }
              }}
              components={{
                tracker: true,
                audio: false,
                finder: true,
              } as any}
              styles={{
                container: { width: '100%', height: '100%', objectFit: 'cover' }
              }}
            />
          ) : <Video size={48} color="#444" />}
        </div>
        <div className="form-group" style={{ width: '100%', maxWidth: '400px', marginTop: '24px' }}>
          <label>Translate to</label>
          <select className="form-control" defaultValue="en">
            <option value="en">English</option>
            <option value="nl">Dutch (Flemish)</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <div style={{ width: '100%', maxWidth: '400px', marginTop: '20px' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scan Simulator</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              className="pill-btn"
              style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', width: '100%', fontSize: '13px', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', cursor: 'pointer', borderRadius: '8px' }}
              onClick={() => {
                setActiveOverlay(null);
                const scanMsg = `Supermarket Scanner scan: "5411188112920". Alpro Barista Oat Milk. Please identify nutritional specifications, ingredients, allergen warnings, and confirm Belgium availability!`;
                if (connected) client.send({ text: scanMsg });
                useLogStore.getState().addTurn({ role: 'user', text: scanMsg, isFinal: true });
              }}
            >
              <span>🥛 Alpro Barista Oat Milk</span>
              <span style={{ color: 'var(--accent-active)', fontFamily: 'monospace' }}>5411188112920</span>
            </button>
            <button
              className="pill-btn"
              style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', width: '100%', fontSize: '13px', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', cursor: 'pointer', borderRadius: '8px' }}
              onClick={() => {
                setActiveOverlay(null);
                const scanMsg = `Supermarket Scanner scan: "5410126006152". Lotus Biscoff Cookies. Please identify nutritional specifications, ingredients, allergen warnings, and confirm Belgium availability!`;
                if (connected) client.send({ text: scanMsg });
                useLogStore.getState().addTurn({ role: 'user', text: scanMsg, isFinal: true });
              }}
            >
              <span>🍪 Lotus Biscoff Cookies</span>
              <span style={{ color: 'var(--accent-active)', fontFamily: 'monospace' }}>5410126006152</span>
            </button>
            <button
              className="pill-btn"
              style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', width: '100%', fontSize: '13px', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', cursor: 'pointer', borderRadius: '8px' }}
              onClick={() => {
                setActiveOverlay(null);
                const scanMsg = `Supermarket Scanner scan: "5410228141447". Stella Artois Belgian Beer. Please identify nutritional specifications, ingredients, allergen warnings, and confirm Belgium availability!`;
                if (connected) client.send({ text: scanMsg });
                useLogStore.getState().addTurn({ role: 'user', text: scanMsg, isFinal: true });
              }}
            >
              <span>🍺 Stella Artois Export Beer</span>
              <span style={{ color: 'var(--accent-active)', fontFamily: 'monospace' }}>5410228141447</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
