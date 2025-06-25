import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

/* ─ Palette ─ */
const paletteHex = [
    '#EBF4F4', '#F5E3D7', '#E04E4E', '#B5D2DF', '#9A8EA7',
    '#D7C4C4', '#C2E0E9', '#F2D6C3', '#ADA6BB', '#CDEDF1'
];

/* ─ Global knobs ─ */
const DENSITY = 1;
const MAX_OFFSET = 40;
const GALAXY_OFFSET = 1040;

const MOUSE_RANGE =320;
const REPULSE_FORCE =5.8;        // now used equally in burst & idle

const BG_EASE = 0.05;
const FOG_ALPHA = 50;

const PARTICLE_LIFE = 1200;
const STROKE_WIDTH = 70;

const CRAZY_RATIO = 0.10, CRAZY_BOOST = 3;
const LINEAR_RATIO = 0.03, LINEAR_BOOST = 3;

/* phase duration */
const RETURN_AFTER_FRAMES = 60 * 6;  // 15 s

/* idle wobble amplitude */
const HOVER_AMPLITUDE = 120;            // ±6 px gentle drift

/* ───────────────── Particle ───────────────── */
class Particle {
    constructor(x, y, col, speed, size, kind) {
        this.origin = { x, y };
        this.pos = { x, y };
        this.col = col;
        this.size = size;
        this.kind = kind;            // normal | crazy | linear
        this.state = 'burst';         // burst | returning | idle
        this.seed = p5.prototype.random(1000);

        if (kind === 'crazy') speed *= CRAZY_BOOST;
        this.baseSpeed = speed;

        if (kind === 'linear') {
            const dir = Math.random() < 0.5 ? -1 : 1;
            this.vel = { x: 0, y: dir * speed * LINEAR_BOOST };
        } else this.vel = { x: 0, y: 0 };
    }

    update(frame, mouse) {
        if (this.state === 'burst' && frame > RETURN_AFTER_FRAMES) {
            this.state = 'returning';
        }

        if (this.state === 'burst') this.burstMotion(frame, mouse);
        else if (this.state === 'returning') this.returnMotion();
        else this.idleMotion(frame, mouse);
    }

    burstMotion(frame, mouse) {
        if (this.kind !== 'linear') {
            const amp = this.kind === 'crazy' ? 0.006 : 0.004;
            const n = p5.prototype.noise(
                this.pos.x * amp,
                this.pos.y * amp,
                this.seed + frame * amp
            );
            const ang = n * Math.PI * 4;
            this.vel.x = Math.cos(ang) * this.baseSpeed;
            this.vel.y = Math.sin(ang) * this.baseSpeed;
            this.applyRepel(mouse, REPULSE_FORCE);
        }
        this.applyVel();
    }

    returnMotion() {
        const dx = this.origin.x - this.pos.x;
        const dy = this.origin.y - this.pos.y;
        this.vel.x = dx * 0.05;
        this.vel.y = dy * 0.05;
        if (Math.hypot(dx, dy) < 0.5) { this.state = 'idle'; this.vel = { x: 0, y: 0 }; }
        this.applyVel();
    }

    idleMotion(frame, mouse) {
        /* visible hover */
        const nx = p5.prototype.noise(this.seed + frame * 0.002) - 0.5;
        const ny = p5.prototype.noise(this.seed + 777 + frame * 0.002) - 0.5;
        this.pos.x = this.origin.x + nx * HOVER_AMPLITUDE;
        this.pos.y = this.origin.y + ny * HOVER_AMPLITUDE;

        /* strong repulsion, same as burst */
        this.applyRepel(mouse, REPULSE_FORCE);
    }

    applyRepel(mouse, forceFactor) {
        const dx = this.pos.x - mouse.x, dy = this.pos.y - mouse.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < MOUSE_RANGE * MOUSE_RANGE) {
            const d = Math.sqrt(dSq) || 1;
            const f = forceFactor * (1 - d / MOUSE_RANGE);
            this.pos.x += (dx / d) * f;
            this.pos.y += (dy / d) * f;
        }
    }

    applyVel() { this.pos.x += this.vel.x; this.pos.y += this.vel.y; }

    draw(pg) {
        pg.noStroke();
        pg.fill(this.col[0], this.col[1], this.col[2], 200);
        pg.circle(this.pos.x, this.pos.y, this.size);
    }
}

