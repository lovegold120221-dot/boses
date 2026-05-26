import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Lock, Check } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthScreenProps {
  isAuthOpen: boolean;
  isSignupMode: boolean;
  email: string;
  password: string;
  name: string;
  authError: string;
  handleEmailAuth: (e: React.FormEvent) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  setIsSignupMode: (val: boolean) => void;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  setName: (val: string) => void;
  setIsAuthOpen: (val: boolean) => void;
}

export default function AuthScreen({
  isAuthOpen, isSignupMode, email, password, name, authError,
  handleEmailAuth, handleGoogleLogin,
  setIsSignupMode, setEmail, setPassword, setName, setIsAuthOpen
}: AuthScreenProps) {
  return (
    <div id="auth-screen" className={`full-page-overlay ${isAuthOpen ? 'active' : ''}`}>
      <div className="auth-glow"></div>
      <div className="auth-card" id="auth-card-inner">
        <div className="auth-logo-box" style={{ background: 'transparent' }}>
          <img src="https://eburon.ai/icon-eburon.svg" alt="Eburon Logo" style={{ width: '60px', height: '60px' }} />
        </div>

        <h2>{isSignupMode ? 'Register' : 'Login'}</h2>
        <p className="subtitle">{isSignupMode ? 'Create your new account' : 'Welcome back to Eburon'}</p>

        <form className="auth-form" onSubmit={handleEmailAuth}>
          {authError && <div style={{color:'red', marginBottom:'10px', fontSize:'14px'}}>{authError}</div>}
          {isSignupMode && (
            <div className="auth-input-wrapper">
              <User size={20} className="auth-icon-left" />
              <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="auth-input-wrapper">
            <Mail size={20} className="auth-icon-left" />
            <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="auth-input-wrapper">
            <Lock size={20} className="auth-icon-left" />
            <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {isSignupMode && (
            <div className="auth-input-wrapper">
              <Lock size={20} className="auth-icon-left" />
              <input type="password" placeholder="Confirm password" />
            </div>
          )}
          <button type="submit" className="auth-submit-btn">{isSignupMode ? 'Sign up' : 'Sign in'}</button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <div className="g-icon-circle">G</div>
          Continue with Google
        </button>

        <div className="permissions-note">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} style={{color: 'var(--accent-active)'}} /> Google Workspace Sync</span>
          <span>Requires Read/Write permissions for Gmail, Drive, Calendar, and Tasks to enable full automation.</span>
        </div>

        <div className="auth-toggle">
          {isSignupMode ? 'Back to ' : 'Don\'t have an account? '}
          <span onClick={() => setIsSignupMode(!isSignupMode)}>
            {isSignupMode ? 'Sign in' : 'Sign up'}
          </span>
        </div>

      </div>
    </div>
  );
}
