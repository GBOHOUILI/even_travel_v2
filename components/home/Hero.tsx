"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent, type MouseEvent } from "react";

export function Hero() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!heroRef.current || !bgRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
    bgRef.current.style.transform = `scale(1.06) translate(${x}%, ${y}%)`;
  }
  function handleMouseLeave() {
    if (bgRef.current) bgRef.current.style.transform = "scale(1)";
  }

  return (
    <section
      className="hero"
      aria-label="Hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hero__bg" ref={bgRef}>
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/accueil-poster.jpg"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src="/images/accueil.webm" type="video/webm" />
          <source src="/images/accueil.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero__overlay" role="region" aria-label="Intro">
        <small>WELCOME TO</small>
        <h1>Even Travel</h1>
        <h2>Circuit et Immersion</h2>
      </div>
    </section>
  );
}
