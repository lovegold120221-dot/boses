import { Paperclip, Send, Mic, Video, Cast } from 'lucide-react';

interface MessageInputProps {
  message: string;
  setMessage: (val: string) => void;
  handleSend: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  micState: boolean;
  setMicState: (val: boolean) => void;
  clientVolume: number;
  isWebcamActive: boolean;
  isScreenShareActive: boolean;
  startWebcam: () => void;
  stopStream: () => void;
  startScreenShare: () => void;
}

export default function MessageInput({
  message, setMessage, handleSend, handleFileUpload, fileInputRef,
  micState, setMicState, clientVolume,
  isWebcamActive, isScreenShareActive, startWebcam, stopStream, startScreenShare
}: MessageInputProps) {
  return (
    <div className="bottom-dock">
      <div className="input-wrapper">
        <div className="input-bar">
          <button className="attach-btn" onClick={() => fileInputRef.current?.click()}><Paperclip size={20} /></button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
          <input
            type="text"
            id="message-input"
            placeholder="Message or ask Beatrice..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            autoComplete="off" />
          <button id="send-button" className="send-btn" onClick={handleSend}><Send size={18} /></button>
        </div>
      </div>
      <nav className="nav-controls">
        <button className="nav-item" onClick={() => {
          if (navigator.vibrate) navigator.vibrate(50);
          setMicState(!micState);
        }} style={{ color: micState ? 'var(--accent-active)' : 'var(--text-muted)' }}>
          <div className="icon-wrapper" style={{ position: 'relative', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {micState && clientVolume > 0.01 ? (
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '24px', justifyContent: 'center' }}>
                <div style={{ width: '3px', height: `${Math.max(4, clientVolume * 20)}px`, backgroundColor: clientVolume > 0.6 ? '#ef4444' : clientVolume > 0.3 ? '#f59e0b' : 'var(--accent-active)', borderRadius: '2px', transition: 'height 0.05s ease, background-color 0.1s ease' }} />
                <div style={{ width: '3px', height: `${Math.max(6, clientVolume * 35)}px`, backgroundColor: clientVolume > 0.6 ? '#ef4444' : clientVolume > 0.3 ? '#f59e0b' : 'var(--accent-active)', borderRadius: '2px', transition: 'height 0.05s ease, background-color 0.1s ease' }} />
                <div style={{ width: '3px', height: `${Math.max(8, clientVolume * 50)}px`, backgroundColor: clientVolume > 0.6 ? '#ef4444' : clientVolume > 0.3 ? '#f59e0b' : 'var(--accent-active)', borderRadius: '2px', transition: 'height 0.05s ease, background-color 0.1s ease' }} />
                <div style={{ width: '3px', height: `${Math.max(6, clientVolume * 35)}px`, backgroundColor: clientVolume > 0.6 ? '#ef4444' : clientVolume > 0.3 ? '#f59e0b' : 'var(--accent-active)', borderRadius: '2px', transition: 'height 0.05s ease, background-color 0.1s ease' }} />
                <div style={{ width: '3px', height: `${Math.max(4, clientVolume * 20)}px`, backgroundColor: clientVolume > 0.6 ? '#ef4444' : clientVolume > 0.3 ? '#f59e0b' : 'var(--accent-active)', borderRadius: '2px', transition: 'height 0.05s ease, background-color 0.1s ease' }} />
              </div>
            ) : (
              <Mic size={20} fill={micState ? 'currentColor' : 'none'} />
            )}
            <div className="icon-pulse" style={{
              position: 'absolute',
              width: micState ? `${20 + clientVolume * 40}px` : '0px',
              height: micState ? `${20 + clientVolume * 40}px` : '0px',
              opacity: micState && clientVolume > 0.01 ? 0.2 : 0,
              backgroundColor: clientVolume > 0.6 ? '#ef4444' : clientVolume > 0.3 ? '#f59e0b' : 'var(--accent-active)',
              borderRadius: '50%',
              zIndex: -1,
              transition: 'width 0.05s ease, height 0.05s ease'
            }}></div>
          </div>
          <span>Mic</span>
        </button>
        <button className="nav-item" onClick={isWebcamActive ? stopStream : startWebcam} style={{ color: isWebcamActive ? 'var(--accent-active)' : 'var(--text-muted)' }}>
          <div className="icon-wrapper">
            <div className="icon-pulse" style={{
              width: isWebcamActive ? `28px` : '0px',
              height: isWebcamActive ? `28px` : '0px',
              opacity: isWebcamActive ? 0.3 : 0,
              animation: isWebcamActive ? 'pulse-anim 2s infinite' : 'none'
            }}></div>
            <Video size={20} fill={isWebcamActive ? 'currentColor' : 'none'} />
          </div>
          <span>Camera</span>
        </button>
        <button className="nav-item" onClick={isScreenShareActive ? stopStream : startScreenShare} style={{ color: isScreenShareActive ? 'var(--accent-active)' : 'var(--text-muted)' }}>
          <div className="icon-wrapper">
            <div className="icon-pulse" style={{
              width: isScreenShareActive ? `28px` : '0px',
              height: isScreenShareActive ? `28px` : '0px',
              opacity: isScreenShareActive ? 0.3 : 0,
              animation: isScreenShareActive ? 'pulse-anim 2s infinite' : 'none'
            }}></div>
            <Cast size={20} fill={isScreenShareActive ? 'currentColor' : 'none'} />
          </div>
          <span>Share</span>
        </button>
      </nav>
    </div>
  );
}
