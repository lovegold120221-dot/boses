import { X, Cpu, CheckSquare, Square, Plus, Pencil, Trash2, Plug } from 'lucide-react';
import { useUI, useSettings, useTools } from '../lib/state';
import { LANGUAGES } from '../lib/languages';

interface SettingsPanelProps {
  googleToken: string | null;
  connected: boolean;
  setEditingTool: (tool: any | null) => void;
  handleGoogleConnectInOverlay: () => Promise<void>;
  handleSaveSettingsAndProfile: () => Promise<void>;
}

export default function SettingsPanel({
  googleToken, connected, setEditingTool,
  handleGoogleConnectInOverlay, handleSaveSettingsAndProfile
}: SettingsPanelProps) {
  const activeOverlay = useUI((state) => state.activeOverlay);
  const setActiveOverlay = useUI((state) => state.setActiveOverlay);
  const personaName = useSettings((state) => state.personaName);
  const setPersonaName = useSettings((state) => state.setPersonaName);
  const userCallName = useSettings((state) => state.userCallName);
  const setUserCallName = useSettings((state) => state.setUserCallName);
  const systemPrompt = useSettings((state) => state.systemPrompt);
  const setSystemPrompt = useSettings((state) => state.setSystemPrompt);
  const voice = useSettings((state) => state.voice);
  const setVoice = useSettings((state) => state.setVoice);
  const language = useSettings((state) => state.language);
  const setLanguage = useSettings((state) => state.setLanguage);
  const tools = useTools((state) => state.tools);
  const toggleTool = useTools((state) => state.toggleTool);
  const addTool = useTools((state) => state.addTool);
  const removeTool = useTools((state) => state.removeTool);
  const setTemplate = useTools((state) => state.setTemplate);

  return (
    <div id="overlay-settings" className={`full-page-overlay ${activeOverlay === 'settings' ? 'active' : ''}`}>
      <div className="overlay-header">
        <div className="overlay-title">App Settings</div>
        <button className="close-overlay-btn" onClick={() => setActiveOverlay(null)}><X size={18} /></button>
      </div>
      <div className="overlay-content">
        <div className="form-group">
          <label>Persona Name</label>
          <input type="text" className="form-input" value={personaName} onChange={(e) => setPersonaName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>How to call you</label>
          <input type="text" className="form-input" value={userCallName} onChange={(e) => setUserCallName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Behavior Persona (How does it react? How does it respond?)</label>
          <textarea
            className="form-input"
            rows={4}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="e.g. Friendly, patient, and solutions-oriented..."
          />
        </div>

        <div className="form-group">
          <label>Presets</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            <button
              type="button"
              className="pill-btn"
              onClick={() => setTemplate('personal-assistant')}
              style={{ padding: '6px 12px', borderRadius: '16px', border: '1px solid var(--border-color)', fontSize: '12px', background: 'transparent', cursor: 'pointer' }}
            >
              Personal Assistant
            </button>
            <button
              type="button"
              className="pill-btn"
              onClick={() => setTemplate('customer-support')}
              style={{ padding: '6px 12px', borderRadius: '16px', border: '1px solid var(--border-color)', fontSize: '12px', background: 'transparent', cursor: 'pointer' }}
            >
              Customer Support
            </button>
            <button
              type="button"
              className="pill-btn"
              onClick={() => setTemplate('navigation-system')}
              style={{ padding: '6px 12px', borderRadius: '16px', border: '1px solid var(--border-color)', fontSize: '12px', background: 'transparent', cursor: 'pointer' }}
            >
              Navigation System
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Voice Persona</label>
          <select className="form-input" onChange={(e) => setVoice(e.target.value)} value={voice}>
            <option value="Aoede">Aoede</option>
            <option value="Charon">Charon</option>
            <option value="Fenrir">Fenrir</option>
            <option value="Kore">Kore</option>
            <option value="Puck">Puck</option>
          </select>
        </div>
        <div className="form-group">
          <label>Language</label>
          <select className="form-input" onChange={(e) => setLanguage(e.target.value)} value={language}>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginTop: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={14} className="text-[#cbfb45]" />
            Dynamic Tools Map
          </label>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: '1.4' }}>
            Enable, configure, or add custom integration tools that Beatrice can call during conversation.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
            {tools.map(tool => (
              <div
                key={tool.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px'
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1, minWidth: 0 }}>
                  <input
                    type="checkbox"
                    id={`tool-checkbox-${tool.name}`}
                    checked={tool.isEnabled}
                    onChange={() => toggleTool(tool.name)}
                    disabled={connected}
                    style={{ display: 'none' }}
                  />
                  <span style={{ color: tool.isEnabled ? '#cbfb45' : 'var(--text-muted)', display: 'flex', alignItems: 'center', shrink: 0 }}>
                    {tool.isEnabled ? <CheckSquare size={18} /> : <Square size={18} />}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tool.name}
                  </span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingTool(tool)}
                    disabled={connected}
                    style={{
                      padding: '8px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    title="Edit schema parameter"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTool(tool.name)}
                    disabled={connected}
                    style={{
                      padding: '8px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255,77,77,0.1)',
                      border: 'none',
                      color: '#ff4d4d',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    title="Remove tool"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addTool}
            disabled={connected}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              backgroundColor: 'transparent',
              border: '1.5px dashed var(--border-color)',
              borderRadius: '16px',
              color: 'var(--text-main)',
              fontSize: '14px',
              fontWeight: 600,
              marginTop: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={16} /> Add Function Call Call
          </button>
        </div>

        {/* Google Workspace Connection & Permissions */}
        <div className="form-group" style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Plug size={16} style={{ color: '#cbfb45' }} />
            Google Workspace Account
          </label>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
            Connect your Google Account to authorize all Workspace tools (Gmail, Calendar, Drive, Docs, Sheets, Tasks, Contacts). This stores your token securely in Firestore for function calling.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: googleToken ? '#cbfb45' : '#ff4d4d',
                  boxShadow: googleToken ? '0 0 10px #cbfb45' : '0 0 10px #ff4d4d'
                }}></div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: googleToken ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {googleToken ? 'Google Account Connected' : 'Google Account Disconnected'}
                </span>
              </div>
              {googleToken && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: 'rgba(203, 251, 69, 0.1)', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(203, 251, 69, 0.2)' }}>
                  Active Token
                </span>
              )}
            </div>

            {googleToken && (
              <div style={{ fontSize: '12px', wordBreak: 'break-all', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                Token Signature: {googleToken.substring(0, 15)}...
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleConnectInOverlay}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                backgroundColor: googleToken ? 'rgba(255,255,255,0.05)' : '#cbfb45',
                border: googleToken ? '1px solid var(--border-color)' : 'none',
                borderRadius: '12px',
                color: googleToken ? 'var(--text-main)' : '#000',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginTop: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="icon" style={{ fontSize: '16px' }}>account_circle</span>
                {googleToken ? 'Reconnect / Grant Workspace Permissions' : 'Connect Google Workspace'}
              </div>
            </button>
          </div>
        </div>

        <button className="save-now-btn" onClick={async (e) => {
          const btn = e.currentTarget;
          btn.textContent = 'Saving...';
          await handleSaveSettingsAndProfile();
          btn.textContent = 'Settings Saved!';
          setTimeout(() => { btn.textContent = 'Save Settings'; setActiveOverlay(null); }, 1500);
        }}>Save Settings</button>
      </div>
    </div>
  );
}