/* ───────────── React component ───────────── */
export default function CanvasPlayground() {
    const host = useRef(null);

    useEffect(() => {
        const sketch = (p) => {
            const palette = paletteHex.map(hex => p.color(hex));

            let mode = 'draw',
                pts = [],
                particles = [],
                frame = 0,
                mouse = { x: -9999, y: -9999 },
                bgCur = p.color(paletteHex[0]);

            p.setup = () => { p.createCanvas(p.windowWidth, p.windowHeight); };

            p.draw = () => {
                /* gradient background */
                const ix = p.constrain(mouse.x, 0, p.width) / p.width * (palette.length - 1);
                const base = Math.floor(ix), frac = ix - base;
                const bgT = p.lerpColor(palette[base], palette[Math.min(base + 1, palette.length - 1)], frac);
                bgCur = p.lerpColor(bgCur, bgT, BG_EASE);
                p.background(bgCur);
                p.noStroke(); p.fill(255, FOG_ALPHA); p.rect(0, 0, p.width, p.height);

                if (mode === 'draw') drawSpline(p, pts, '#E04E4E', STROKE_WIDTH);
                else {
                    particles.forEach(pr => pr.update(frame, mouse));
                    particles.forEach(pr => pr.draw(p));
                }
                frame++; if (mode === 'draw') {
                    drawSpline(p, pts, '#E04E4E', STROKE_WIDTH);
                } else {
                    particles.forEach(pr => pr.update(frame, mouse));
                    particles.forEach(pr => pr.draw(p));
                }

                // 🆕 SKETCH LABELS
                p.fill(255);
                p.noStroke();
                p.textFont('Helvetica'); // or 'Kugile' if loaded
                p.textSize(80);
                p.textStyle(p.BOLD);

                p.textAlign(p.LEFT, p.TOP);
                p.text('SKETCH', 16, 16);

                p.textAlign(p.RIGHT, p.TOP);
                p.text('SKETCH', p.width - 16, 16);

                p.textAlign(p.LEFT, p.BOTTOM);
                p.text('SKETCH', 16, p.height - 16);

                p.textAlign(p.RIGHT, p.BOTTOM);
                p.text('SKETCH', p.width - 16, p.height - 16);

                frame++;
           
            };

            /* events */
            p.mouseMoved = () => { mouse = { x: p.mouseX, y: p.mouseY }; };
            p.mousePressed = () => { pts = [{ x: p.mouseX, y: p.mouseY }]; mode = 'draw'; };
            p.mouseDragged = () => {
                if (mode !== 'draw') return;
                const last = pts[pts.length - 1];
                if (!last || p.dist(last.x, last.y, p.mouseX, p.mouseY) > 4)
                    pts.push({ x: p.mouseX, y: p.mouseY });
            };
            p.mouseReleased = () => {
                if (pts.length > 2) { spawn(); mode = 'burst'; frame = 0; }
            };
            p.keyPressed = () => { if (p.key === 'r' || p.key === 'R') reset(); };
            p.windowResized = () => { p.resizeCanvas(p.windowWidth, p.windowHeight); };

            const reset = () => { pts = []; particles = []; mode = 'draw'; };

            /* helpers */
            const drawSpline = (pg, a, col, w) => {
                if (a.length < 2) return;
                pg.stroke(col); pg.strokeWeight(w); pg.noFill(); pg.curveTightness(0.5);
                const s = chaikin(a, 4);
                pg.beginShape(); pg.curveVertex(s[0].x, s[0].y);
                s.forEach(({ x, y }) => pg.curveVertex(x, y));
                pg.curveVertex(s[s.length - 1].x, s[s.length - 1].y); pg.endShape();
            };

            const spawn = () => {
                particles = [];
                const s = chaikin(pts, 4);
                const haloCol = palette[Math.floor(Math.random() * palette.length)].levels.slice(0, 3);

                s.forEach((b, i) => {
                    const n = normal(s, i);
                    palette.forEach(hex => {
                        const rgb = hex.levels.slice(0, 3);
                        for (let k = 0; k < DENSITY; k++) {
                            const off = p.random(-MAX_OFFSET, MAX_OFFSET);
                            particles.push(new Particle(
                                b.x + n.x * off, b.y + n.y * off, rgb,
                                0.3 + 0.9 * Math.abs(off) / MAX_OFFSET,
                                p.random(1, 7),
                                pickKind()
                            ));
                        }
                        const gOff = p.random(-GALAXY_OFFSET, GALAXY_OFFSET);
                        particles.push(new Particle(
                            b.x + n.x * gOff, b.y + n.y * gOff, haloCol,
                            0.15 + 0.25 * Math.abs(gOff) / GALAXY_OFFSET,
                            p.random(1, 4),
                            pickKind()
                        ));
                    });
                });
            };

            const pickKind = () => {
                const r = Math.random();
                if (r < LINEAR_RATIO) return 'linear';
                if (r < LINEAR_RATIO + CRAZY_RATIO) return 'crazy';
                return 'normal';
            };

            /* math utils */
            const chaikin = (ar, it = 1) =>
                it === 0 || ar.length < 3 ? ar :
                    chaikin(ar.flatMap((p0, i) => i < ar.length - 1 ? [
                        { x: 0.75 * p0.x + 0.25 * ar[i + 1].x, y: 0.75 * p0.y + 0.25 * ar[i + 1].y },
                        { x: 0.25 * p0.x + 0.75 * ar[i + 1].x, y: 0.25 * p0.y + 0.75 * ar[i + 1].y }
                    ] : []), it - 1);

            const normal = (ar, i) => {
                const a = ar[Math.max(i - 1, 0)], b = ar[Math.min(i + 1, ar.length - 1)];
                const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
                return { x: -dy / len, y: dx / len };
            };
        };

        const inst = new p5(sketch, host.current);
        return () => inst.remove();
    }, []);

    return <section ref={host} style={{ width: '100%', height: '100vh', cursor: 'crosshair' }} />;
}