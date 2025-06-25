import React, { useEffect, useState } from 'react';
import './QuoteTyper.css';

export default function QuoteTyper({ show }) {
    const [displayed, setDisplayed] = useState('');
    const [startTyping, setStartTyping] = useState(false);

    const text =
        'Hi, I’m Roberto, and my path has always followed the pulse of the digital world. The rise of AI didn’t just amplify my curiosity — it opened a space where imagination, learning, and creation feel limitless. I create, I share, and I stay open to discovery, always moving forward — and I find purpose in guiding others to do the same.\n\nDiscover my path, projects, and passion — links below.';

    useEffect(() => {
        if (!show) return;

        const delayTimer = setTimeout(() => {
            setStartTyping(true);
        }, 3000);

        return () => clearTimeout(delayTimer);
    }, [show]);

    useEffect(() => {
        if (!startTyping) return;

        let i = 0;
        let timeoutId;

        const type = () => {
            if (i >= text.length) return;

            const char = text[i];
            setDisplayed((prev) => prev + char);
            i++;

            const nextTwo = text.slice(i - 2, i);
            const isBreak = nextTwo === '\n\n';
            const isPauseChar = [',', '—', '-', '–'].includes(char);
            const isPeriod = char === '.';

            const delay = isBreak
                ? 1000
                : isPeriod
                    ? 800
                    : isPauseChar
                        ? 600
                        : 50;

            timeoutId = setTimeout(type, delay);
        };

        type();
        return () => clearTimeout(timeoutId);
    }, [startTyping]);

    // Split lines by '\n' and add the blinking cursor to the last one
    const lines = displayed.split('\n');
    const lastLineIndex = lines.length - 1;

    return (
        <div className="quote-typer">
            {lines.map((line, index) => (
                <span key={index} className="line">
                    {line}
                    {index === lastLineIndex && <span className="cursor">▍</span>}
                </span>
            ))}
        </div>
    );
}