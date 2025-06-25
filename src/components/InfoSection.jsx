import React, { useEffect, useRef, useState } from 'react';
import QuoteTyper from './QuoteTyper';
import LinkButtons from './LinkButtons';


export default function InfoSection() {
    const ref = useRef();
    const [hasAnimated, setHasAnimated] = useState(false);
    const [years, setYears] = useState(0);
    const [exhibitions, setExhibitions] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    animateNumbers();
                    setHasAnimated(true);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [hasAnimated]);

    const animateNumbers = () => {
        let y = 0, e = 0;
        const steps = 30;
        const duration = 800;
        const interval = duration / steps;
        const yTarget = 7;
        const eTarget = 16;

        const timer = setInterval(() => {
            y = Math.min(yTarget, y + yTarget / steps);
            e = Math.min(eTarget, e + eTarget / steps);
            setYears(Math.floor(y));
            setExhibitions(Math.floor(e));
            if (y >= yTarget && e >= eTarget) clearInterval(timer);
        }, interval);
    };

    return (
        <section ref={ref} style={styles.wrapper}>
        <div ref={ref} style={styles.overlay}>
  <div style={styles.inner}>
                    <div style={styles.line}>
                        <span style={styles.number}>{exhibitions}</span> Exhibitions Worldwide,&nbsp;
                        <span style={styles.number}>{years}+</span> Years in Design,&nbsp;
                        <span style={styles.number}>1</span> Passion: Digital Media & AI
                    </div>
                    <QuoteTyper show={hasAnimated} />
                    <LinkButtons />
  </div>
</div>
        </section>
    );
}

const styles = {
    wrapper: {
        padding: '12vh 6vw',
        background: '#fff',
        display: 'flex',
        justifyContent: 'center',
    },
    inner: {
        width: '100%',
        padding: '0 6vw',
        color: '#fff',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        lineHeight: 1.35,
        textAlign: 'center', // or 'left'
    },
    line: {
        marginBottom: '0.7em',
        color: '#111',
    },
    number: {
        fontWeight: 900,
        fontSize: '5.1em',

    },

};