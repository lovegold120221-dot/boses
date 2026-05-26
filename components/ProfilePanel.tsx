import { Pencil, Trash2, X } from 'lucide-react';
import { useUI, useSettings, useLogStore } from '../lib/state';
import { signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface ProfilePanelProps {
  memories: any[];
  setMemories: (memories: any[]) => void;
  editingMemoryIndex: number | null;
  setEditingMemoryIndex: (index: number | null) => void;
  editingMemoryValue: string;
  setEditingMemoryValue: (value: string) => void;
  handleSaveSettingsAndProfile: () => Promise<void>;
}

export default function ProfilePanel({
  memories, setMemories,
  editingMemoryIndex, setEditingMemoryIndex,
  editingMemoryValue, setEditingMemoryValue,
  handleSaveSettingsAndProfile
}: ProfilePanelProps) {
  const activeOverlay = useUI((state) => state.activeOverlay);
  const setActiveOverlay = useUI((state) => state.setActiveOverlay);
  const userCallName = useSettings((state) => state.userCallName);
  const systemPrompt = useSettings((state) => state.systemPrompt);
  const setSystemPrompt = useSettings((state) => state.setSystemPrompt);

  const handleUpdateMemory = async (index: number, newValue: string) => {
    const user = auth.currentUser;
    if (!user) return;
    const newMemories = [...memories];
    newMemories[index] = { ...newMemories[index], content: newValue, updatedAt: new Date().toISOString() };
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { memories: newMemories }, { merge: true });
      setMemories(newMemories);
      setEditingMemoryIndex(null);
    } catch (e) {
      console.error('Failed to update memory:', e);
    }
  };

  const handleDeleteMemory = async (index: number) => {
    const user = auth.currentUser;
    if (!user) return;
    const newMemories = memories.filter((_, i) => i !== index);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { memories: newMemories }, { merge: true });
      setMemories(newMemories);
    } catch (e) {
      console.error('Failed to delete memory:', e);
    }
  };

  return (
    <div id="overlay-profile" className={`full-page-overlay ${activeOverlay === 'profile' ? 'active' : ''}`}>
      <div className="overlay-header">
        <div className="overlay-title">User Profile</div>
        <button className="close-overlay-btn" onClick={() => setActiveOverlay(null)}><X size={18} /></button>
      </div>
      <div className="overlay-content">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userCallName)}&background=cbfb45&color=000&size=100`}
            style={{ borderRadius: '50%', marginBottom: '12px' }}
            alt="Profile"
          />
          <h2 style={{ fontSize: '20px' }}>{userCallName}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{auth.currentUser?.email || 'guest@eburon.ai'}</p>
        </div>

        <div className="form-group">
          <label>Persona Background / Behavior</label>
          <textarea
            className="form-input"
            rows={5}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Tell Beatrice about your business context, communication style, reactive behavior..."
          ></textarea>
        </div>

        <div className="form-group" style={{ marginTop: '24px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Stored Memories
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{memories.length} item(s)</span>
          </label>
          <div className="memory-list" style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {memories.length === 0 ? (
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
                No memories stored yet. Talk to Beatrice to build context!
              </div>
            ) : (
              memories.map((m, i) => (
                <div key={i} className="memory-item" style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {editingMemoryIndex === i ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <textarea
                        className="form-input"
                        value={editingMemoryValue}
                        onChange={(e) => setEditingMemoryValue(e.target.value)}
                        rows={2}
                        autoFocus
                      />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          className="pill-btn"
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                          onClick={() => setEditingMemoryIndex(null)}
                        >Cancel</button>
                        <button
                          className="pill-btn"
                          style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: 'var(--accent-active)', color: 'var(--bg-main)' }}
                          onClick={() => handleUpdateMemory(i, editingMemoryValue)}
                        >Save</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', lineHeight: '1.4', flex: 1 }}>{m.content}</span>
                        <div style={{ display: 'flex', gap: '4px', marginLeft: '12px' }}>
                          <button
                            className="icon-btn"
                            style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            onClick={() => {
                              setEditingMemoryIndex(i);
                              setEditingMemoryValue(m.content);
                            }}
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            className="icon-btn"
                            style={{ color: '#ff4d4d', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            onClick={() => handleDeleteMemory(i)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'var(--accent-active)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.type}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{new Date(m.timestamp || m.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <button className="save-now-btn" onClick={async (e) => {
          const btn = e.currentTarget;
          btn.textContent = 'Saving...';
          await handleSaveSettingsAndProfile();
          btn.textContent = 'Saved!';
          setTimeout(() => { btn.textContent = 'Save Now'; setActiveOverlay(null); }, 1500);
        }}>Save Now</button>

        <div className="danger-action" onClick={() => { signOut(auth); }}>
          Log Out
        </div>
      </div>
    </div>
  );
}
