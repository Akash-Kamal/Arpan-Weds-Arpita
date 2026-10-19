"use client";

import React, { useState } from "react";
import Image from "next/image";
import ChristianCross from "./ChristianCross";
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { INVITATION_PAGES } from "@/config/weddingData";

export default function OfficialInvitationCard() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentPage = INVITATION_PAGES[currentPageIndex];

  const handleShareCurrentPage = async () => {
    const text = `† ${currentPage.title} †\n\n“${currentPage.scripture.verse}”\n— ${currentPage.scripture.reference}\n\n${currentPage.invitationPreamble}\n\n${currentPage.coupleDisplay.groom} & ${currentPage.coupleDisplay.bride}\n\nDate: ${currentPage.dateDisplay}\nTime: ${currentPage.timeDisplay}\nVenue: ${currentPage.venueDisplay}\n${currentPage.dinnerDisplay ? `Dinner: ${currentPage.dinnerDisplay}\n` : ""}\n${currentPage.blessingsLabel}:\n${currentPage.blessingMembers.join("\n")}\n\nWebsite: ${typeof window !== "undefined" ? window.location.href : "https://arpan-arpita.wedding"}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Arpan & Arpita — ${currentPage.title}`,
          text: text,
        });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // clipboard fallback
      }
    }
  };

  return (
    <section id="official-invitation" className="section section-cream invitation-card-section">
      <div className="container">
        {/* Header */}
        <div className="section-header-center">
          <div className="pre-title">THE OFFICIAL WEDDING SUITE</div>
          <h2 className="section-title font-serif">Wedding Invitation Cards</h2>
          <div className="ornament-container">
            <div className="ornament-line" />
            <ChristianCross size={20} color="#C5A46D" />
            <div className="ornament-line" />
          </div>
          <p className="section-description">
            Complete four-card ceremonial invitation suite honoring our families, sacred vows, and celebrations.
          </p>

          {/* Page Selector Tabs */}
          <div className="card-page-tabs">
            {INVITATION_PAGES.map((pg, idx) => (
              <button
                key={pg.pageNumber}
                type="button"
                onClick={() => setCurrentPageIndex(idx)}
                className={`page-tab-btn ${currentPageIndex === idx ? "active" : ""}`}
                aria-label={`View Page ${pg.pageNumber}: ${pg.title}`}
              >
                <span className="tab-page-num">PAGE {pg.pageNumber}</span>
                <span className="tab-title">{pg.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* The Luxury Card */}
        <div className="card-outer-frame">
          <div className="card-inner-matting">
            <div className="card-bordered-content">
              {/* Top Navigation between pages */}
              <div className="card-page-nav-top">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPageIndex(
                      (prev) => (prev - 1 + INVITATION_PAGES.length) % INVITATION_PAGES.length
                    )
                  }
                  className="nav-arrow-btn"
                  aria-label="Previous invitation card"
                >
                  <ChevronLeft size={18} />
                  <span>Prev</span>
                </button>
                <div className="card-indicator font-serif">
                  CARD 0{currentPage.pageNumber} OF 0{INVITATION_PAGES.length}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPageIndex((prev) => (prev + 1) % INVITATION_PAGES.length)
                  }
                  className="nav-arrow-btn"
                  aria-label="Next invitation card"
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Cross Emblem for Wedding / Reception, or botanical line */}
              <div className="card-cross-wrapper">
                <ChristianCross size={34} color="#C5A46D" variant="ornate" />
              </div>

              {/* Formal Card Header */}
              <h3 className="card-formal-header font-serif">{currentPage.title}</h3>

              {/* Scripture */}
              <blockquote className="card-scripture">
                <p className="scripture-text font-serif">
                  “{currentPage.scripture.verse}”
                </p>
                <cite className="scripture-reference font-serif">
                  — {currentPage.scripture.reference}
                </cite>
              </blockquote>

              <div className="card-gold-separator" />

              {/* Hosts / Parents */}
              {currentPage.hosts && (
                <div className="card-hosts font-serif">
                  {currentPage.hosts}
                </div>
              )}

              {/* Preamble */}
              <p className="card-preamble font-serif">
                {currentPage.invitationPreamble}
              </p>

              {/* Couple Names */}
              {currentPage.pageNumber === 1 ? (
                // Page 1 specific layout
                <div className="page-1-couple-box">
                  <div className="card-groom-name font-serif">
                    {currentPage.coupleDisplay.groom}
                  </div>
                  <div className="card-with-text font-serif">with</div>
                  <div className="card-bride-name font-serif">
                    {currentPage.coupleDisplay.bride}
                  </div>
                </div>
              ) : (
                // Pages 2, 3, 4 layout
                <div className="joint-couple-name font-serif">
                  {currentPage.coupleDisplay.groom} &amp; {currentPage.coupleDisplay.bride}
                </div>
              )}

              <div className="card-gold-separator" />

              {/* Date & Time */}
              <div className="card-datetime-grid">
                <div className="datetime-col">
                  <div className="dt-icon-label">
                    <Calendar size={15} className="dt-icon" />
                    <span>DATE</span>
                  </div>
                  <div className="dt-value font-serif">{currentPage.dateDisplay}</div>
                </div>
                <div className="dt-divider" />
                <div className="datetime-col">
                  <div className="dt-icon-label">
                    <Clock size={15} className="dt-icon" />
                    <span>TIME</span>
                  </div>
                  <div className="dt-value font-serif">{currentPage.timeDisplay}</div>
                </div>
              </div>

              {/* Venue */}
              <div className="card-venue-block">
                <div className="venue-block-label">
                  <MapPin size={15} className="venue-block-icon" />
                  <span>VENUE</span>
                </div>
                <div className="venue-block-name font-serif">
                  {currentPage.venueDisplay.split(",")[0]}
                </div>
                <div className="venue-block-address">
                  {currentPage.venueDisplay.split(",").slice(1).join(",")}
                </div>
              </div>

              {/* Dinner (Page 1) */}
              {currentPage.dinnerDisplay && (
                <div className="card-dinner-block">
                  <div className="dinner-prompt font-serif">Thereafter, dinner at:</div>
                  <div className="dinner-venue-name font-serif">The Railway Club</div>
                  <div className="dinner-venue-address">
                    2-A, Vivekanand Marg, Bandariya Bagh, Lucknow – 226001
                  </div>
                  <a
                    href="https://maps.app.goo.gl/fs1VmWxaAyMfR3Fg9?g_st=ac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dinner-map-link"
                  >
                    <span>Open Railway Club in Google Maps</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Benediction */}
              {currentPage.benediction && (
                <p className="card-benediction font-serif">
                  “{currentPage.benediction}”
                </p>
              )}

              {/* QR Code for Venue Directions (The Epiphany Church / Devansh Greens) */}
              {currentPage.qrCodeImage && (
                <div className="card-qr-section">
                  <div className="card-qr-wrapper">
                    <Image
                      src={currentPage.qrCodeImage}
                      alt={`QR Code for ${currentPage.venueDisplay.split(",")[0]} directions`}
                      width={105}
                      height={105}
                      className="card-qr-img"
                    />
                  </div>
                  <div className="card-qr-info">
                    <div className="card-qr-badge">
                      <QrCode size={12} />
                      <span>GPS NAVIGATION QR</span>
                    </div>
                    <span className="card-qr-title font-serif">
                      {currentPage.venueDisplay.split(",")[0]} Directions
                    </span>
                    <p className="card-qr-hint">Scan with camera or tap below to open exact Google Maps location.</p>
                    {currentPage.mapUrl && (
                      <a
                        href={currentPage.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-qr-link"
                      >
                        <span>Open Directions in Google Maps</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="card-gold-separator" />

              {/* Blessings of Our Families */}
              <div className="card-compliments-block">
                <div className="compliments-label font-serif">
                  {currentPage.blessingsLabel}
                </div>
                <div className="compliments-list font-serif">
                  {currentPage.blessingMembers.map((member, mIdx) => (
                    <span key={mIdx} className="compliment-item">
                      {member}
                      {mIdx < currentPage.blessingMembers.length - 1 && (
                        <span className="dot-sep">•</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Card Action */}
              <div className="card-action-bar">
                <button
                  type="button"
                  onClick={handleShareCurrentPage}
                  className="btn-share-invitation"
                  aria-label={`Share ${currentPage.title} invitation card`}
                >
                  {copied ? (
                    <>
                      <Check size={15} className="text-green" />
                      <span>Invitation Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={15} />
                      <span>Share / Copy Card 0{currentPage.pageNumber}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .invitation-card-section {
          background-color: #F8F5EE;
          position: relative;
        }

        .section-header-center {
          text-align: center;
          max-width: 760px;
          margin: 0 auto clamp(2.5rem, 5vw, 3.8rem);
        }

        .pre-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: var(--color-gold-deep);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .section-title {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          color: var(--color-forest);
        }

        .section-description {
          font-size: 1.05rem;
          color: var(--color-charcoal-muted);
          margin-top: 0.5rem;
          line-height: 1.6;
        }

        .card-page-tabs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-top: 1.25rem;
          width: 100%;
        }

        .page-tab-btn {
          background: #FAF7F0;
          border: 1px solid rgba(197, 164, 109, 0.4);
          border-radius: 12px;
          padding: 0.65rem 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          transition: all 0.25s ease;
          min-height: 52px;
          justify-content: center;
        }

        .page-tab-btn:hover {
          border-color: var(--color-gold);
          transform: translateY(-1px);
        }

        .page-tab-btn.active {
          background: var(--color-forest);
          color: #FFFFFF;
          border-color: var(--color-forest);
          box-shadow: 0 4px 14px rgba(32, 61, 50, 0.18);
        }

        .tab-page-num {
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--color-gold-deep);
        }

        .page-tab-btn.active .tab-page-num {
          color: var(--color-gold-light);
        }

        .tab-title {
          font-size: 0.8rem;
          font-weight: 600;
          line-height: 1.2;
          text-align: center;
        }

        /* Card Container */
        .card-outer-frame {
          max-width: 100%;
          margin: 0 auto;
          background: #FFFFFF;
          border-radius: 20px;
          padding: 8px;
          box-shadow: 0 12px 40px rgba(32, 61, 50, 0.08);
          border: 1px solid rgba(197, 164, 109, 0.45);
        }

        .card-inner-matting {
          border: 1.5px solid var(--color-gold);
          border-radius: 14px;
          padding: 6px;
          background: #FAF8F3;
        }

        .card-bordered-content {
          border: 1px dashed rgba(197, 164, 109, 0.4);
          border-radius: 10px;
          padding: 1.5rem 0.9rem;
          text-align: center;
          background: radial-gradient(circle at 50% 15%, rgba(255, 255, 255, 0.98), #FAF7F0);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .card-page-nav-top {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(197, 164, 109, 0.2);
        }

        .nav-arrow-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-forest);
          padding: 0.3rem 0.6rem;
          border-radius: 20px;
          background: rgba(197, 164, 109, 0.1);
          transition: background 0.2s ease;
        }

        .nav-arrow-btn:hover {
          background: var(--color-gold);
          color: #FFFFFF;
        }

        .card-indicator {
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-gold-deep);
          font-weight: 600;
        }

        .card-cross-wrapper {
          margin-bottom: 0.6rem;
        }

        .card-formal-header {
          font-size: clamp(1.5rem, 2.6vw, 2rem);
          color: var(--color-forest);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .card-scripture {
          max-width: 520px;
          margin: 0 auto 1.25rem;
        }

        .scripture-text {
          font-size: clamp(1.05rem, 1.8vw, 1.25rem);
          color: var(--color-charcoal);
          font-style: italic;
          line-height: 1.5;
          margin-bottom: 0.35rem;
        }

        .scripture-reference {
          font-size: 0.88rem;
          color: var(--color-gold-deep);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .card-gold-separator {
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
          margin: 1.25rem auto;
        }

        .card-hosts {
          font-size: clamp(1.2rem, 2.2vw, 1.55rem);
          color: var(--color-forest);
          font-weight: 600;
          letter-spacing: 0.03em;
          margin-bottom: 0.35rem;
        }

        .card-preamble {
          font-size: clamp(0.95rem, 1.6vw, 1.1rem);
          color: var(--color-charcoal-muted);
          font-style: italic;
          line-height: 1.55;
          max-width: 560px;
          margin-bottom: 1rem;
        }

        .page-1-couple-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .card-groom-name,
        .card-bride-name {
          font-size: clamp(2rem, 4.2vw, 2.85rem);
          color: var(--color-forest);
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: 0.04em;
        }

        .card-with-text {
          font-size: 1.2rem;
          color: var(--color-gold-deep);
          font-style: italic;
          margin: 0.15rem 0;
        }

        .card-parentage {
          font-size: clamp(0.85rem, 1.5vw, 1rem);
          color: var(--color-charcoal-muted);
          font-style: italic;
          margin-top: 0.35rem;
        }

        .joint-couple-name {
          font-size: clamp(1.8rem, 3.8vw, 2.5rem);
          color: var(--color-forest);
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        .card-datetime-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(197, 164, 109, 0.3);
          border-radius: 12px;
          padding: 0.85rem 1.4rem;
          margin-bottom: 1.4rem;
          width: 100%;
          max-width: 480px;
        }

        .datetime-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .dt-icon-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          color: var(--color-gold-deep);
          font-weight: 700;
        }

        .dt-icon {
          color: var(--color-gold-deep);
        }

        .dt-value {
          font-size: clamp(1rem, 1.8vw, 1.2rem);
          color: var(--color-forest);
          font-weight: 600;
        }

        .dt-divider {
          width: 1px;
          height: 36px;
          background: rgba(197, 164, 109, 0.35);
        }

        .card-venue-block {
          margin-bottom: 1.2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .venue-block-label {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          color: var(--color-gold-deep);
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .venue-block-icon {
          color: var(--color-gold-deep);
        }

        .venue-block-name {
          font-size: clamp(1.25rem, 2.2vw, 1.55rem);
          color: var(--color-forest);
          font-weight: 600;
          line-height: 1.2;
        }

        .venue-block-address {
          font-size: 0.95rem;
          color: var(--color-charcoal-muted);
          margin-top: 0.15rem;
        }

        .card-dinner-block {
          background: rgba(197, 164, 109, 0.08);
          border: 1px solid rgba(197, 164, 109, 0.25);
          border-radius: 10px;
          padding: 0.85rem 1.4rem;
          margin-bottom: 1.2rem;
          width: 100%;
          max-width: 480px;
        }

        .dinner-prompt {
          font-size: 0.92rem;
          color: var(--color-gold-deep);
          font-style: italic;
          margin-bottom: 0.2rem;
        }

        .dinner-venue-name {
          font-size: 1.3rem;
          color: var(--color-forest);
          font-weight: 600;
        }

        .dinner-venue-address {
          font-size: 0.88rem;
          color: var(--color-charcoal-muted);
          line-height: 1.4;
          margin-top: 0.15rem;
        }

        .dinner-map-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.5rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-forest);
          text-decoration: underline;
          transition: color 0.2s ease;
        }

        .dinner-map-link:hover {
          color: var(--color-gold-deep);
        }

        .card-benediction {
          font-size: clamp(0.95rem, 1.6vw, 1.1rem);
          color: var(--color-forest);
          font-style: italic;
          max-width: 540px;
          margin: 0.5rem auto 1rem;
          line-height: 1.55;
        }

        .card-qr-section {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: #FAF8F3;
          border: 1px solid rgba(197, 164, 109, 0.4);
          border-radius: 12px;
          padding: 0.75rem 0.9rem;
          margin: 0.8rem auto 1rem;
          max-width: 440px;
          width: 100%;
          text-align: left;
        }

        .card-qr-wrapper {
          width: 90px;
          height: 90px;
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.35);
          border-radius: 8px;
          padding: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(32, 61, 50, 0.05);
        }

        .card-qr-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 5px;
        }

        .card-qr-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .card-qr-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-gold-deep);
        }

        .card-qr-title {
          font-size: 0.98rem;
          color: var(--color-forest);
          font-weight: 600;
          line-height: 1.2;
        }

        .card-qr-hint {
          font-size: 0.74rem;
          color: var(--color-charcoal-muted);
          line-height: 1.35;
          margin: 0;
        }

        .card-qr-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-forest);
          margin-top: 0.2rem;
          text-decoration: underline;
        }

        .card-qr-link:hover {
          color: var(--color-gold-deep);
        }

        .card-compliments-block {
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
          width: 100%;
          max-width: 580px;
        }

        .compliments-label {
          font-size: 1.05rem;
          color: var(--color-gold-deep);
          font-style: italic;
          margin-bottom: 0.5rem;
        }

        .compliments-list {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.4rem 0.6rem;
          font-size: 0.96rem;
          color: var(--color-forest);
          font-weight: 500;
        }

        .compliment-item {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
        }

        .dot-sep {
          color: var(--color-gold);
        }

        .card-action-bar {
          width: 100%;
          display: flex;
          justify-content: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(197, 164, 109, 0.2);
        }

        .btn-share-invitation {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-forest);
          color: var(--color-ivory);
          border: 1px solid var(--color-forest);
          padding: 0.65rem 1.4rem;
          border-radius: 30px;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: all 0.25s ease;
        }

        .btn-share-invitation:hover {
          background: var(--color-gold-deep);
          border-color: var(--color-gold-deep);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(197, 164, 109, 0.25);
        }

        .text-green {
          color: #81C784;
        }

        @media (max-width: 768px) {
          .card-page-tabs {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 520px) {
          .card-datetime-grid {
            flex-direction: column;
            gap: 0.6rem;
          }
          .dt-divider {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
