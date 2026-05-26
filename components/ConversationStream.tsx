import { useLogStore } from '../lib/state';
import { StreamingText } from './StreamingText';

interface ConversationStreamProps {
  filteredTurns: any[];
  chatAreaRef: React.RefObject<HTMLDivElement | null>;
}

export default function ConversationStream({ filteredTurns, chatAreaRef }: ConversationStreamProps) {
  return (
    <main id="text-streaming-area" ref={chatAreaRef}>
      <div id="conversation-container">
        <div className="conversation-message ai">Hey Boss! I'm Beatrice. Connect your session!</div>
        {filteredTurns.map((turn, i) => (
          <div key={i} className={`conversation-message ${turn.role === 'user' ? 'user' : 'ai'}`}>
            {turn.role === 'agent' ? (
              <StreamingText text={turn.text} isFinal={turn.isFinal} />
            ) : (
              turn.text
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
