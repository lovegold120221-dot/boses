import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, MessageSquare } from 'lucide-react';
import { useUI } from '../lib/state';

type ScreenState = 'scan' | 'connected';

interface WhatsAppInfo {
  configured: boolean;
  phoneNumberId: string;
  provider: string;
  status: string;
  displayName?: string;
  phoneNumber?: string;
}

export default function WhatsAppChannelPanel() {
  const activeOverlay = useUI((s) => s.activeOverlay);
  const setActiveOverlay = useUI((s) => s.setActiveOverlay);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [screen, setScreen] = useState<ScreenState>('scan');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<WhatsAppInfo | null>(null);

  const isOpen = activeOverlay === 'whatsapp';

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setScreen('scan');
    fetch('/api/whatsapp/connect')
      .then((r) => r.json())
      .then((data: WhatsAppInfo) => {
        setInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('WhatsApp connect error:', err);
        setLoading(false);
      });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !info?.phoneNumberId || screen !== 'scan') return;
    generateQR(info.phoneNumberId);
  }, [isOpen, info, screen]);

  function generateQR(data: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(canvas, data, {
      width: 180,
      margin: 2,
      color: { dark: '#111b21', light: '#ffffff' },
    });
  }

  function regenerate() {
    if (info?.phoneNumberId) generateQR(info.phoneNumberId);
  }

  function simulatePair() {
    setScreen('connected');
  }

  function disconnect() {
    setScreen('scan');
    if (info?.phoneNumberId) generateQR(info.phoneNumberId);
  }

  return (
    <div className={`full-page-overlay ${isOpen ? 'active' : ''}`}>
      <div className="overlay-header" style={{ backgroundColor: '#111b21', borderBottom: '1px solid #222e35' }}>
        <div className="overlay-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#00a884">
            <path d="M12.011 2c-5.502 0-9.96 4.458-9.96 9.96 0 1.758.455 3.41 1.25 4.857L2 22l5.353-1.405c1.393.76 2.972 1.192 4.658 1.192 5.502 0 9.96-4.458 9.96-9.96 0-5.502-4.458-9.96-9.96-9.96zm6.31 14.123c-.26.733-1.527 1.332-2.112 1.4-1.185.137-2.618-.455-4.57-1.257-2.5-1.025-4.086-3.57-4.21-3.738-.124-.167-.923-1.233-.923-2.35 0-1.118.577-1.668.783-1.89.206-.223.454-.28.605-.28.152 0 .304.004.436.01.14.007.33.012.5.424.175.424.6.1.6 1.46.06.124.1.268.016.433-.083.165-.124.268-.247.412-.124.145-.26.323-.372.433-.124.124-.253.258-.11.505.145.247.64 1.054 1.373 1.705.943.84 1.737 1.1 1.985 1.223.248.124.392.103.537-.062.145-.165.62-.722.784-.97.165-.247.33-.206.557-.123.227.082 1.444.68 1.692.804.247.124.412.185.474.29.062.103.062.6-.198 1.333z"/>
          </svg>
          <span style={{ color: '#e9edef' }}>Connect WhatsApp Channel</span>
        </div>
        <button className="close-overlay-btn" onClick={() => setActiveOverlay(null)}><X size={18} color="#8696a0" /></button>
      </div>

      <div style={{
        flex: 1,
        backgroundColor: '#0b141a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        {/* Phone Device Mockup */}
        <div style={{
          width: '100%',
          maxWidth: '360px',
          backgroundColor: '#0b141a',
          border: '2px solid #222e35',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        }}>
          {/* Status Bar */}
          <div style={{
            height: '28px',
            padding: '0 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#8696a0',
            marginTop: '4px',
          }}>
            <span>9:41</span>
            <div>📶 🔋</div>
          </div>

          {/* App Header */}
          <div style={{
            backgroundColor: '#111b21',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#00a884">
              <path d="M12.011 2c-5.502 0-9.96 4.458-9.96 9.96 0 1.758.455 3.41 1.25 4.857L2 22l5.353-1.405c1.393.76 2.972 1.192 4.658 1.192 5.502 0 9.96-4.458 9.96-9.96 0-5.502-4.458-9.96-9.96-9.96zm6.31 14.123c-.26.733-1.527 1.332-2.112 1.4-1.185.137-2.618-.455-4.57-1.257-2.5-1.025-4.086-3.57-4.21-3.738-.124-.167-.923-1.233-.923-2.35 0-1.118.577-1.668.783-1.89.206-.223.454-.28.605-.28.152 0 .304.004.436.01.14.007.33.012.5.424.175.424.6.1.6 1.46.06.124.1.268.016.433-.083.165-.124.268-.247.412-.124.145-.26.323-.372.433-.124.124-.253.258-.11.505.145.247.64 1.054 1.373 1.705.943.84 1.737 1.1 1.985 1.223.248.124.392.103.537-.062.145-.165.62-.722.784-.97.165-.247.33-.206.557-.123.227.082 1.444.68 1.692.804.247.124.412.185.474.29.062.103.062.6-.198 1.333z"/>
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#e9edef' }}>Connect WhatsApp Channel</span>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8696a0', fontSize: '13px' }}>
                Loading...
              </div>
            ) : screen === 'scan' ? (
              /* QR SCAN STATE */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e9edef', textAlign: 'center', margin: '0 0 8px' }}>
                    Link your WhatsApp
                  </h2>
                  <p style={{ fontSize: '12px', color: '#8696a0', lineHeight: 1.5, textAlign: 'center', margin: '0 0 20px' }}>
                    Scan this QR code using WhatsApp on your device to register this channel under your business account context.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '12px',
                    borderRadius: '14px',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                    marginBottom: '16px',
                  }}>
                    <canvas ref={canvasRef} width="180" height="180" />
                  </div>
                  {info?.phoneNumberId && (
                    <span style={{ fontSize: '10px', color: '#8696a0', fontFamily: 'monospace' }}>
                      ID: {info.phoneNumberId}
                    </span>
                  )}
                </div>

                <button
                  onClick={regenerate}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#00a884',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '16px',
                  }}
                >
                  Regenerate QR Code
                </button>
              </div>
            ) : (
              /* CONNECTED STATE */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e9edef', textAlign: 'center', margin: '0 0 8px' }}>
                    Channel Paired
                  </h2>
                  <p style={{ fontSize: '12px', color: '#8696a0', lineHeight: 1.5, textAlign: 'center', margin: '0 0 20px' }}>
                    This phone number is registered and active as a user instance under your main business account.
                  </p>
                </div>

                <div style={{
                  backgroundColor: '#111b21',
                  border: '1px solid #222e35',
                  borderRadius: '14px',
                  padding: '24px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  margin: 'auto 0',
                }}>
                  <div style={{ position: 'relative', marginBottom: '14px' }}>
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      backgroundColor: '#202c33',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid #00a884',
                    }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="#8696a0">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#25d366',
                      border: '2px solid #111b21',
                      borderRadius: '50%',
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                    }} />
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#e9edef', marginBottom: '4px' }}>
                    {info?.phoneNumberId || 'WhatsApp Channel'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#8696a0', marginBottom: '14px' }}>
                    +{info?.phoneNumberId || '---'}
                  </div>
                  <span style={{
                    backgroundColor: 'rgba(0, 168, 132, 0.12)',
                    color: '#00a884',
                    padding: '5px 10px',
                    borderRadius: '16px',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}>
                    Active Channel
                  </span>
                </div>

                <button
                  onClick={disconnect}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    color: '#ea0038',
                    border: '1px solid #ea0038',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '16px',
                  }}
                >
                  Disconnect Channel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Developer Simulator Panel */}
        <div style={{
          width: '100%',
          maxWidth: '360px',
          marginTop: '12px',
          backgroundColor: '#111b21',
          padding: '12px',
          borderRadius: '10px',
          border: '1px dashed #3a4b55',
        }}>
          <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#8696a0', textAlign: 'left' }}>
            🔧 <strong style={{ color: '#e9edef' }}>Developer Callback Simulator</strong>
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={simulatePair}
              disabled={screen !== 'scan'}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: screen !== 'scan' ? 'not-allowed' : 'pointer',
                backgroundColor: '#202c33',
                color: screen !== 'scan' ? '#3a4b55' : '#e9edef',
                border: '1px solid #222e35',
                borderRadius: '6px',
                opacity: screen !== 'scan' ? 0.5 : 1,
              }}
            >
              Simulate Successful Scan/Pair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
