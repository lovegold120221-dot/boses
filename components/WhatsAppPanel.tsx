import { X, MessageSquare, QrCode } from 'lucide-react';
import { useUI } from '../lib/state';

interface WhatsAppPanelProps {
  whatsappInfo: any;
  whatsappLoading: boolean;
}

export default function WhatsAppPanel({ whatsappInfo, whatsappLoading }: WhatsAppPanelProps) {
  const activeOverlay = useUI((state) => state.activeOverlay);
  const setActiveOverlay = useUI((state) => state.setActiveOverlay);

  return (
    <div id="overlay-whatsapp" className={`full-page-overlay ${activeOverlay === 'whatsapp' ? 'active' : ''}`}>
      <div className="overlay-header">
        <div className="overlay-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={20} color="#25d366" />
          <span>Meta WhatsApp Cloud Integration</span>
        </div>
        <button className="close-overlay-btn" onClick={() => setActiveOverlay(null)}><X size={18} /></button>
      </div>
      <div className="overlay-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>

        {/* Connection Banner Status */}
        <div style={{
          margin: '16px 20px 0 20px',
          padding: '12px 16px',
          borderRadius: '10px',
          backgroundColor: whatsappInfo?.configured ? '#e8f5e9' : '#fee2e2',
          border: `1px solid ${whatsappInfo?.configured ? '#a5d6a7' : '#fca5a5'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1f2937' }}>
              Status: {whatsappLoading ? 'Querying Meta API...' : whatsappInfo?.configured ? 'Active (Meta Cloud API)' : 'Configuration Suspended (Credentials Missing)'}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
              Powered by the official Meta for Developers Cloud SDK • ID: <code>{whatsappInfo?.phoneNumberId || 'undefined'}</code>
            </div>
          </div>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: whatsappInfo?.configured ? '#2e7d32' : '#dc2626',
            color: '#fff'
          }}>
            {whatsappInfo?.configured ? 'PRODUCTION ACTIVE' : 'CREDENTIALS REQUIRED'}
          </span>
        </div>

        {/* Core Connection Tutorial/Scanning Box - Tailored for Mobile vertical layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px 20px', flex: 1, overflowY: 'auto' }}>

          {/* QR Code scanning pair instructions */}
          <div style={{
            backgroundColor: 'var(--surface-color)',
            borderRadius: '14px',
            padding: '24px 20px',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'relative',
              padding: '12px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '2px solid #25d366',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.15)'
            }}>
              <QrCode size={135} color="#075e54" />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: '2px solid transparent',
                borderRadius: '12px',
                animation: 'pulse 2s infinite'
              }} />
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-color)', marginTop: '16px' }}>Link Device via QR Code</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4', marginTop: '8px', maxWidth: '240px' }}>
              Open <strong>WhatsApp Business</strong> on your phone, go to <strong>Linked Devices</strong>, and scan this verified pairing QR code to associate Eburon safely.
            </p>
          </div>

          {/* Step by step configuration guide & Reference */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }}>
              <h4 style={{ fontSize: '12.5px', fontWeight: 850, color: 'var(--text-color)', marginBottom: '8px' }}>
                Meta Developer Onboarding Steps
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#cef158' }}>1.</span>
                  <span>Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" style={{ color: '#cef158', textDecoration: 'underline' }}>developers.facebook.com</a> and register as a developer.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#cef158' }}>2.</span>
                  <span>Create an app, select <strong>Other</strong> &gt; <strong>Business</strong>, and enable the WhatsApp product integration.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#cef158' }}>3.</span>
                  <span>Retrieve your <strong>Temporary/Permanent Access Token</strong> and <strong>Phone Number ID</strong>.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#cef158' }}>4.</span>
                  <span>Configure these credentials into Eburon\'s environment to shift from simulated sandbox to real-time production messaging.</span>
                </div>
              </div>
            </div>

            {/* Meta Credentials Overview */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }}>
              <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-color)', marginBottom: '10px' }}>Active Config Reference</h4>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>SDK Provider</td>
                    <td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right', color: 'var(--text-color)' }}>Meta Business SDK</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Phone ID</td>
                    <td style={{ padding: '6px 0', fontWeight: 700, fontFamily: 'monospace', textAlign: 'right', color: 'var(--text-color)' }}>
                      {whatsappInfo?.phoneNumberId || 'undefined'}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Security Scope</td>
                    <td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right', color: '#cef158' }}>Direct HTTPS Proxy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
