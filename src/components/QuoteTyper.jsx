import React, { useEffect, useState } from 'react';
import './QuoteTyper.css';

export default function QuoteTyper({ show }) {
    const [displayed, setDisplayed] = useState('');
    const [startTyping, setStartTyping] = useState(false);

    const text =
        'I am deeply passionate about the intersection of digital media and AI, where creativity meets cutting-edge technology to shape new forms of expression. Exploring this evolving landscape allows me to constantly push boundaries and reimagine what’s possible through art and innovation.';

    useEffect(() => {
        if (!show) return;

        // Delay typing by 3 seconds after 'show' is true
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
            const delay = char === ',' ? 600 : 55;
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