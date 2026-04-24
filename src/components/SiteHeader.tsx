"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const HIDDEN_ON = ["/", "/ta-dig-hit", "/om-oss", "/login"];
const HIDDEN_PREFIX = ["/rutt/"];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  if (HIDDEN_ON.includes(pathname)) return null;
  if (HIDDEN_PREFIX.some(p => pathname.startsWith(p))) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className={`site-topbar${scrolled ? " scrolled" : ""}`}>
        <a href="/" className="site-logo" aria-label="Discover Malmö hem">
          <img src="/logo-transparent.png" alt="Discover Malmö" className="logo-img-brand" />
        </a>

        <nav className="site-nav" aria-label="Huvudmeny">
          <a href="/" className={isActive("/") && pathname === "/" ? "site-nav-active" : ""}>Upptäck</a>
          <a href="/upplevelser" className={isActive("/upplevelser") ? "site-nav-active" : ""}>Upplevelser</a>
          <a href="/ta-dig-hit" className={isActive("/ta-dig-hit") ? "site-nav-active" : ""}>Planera</a>
          <a href="/om-oss" className={isActive("/om-oss") ? "site-nav-active" : ""}>Om oss</a>
        </nav>

        <button
          className={`site-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </header>

      {menuOpen && (
        <div className="site-mobile-menu" role="dialog" aria-label="Mobilmeny">
          <a href="/" onClick={() => setMenuOpen(false)}>Upptäck</a>
          <a href="/upplevelser" onClick={() => setMenuOpen(false)}>Upplevelser</a>
          <a href="/ta-dig-hit" onClick={() => setMenuOpen(false)}>Planera</a>
          <a href="/om-oss" onClick={() => setMenuOpen(false)}>Om oss</a>
        </div>
      )}
    </>
  );
}
