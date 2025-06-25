import React, { useEffect, useState } from 'react';
import './QuoteTyper.css';

export default function QuoteTyper({ show }) {
    const [displayed, setDisplayed] = useState('');
    const [startTyping, setStartTyping] = useState(false);

    const text =
        'Hi, I’m Roberto, and my path has always followed the pulse of the digital world. The rise of AI didn’t just amplify my curiosity — it opened a space where imagination, learning, and creation feel limitless. I create, I share, and I stay open to discovery, always moving forward — and I find purpose in guiding others to do the same.';

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

            const slowChars = [',', '.', '—', '-', '–'];
            const delay = slowChars.includes(char) ? 600 : 50;

            timeoutId = setTimeout(type, delay);
        };

        type();
        return () => clearTimeout(timeoutId);
    }, [startTyping]);

    return (
        <p className="quote-typer">
            {displayed}
            <span className="cursor">▍</span>
        </p>
    );
}