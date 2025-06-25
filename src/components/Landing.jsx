import React, { useEffect, useRef } from 'react'
import p5 from 'p5'

const Landing = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const sketch = (p) => {
      let t = 0
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight)
      }
      p.draw = () => {
        p.background(255)
        p.translate(p.width / 2, p.height / 2)
        p.noFill()
        p.stroke(0)
        p.beginShape()
        for (let a = 0; a < p.TWO_PI; a += 0.1) {
          const r = 200 + 50 * p.noise(t + a)
          const x = r * p.cos(a)
          const y = r * p.sin(a)
          p.vertex(x, y)
        }
        p.endShape(p.CLOSE)
        t += 0.01
      }
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
      }
    }

    const p5Instance = new p5(sketch, containerRef.current)
    return () => p5Instance.remove()
  }, [])

  return <section ref={containerRef} style={{ width: '100%', height: '100vh' }} />
}

export default Landing
