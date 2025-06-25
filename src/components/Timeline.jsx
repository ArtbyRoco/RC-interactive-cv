import React from 'react';

const milestones = [
  { year: 2025, title: 'AI-driven Light Sculpture', blurb: 'Commissioned by Utrecht Light Fest; used GAN-generated patterns.' },
  { year: 2023, title: 'Lecturer, MediaLab XYZ', blurb: 'Redesigned “Intro to Creative Coding” with p5.js + Arduino.' },
  { year: 2021, title: 'MA, Art & Technology — HKU', blurb: 'Graduated with honours; thesis on generative pedagogy.' },
  // add / remove items at will
];

export default function Timeline() {
  return (
    <section className="timeline">
      <h2>Journey so far</h2>

      {milestones.map(({ year, title, blurb }) => (
        <article key={year}>
          <h3>{year}</h3>
          <h4>{title}</h4>
          <p>{blurb}</p>
        </article>
      ))}
    </section>
  );
}
