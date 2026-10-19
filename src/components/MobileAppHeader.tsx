"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AudioPlayer from "./AudioPlayer";
import { Calendar } from "lucide-react";

export default function MobileAppHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`mobile-app-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner">
        {/* Clean Luxury Typography: Just Arpan & Arpita */}
        <Link href="#hero" className="header-brand" aria-label="Arpan & Arpita Wedding">
          <div className="brand-text">
            <span className="couple-names font-serif">
              Arpan <span className="ampersand">&amp;</span> Arpita
            </span>
            <span className="wedding-subtag">
              <Calendar size={10} className="tag-calendar-icon" />
              <span>11 Nov 2026 • Lucknow</span>
            </span>
          </div>
        </Link>

        {/* Right action: Music Toggle */}
        <div className="header-right">
          <AudioPlayer />
        </div>
      </div>

      <style jsx>{`
        .mobile-app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 990;
          display: flex;
          justify-content: center;
          padding: 0.6rem 0.85rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .header-inner {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 480px;
          background: rgba(254, 252, 248, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(197, 164, 109, 0.42);
          border-radius: 32px;
          padding: 0.55rem 1.15rem;
          box-shadow: 
            0 8px 24px rgba(32, 61, 50, 0.08),
            0 1px 3px rgba(197, 164, 109, 0.15);
          transition: all 0.25s ease;
        }

        .mobile-app-header.scrolled .header-inner {
          background: rgba(255, 255, 255, 0.98);
          border-color: var(--color-gold);
          box-shadow: 
            0 10px 30px rgba(32, 61, 50, 0.12),
            0 2px 6px rgba(197, 164, 109, 0.2);
        }

        .header-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .couple-names {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-forest);
          line-height: 1.15;
          letter-spacing: 0.03em;
        }

        .ampersand {
          font-style: italic;
          color: var(--color-gold-deep);
          font-weight: 400;
          margin: 0 0.15rem;
        }

        .wedding-subtag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--color-gold-deep);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 1px;
        }

        .tag-calendar-icon {
          color: var(--color-gold-deep);
          flex-shrink: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        @media (max-width: 360px) {
          .couple-names {
            font-size: 1.1rem;
          }
          .wedding-subtag {
            font-size: 0.6rem;
            letter-spacing: 0.08em;
          }
        }
      `}</style>
    </header>
  );
}
