"use client";

import React from "react";
import Link from "next/link";
import ChristianCross from "./ChristianCross";
import { WEDDING_COUPLE, WEDDING_EVENTS } from "@/config/weddingData";
import { ArrowUp } from "lucide-react";

export default function WeddingFooter() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Our Story", href: "#story" },
    { label: "Our Families", href: "#families" },
    { label: "Celebrations", href: "#celebrations" },
    { label: "Memories & Photos", href: "#gallery" },
    { label: "RSVP", href: "#rsvp" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <footer className="footer-root">
      {/* Decorative Arch & Blessing Container */}
      <div className="container footer-container">
        {/* Top Gold Cross */}
        <div className="footer-cross">
          <ChristianCross size={28} color="#C5A46D" />
        </div>

        <h2 className="footer-blessing-title font-serif">
          Thank you for being part of our journey.
        </h2>

        <div className="ornament-container">
          <div className="ornament-line" />
          <span className="footer-monogram font-serif">{WEDDING_COUPLE.monogram}</span>
          <div className="ornament-line" />
        </div>

        <p className="footer-signoff font-serif">
          “With love and God’s blessings, Arpan &amp; Arpita.”
        </p>

        <p className="footer-tagline">
          “{WEDDING_COUPLE.tagline}”
        </p>

        {/* Compact Event Summary Bar */}
        <div className="footer-summary-card">
          <h4 className="summary-card-title">Celebration Schedule Highlights</h4>
          <div className="summary-pills-row">
            {WEDDING_EVENTS.map((ev) => (
              <div key={ev.id} className="summary-pill">
                <span className="pill-event-name">{ev.name}</span>
                <span className="pill-event-date">
                  {ev.displayDate.split(",")[0]}, {ev.displayDate.split(",")[1]?.trim()} • {ev.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <nav className="footer-nav" aria-label="Footer navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="footer-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Back to top button */}
        <div className="back-to-top-wrapper">
          <button
            type="button"
            onClick={scrollToTop}
            className="btn-back-to-top"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp size={15} />
          </button>
        </div>

        {/* Bottom credits */}
        <div className="footer-bottom-line">
          <p className="copyright-text">
            Wednesday, 11 November 2026 • The Epiphany Church Zahur Bux, Capper Road, Lucknow &amp; The Railway Club
          </p>
          <p className="sub-copyright">
            Designed with devotion &amp; elegance for Arpan Kamal &amp; Arpita Simon.
          </p>
        </div>
      </div>
    </footer>
  );
}
