"use client";

import React, { useState } from "react";
import ChristianCross from "./ChristianCross";
import { FAQ_ITEMS } from "@/config/weddingData";
import { ChevronDown, CheckCircle, Clock } from "lucide-react";

export default function FAQAccordion() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]); // First two open by default

  const toggleIndex = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section id="faq" className="section section-cream faq-section">
      <div className="container">
        {/* Header */}
        <div className="section-header-center">
          <div className="pre-title">GUEST INFORMATION &amp; GUIDANCE</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="ornament-container">
            <div className="ornament-line" />
            <ChristianCross size={20} color="#C5A46D" />
            <div className="ornament-line" />
          </div>
          <p className="section-description">
            Everything you need to know about celebration schedules, venue directions, travel between cities, and RSVP details.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="accordion-container">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div
                key={idx}
                className={`accordion-item ${isOpen ? "open" : ""}`}
              >
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => toggleIndex(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <div className="header-left">
                    <span className="faq-category-tag">{item.category}</span>
                    <h3 className="faq-question font-serif">{item.question}</h3>
                  </div>

                  <div className="header-right">
                    <span
                      className={`status-pill ${
                        item.isConfirmed ? "confirmed" : "pending"
                      }`}
                    >
                      {item.isConfirmed ? (
                        <>
                          <CheckCircle size={12} />
                          <span>Confirmed</span>
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          <span>Guidance Note</span>
                        </>
                      )}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`accordion-chevron ${isOpen ? "rotate" : ""}`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="accordion-body animate-fade-in"
                  >
                    <p className="faq-answer-text">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .faq-section {
          background-color: var(--color-ivory);
          position: relative;
        }

        .section-header-center {
          text-align: center;
          max-width: 680px;
          margin: 0 auto clamp(2.5rem, 5vw, 4rem);
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

        .accordion-container {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .accordion-item {
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.35);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(32, 61, 50, 0.04);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .accordion-item.open {
          border-color: var(--color-gold);
          box-shadow: 0 8px 25px rgba(197, 164, 109, 0.15);
        }

        .accordion-header {
          width: 100%;
          text-align: left;
          padding: 0.95rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          background: transparent;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .faq-category-tag {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--color-gold-deep);
          font-weight: 700;
        }

        .faq-question {
          font-size: 1.15rem;
          color: var(--color-forest);
          line-height: 1.3;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: 20px;
        }

        .status-pill.confirmed {
          background: #E8F5E9;
          color: #2E7D32;
        }

        .status-pill.pending {
          background: #FFF8E1;
          color: #B78103;
        }

        .accordion-chevron {
          color: var(--color-gold);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .accordion-chevron.rotate {
          transform: rotate(180deg);
        }

        .accordion-body {
          padding: 0.75rem 1rem 1.1rem;
          border-top: 1px dashed rgba(197, 164, 109, 0.2);
          padding-top: 1rem;
        }

        .faq-answer-text {
          font-size: 0.96rem;
          color: var(--color-charcoal-muted);
          line-height: 1.7;
          margin: 0;
        }

        @media (max-width: 600px) {
          .accordion-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .header-right {
            width: 100%;
            justify-content: space-between;
            margin-top: 0.4rem;
          }
        }
      `}</style>
    </section>
  );
}
