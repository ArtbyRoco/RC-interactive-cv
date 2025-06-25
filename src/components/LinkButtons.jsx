import React from 'react';

export default function LinkButtons() {
    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <a style={styles.glassButton} href="/cv.pdf" download target="_blank" rel="noopener noreferrer">
                    CV
                </a>
                <a style={styles.glassButton} href="https://www.rocolab.eu" target="_blank" rel="noopener noreferrer">
                    Official Website
                </a>
                <a style={styles.glassButton} href="https://www.linkedin.com/in/robertococcia" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                </a>
            </div>
            <p style={styles.footer}>
                Created by Roberto Coccia · Interactive section: <em>Particles Machine</em> · June 2025
            </p>
        </div>
    );
}

const styles = {
    container: {
        textAlign: 'center',
        marginTop: '14vh',
        marginBottom: '12vh',
        zIndex: 10,
        position: 'relative',
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
    },
    glassButton: {
        padding: '1em 2.8em',
        fontSize: '1.5rem',
        fontWeight: 400,
        textDecoration: 'none',
        color: '#000',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderRadius: '16px',
        boxShadow: `
      0 0 0.5px rgba(255, 255, 255, 0.3),
      0 4px 30px rgba(0, 0, 0, 0.25)
    `,
        transition: 'all 0.3s ease',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        letterSpacing: '0.05em',
    },
    footer: {
        marginTop: '14vh',
        fontSize: '0.9rem',
        color: '#aaa',
        fontStyle: 'normal',
        letterSpacing: '0.02em',
    },
};