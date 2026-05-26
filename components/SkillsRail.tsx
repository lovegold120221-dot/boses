import {
  User, ListChecks, Calendar, FolderOpen, Search, Signature,
  Building2, Video, MessageSquare, Settings, Wrench, History,
  QrCode, MapPin, Brain, Presentation, Mail, Table,
  FileStack, Paperclip
} from 'lucide-react';
import { useUI } from '../lib/state';

interface SkillsRailProps {
  handleToolAction: (toolId: string) => void;
}

export default function SkillsRail({ handleToolAction }: SkillsRailProps) {
  return (
    <div id="skills-rail">
      <div className="skills-row" data-row="1">
        <div className="skills-track">
          <div className="skill-chip" onClick={() => handleToolAction('profile')}><div className="skill-glyph bg-profile"><User size={22} /></div><span className="skill-label">Profile</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('tasks')}><div className="skill-glyph bg-tasks"><ListChecks size={22} /></div><span className="skill-label">Tasks</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('calendar')}><div className="skill-glyph bg-calendar"><Calendar size={22} /></div><span className="skill-label">Calendar</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('drive')}><div className="skill-glyph bg-drive"><FolderOpen size={22} /></div><span className="skill-label">Drive</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('google')}><div className="skill-glyph bg-google"><Search size={22} color="#4285F4" /></div><span className="skill-label">Google</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('signature')}><div className="skill-glyph bg-signature"><Signature size={22} /></div><span className="skill-label">Sign</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('company')}><div className="skill-glyph bg-company"><Building2 size={22} /></div><span className="skill-label">Company</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('chat')}><div className="skill-glyph bg-chat"><MessageSquare size={22} color="#00ac47" /></div><span className="skill-label">Chat</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('forms')}><div className="skill-glyph bg-forms"><FileStack size={22} color="#7248b9" /></div><span className="skill-label">Forms</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('keep')}><div className="skill-glyph bg-keep"><Paperclip size={22} color="#fbbc04" /></div><span className="skill-label">Keep</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('meet')}><div className="skill-glyph bg-meet"><Video size={22} /></div><span className="skill-label">Meet</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('whatsapp')}><div className="skill-glyph bg-whatsapp"><MessageSquare size={22} /></div><span className="skill-label">WhatsApp</span></div>
        </div>
      </div>
      <div className="skills-row" data-row="2">
        <div className="skills-track">
          <div className="skill-chip" onClick={() => handleToolAction('settings')}><div className="skill-glyph bg-settings"><Settings size={22} /></div><span className="skill-label">Settings</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('tools')}><div className="skill-glyph bg-tools"><Wrench size={22} /></div><span className="skill-label">Tools</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('history')}><div className="skill-glyph bg-history"><History size={22} /></div><span className="skill-label">History</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('scanner')}><div className="skill-glyph bg-scanner"><QrCode size={22} /></div><span className="skill-label">Scanner</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('location')}><div className="skill-glyph bg-location"><MapPin size={22} /></div><span className="skill-label">Location</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('knowledge')}><div className="skill-glyph bg-knowledge"><Brain size={22} /></div><span className="skill-label">Knowledge</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('proposal')}><div className="skill-glyph bg-proposal"><Presentation size={22} /></div><span className="skill-label">Proposal</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('gmail')}><div className="skill-glyph bg-gmail"><Mail size={22} /></div><span className="skill-label">Mail</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('sheets')}><div className="skill-glyph bg-sheets"><Table size={22} /></div><span className="skill-label">Sheets</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('slides')}><div className="skill-glyph bg-slides"><FileStack size={22} /></div><span className="skill-label">Slides</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('contract')}><div className="skill-glyph bg-contract" style={{background: 'linear-gradient(135deg, #d4af37, #aa8222)'}}><Signature size={22} /></div><span className="skill-label">Contract</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('invoice')}><div className="skill-glyph bg-invoice" style={{background: 'linear-gradient(135deg, #60a5fa, #2563eb)'}}><FileStack size={22} /></div><span className="skill-label">Invoice</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('contacts')}><div className="skill-glyph bg-contacts"><User size={22} color="#1a73e8" /></div><span className="skill-label">Contacts</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('firebase')}><div className="skill-glyph bg-firebase" style={{background: '#ffca28'}}><Brain size={22} /></div><span className="skill-label">Firebase</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('docs')}><div className="skill-glyph bg-docs" style={{background: 'linear-gradient(135deg, #34d399, #059669)'}}><FileStack size={22} /></div><span className="skill-label">Docs</span></div>
          <div className="skill-chip" onClick={() => handleToolAction('picker')}><div className="skill-glyph bg-picker"><Search size={22} /></div><span className="skill-label">Picker</span></div>
        </div>
      </div>
    </div>
  );
}
