import { useState, useEffect } from 'react';

export function StreamingText({ text, isFinal }: { text: string; isFinal: boolean }) {
  const [displayedText, setDisplayedText] = useState(isFinal ? text : '');

  useEffect(() => {
    if (isFinal) {
      setDisplayedText(text);
      return;
    }

    const words = text.split(' ');
    const currentWords = displayedText.split(' ').filter(Boolean);

    if (currentWords.length < words.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(words.slice(0, currentWords.length + 1).join(' '));
      }, 70);
      return () => clearTimeout(timeout);
    }
  }, [text, isFinal, displayedText]);

  return <span>{displayedText}</span>;
}
