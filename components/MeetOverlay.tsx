import { motion } from 'motion/react';
import { Send, Mic, Video, Cast, X } from 'lucide-react';
import { StreamingText } from './StreamingText';
import type { ConversationTurn } from '../lib/state';

interface MeetOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoError: string | null;
  filteredTurns: ConversationTurn[];
  connected: boolean;
  volume: number;
  message: string;
  setMessage: (msg: string) => void;
  handleSend: () => void;
  micState: boolean;
  setMicState: (v: boolean) => void;
  isWebcamActive: boolean;
  isScreenShareActive: boolean;
  stopStream: () => void;
  startWebcam: () => void;
  startScreenShare: () => void;
  setIsMeetOpen: (v: boolean) => void;
}

export function MeetOverlay({
  videoRef,
  videoError,
  filteredTurns,
  connected,
  volume,
  message,
  setMessage,
  handleSend,
  micState,
  setMicState,
  isWebcamActive,
  isScreenShareActive,
  stopStream,
  startWebcam,
  startScreenShare,
  setIsMeetOpen,
}: MeetOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="full-page-overlay meet-overlay active"
      style={{ backgroundColor: '#0a0a0a', zIndex: 2000, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
    >
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isScreenShareActive ? 'none' : 'scaleX(-1)',
          }}
        />

        {videoError && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            maxWidth: '85%', backgroundColor: 'rgba(220, 38, 38, 0.95)', color: '#fff',
            padding: '20px', borderRadius: '16px', textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 2005,
          }}>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>⚠️ Visual Share Unvailable</div>
            <div style={{ fontSize: '13px', opacity: 0.9, lineHeight: 1.4 }}>{videoError}</div>
            <button onClick={stopStream} style={{
              backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none',
              padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', marginTop: '6px', alignSelf: 'center',
            }}>
              Dismiss Error
            </button>
          </div>
        )}

        <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2002 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(10,10,10,0.75)', padding: '6px 12px', borderRadius: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: connected ? 'var(--accent-active)' : 'var(--accent-danger)', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
              {isScreenShareActive ? 'SCREEN SHARING' : 'CAMERA LIVE'}
            </span>
            {!connected && <span style={{ fontSize: '10px', color: '#ff4d4d', marginLeft: '4px' }}>Disconnected</span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(10,10,10,0.75)', padding: '6px 14px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ position: 'relative' }}>
              <img src="/api/avatar" alt="Beatrice" style={{
                width: '32px', height: '32px', borderRadius: '50%',
                boxShadow: volume > 0.05 ? '0 0 12px var(--accent-active)' : 'none',
                border: volume > 0.05 ? '2px solid var(--accent-active)' : '1px solid rgba(255,255,255,0.2)',
                transition: 'box-shadow 0.1s ease, border-color 0.1s ease',
              }} />
              {volume > 0.05 && (
                <span style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--accent-active)' }} />
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Beatrice</span>
              <span style={{ fontSize: '10px', color: volume > 0.05 ? 'var(--accent-active)' : 'var(--text-muted)' }}>
                {volume > 0.05 ? 'Speaking...' : 'Listening...'}
              </span>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: '100px', left: '16px', right: '16px',
          maxHeight: '130px', overflowY: 'auto', display: 'flex', flexDirection: 'column',
          gap: '8px', zIndex: 2002, padding: '8px', scrollbarWidth: 'none',
        }} className="hide-scrollbar">
          {filteredTurns.slice(-2).map((turn, idx) => (
            <div key={idx} style={{
              backgroundColor: turn.role === 'user' ? 'rgba(203,251,69,0.9)' : 'rgba(15,15,15,0.8)',
              backdropFilter: 'blur(10px)',
              color: turn.role === 'user' ? '#000' : '#fff',
              padding: '8px 14px', borderRadius: '16px',
              alignSelf: turn.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%', fontSize: '13px', lineHeight: '1.4', fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: turn.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
            }}>
              {turn.role === 'agent' ? (
                <StreamingText text={turn.text} isFinal={turn.isFinal} />
              ) : (
                turn.text
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 20px calc(16px + env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 2003,
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '24px',
            padding: '4px 6px 4px 16px', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <input
              type="text"
              placeholder="Ask Beatrice about this view..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              style={{ border: 'none', background: 'transparent', color: '#fff', fontSize: '14px', flex: 1, outline: 'none', padding: '8px 0' }}
            />
            <button onClick={handleSend} disabled={!message.trim()} style={{
              background: message.trim() ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
              color: message.trim() ? '#000' : 'rgba(255,255,255,0.3)',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', transition: 'all 0.2s ease',
            }}>
              <Send size={15} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: 0.6, fontSize: '11px', color: '#888', marginTop: '-4px', marginBottom: '-4px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Secure Context
          </span>
          <span>•</span>
          <span>Explicit Permission Only</span>
          <span>•</span>
          <span>No Background Capture</span>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={() => setMicState(!micState)} style={{
            width: '44px', height: '44px', borderRadius: '50%',
            backgroundColor: micState ? 'var(--accent-active)' : 'rgba(255,255,255,0.1)',
            color: micState ? '#fff' : '#aaa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', transition: 'background-color 0.2s',
          }}>
            <Mic size={18} fill={micState ? 'currentColor' : 'none'} />
          </button>

          <button onClick={() => { if (isWebcamActive) stopStream(); else startWebcam(); }} style={{
            width: '44px', height: '44px', borderRadius: '50%',
            backgroundColor: isWebcamActive ? 'var(--accent-active)' : 'rgba(255,255,255,0.1)',
            color: isWebcamActive ? '#fff' : '#aaa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', transition: 'background-color 0.2s',
          }}>
            <Video size={18} fill={isWebcamActive ? 'currentColor' : 'none'} />
          </button>

          <button onClick={() => { if (isScreenShareActive) stopStream(); else startScreenShare(); }} style={{
            width: '44px', height: '44px', borderRadius: '50%',
            backgroundColor: isScreenShareActive ? 'var(--accent-active)' : 'rgba(255,255,255,0.1)',
            color: isScreenShareActive ? '#fff' : '#aaa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', transition: 'background-color 0.2s',
          }}>
            <Cast size={18} fill={isScreenShareActive ? 'currentColor' : 'none'} />
          </button>

          <button onClick={() => { stopStream(); setIsMeetOpen(false); }} style={{
            width: '44px', height: '44px', borderRadius: '50%',
            backgroundColor: '#ef4444', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none',
          }}>
            <X size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
