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

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/events?${params.toString()}`);
  }

  return (
    <section
      className="hero"
      aria-label="Hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="hero__bg"
        id="heroBg"
        ref={bgRef}
        style={{ backgroundImage: "url(/images/accueil.GIF)" }}
      />
      <div className="hero__overlay" role="region" aria-label="Intro">
        <small>WELCOME TO</small>
        <h1>Even Travel</h1>
        <h2>Circuit et Immersion</h2>
        {/*<form className="searchbar" aria-label="Recherche" onSubmit={handleSearch}>
          <input
            aria-label="Recherche"
            placeholder="Recherchez un événement ou une destination..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Lancer la recherche">
            Search
          </button>
        </form>*/}
      </div>
    </section>
  );
}
