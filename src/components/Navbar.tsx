"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import { WEDDING_COUPLE } from "@/config/weddingData";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const navLinks = [
    { label: "Invitation", href: "#official-invitation" },
    { label: "Our Story", href: "#story" },
    { label: "Our Families", href: "#families" },
    { label: "Celebrations", href: "#celebrations" },
    { label: "Gallery", href: "#gallery" },
    { label: "RSVP", href: "#rsvp" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["official-invitation", "story", "families", "celebrations", "gallery", "rsvp"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`navbar-header ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="container navbar-container">
          {/* Couple Monogram Brand */}
          <Link href="#hero" className="navbar-brand" aria-label="Arpan and Arpita Wedding Home">
            <span className="brand-monogram">A &amp; A</span>
            <span className="brand-names">{WEDDING_COUPLE.groom.name.split(" ")[0]} &amp; {WEDDING_COUPLE.bride.name.split(" ")[0]}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  {link.label}
                  {isActive && <span className="nav-dot" aria-hidden="true" />}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Audio + RSVP Action + Mobile Hamburger */}
          <div className="navbar-actions">
            <AudioPlayer />
            <Link href="#rsvp" className="btn-rsvp-nav">
              <Heart size={14} className="icon-heart" />
              <span>RSVP</span>
            </Link>
            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className="mobile-drawer"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Mobile Navigation"
        >
          <div className="drawer-header">
            <span className="drawer-monogram">{WEDDING_COUPLE.monogram}</span>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className="drawer-names font-serif">
            {WEDDING_COUPLE.headline}
          </div>
          <p className="drawer-tagline">“{WEDDING_COUPLE.tagline}”</p>

          <div className="drawer-divider" />

          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="drawer-footer">
            <Link
              href="#rsvp"
              className="btn-gold drawer-rsvp-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              Confirm Your Attendance
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height);
          z-index: 100;
          transition: all 0.35s ease;
          display: flex;
          align-items: center;
          background: rgba(248, 245, 238, 0.88);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(197, 164, 109, 0.2);
        }

        .navbar-scrolled {
          background: rgba(248, 245, 238, 0.98);
          box-shadow: 0 4px 20px rgba(41, 40, 36, 0.08);
          border-bottom: 1px solid rgba(197, 164, 109, 0.35);
        }

        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-monogram {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--color-forest);
          font-weight: 600;
          border: 1px solid var(--color-gold);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(197, 164, 109, 0.2);
        }

        .brand-names {
          font-family: var(--font-serif);
          font-size: 1.18rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--color-forest);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: clamp(0.8rem, 1.8vw, 1.8rem);
        }

        .nav-link {
          font-size: 0.86rem;
          font-weight: 500;
          color: var(--color-charcoal-muted);
          position: relative;
          padding: 0.4rem 0;
          transition: color 0.2s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--color-forest);
          font-weight: 600;
        }

        .nav-dot {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: var(--color-gold);
          border-radius: 50%;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-rsvp-nav {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background-color: var(--color-forest);
          color: var(--color-ivory);
          padding: 0.45rem 1.1rem;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          transition: all 0.25s ease;
        }

        .btn-rsvp-nav:hover {
          background-color: var(--color-gold-deep);
          transform: translateY(-1px);
        }

        .icon-heart {
          color: var(--color-gold);
        }

        .mobile-toggle-btn {
          display: none;
          color: var(--color-forest);
          padding: 0.3rem;
        }

        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(41, 40, 36, 0.4);
          backdrop-filter: blur(4px);
          z-index: 200;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .mobile-drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .mobile-drawer {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 82%;
          max-width: 340px;
          background: var(--color-ivory);
          box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mobile-drawer-overlay.open .mobile-drawer {
          transform: translateX(0);
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .drawer-monogram {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: var(--color-gold-deep);
          border: 1px solid var(--color-gold);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-close-btn {
          color: var(--color-forest);
          padding: 0.4rem;
        }

        .drawer-names {
          font-size: 1.25rem;
          color: var(--color-forest);
          letter-spacing: 0.04em;
        }

        .drawer-tagline {
          font-size: 0.82rem;
          color: var(--color-gold-deep);
          margin-top: 0.2rem;
          font-style: italic;
        }

        .drawer-divider {
          height: 1px;
          background: rgba(197, 164, 109, 0.3);
          margin: 1.5rem 0;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          flex: 1;
        }

        .mobile-nav-link {
          font-size: 1.1rem;
          font-family: var(--font-serif);
          color: var(--color-forest);
          font-weight: 500;
          padding: 0.2rem 0;
          border-bottom: 1px solid rgba(197, 164, 109, 0.15);
        }

        .drawer-footer {
          margin-top: auto;
          padding-top: 1.5rem;
        }

        .drawer-rsvp-btn {
          width: 100%;
          text-align: center;
        }

        @media (max-width: 868px) {
          .desktop-nav {
            display: none;
          }
          .mobile-toggle-btn {
            display: inline-flex;
          }
          .btn-rsvp-nav {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
