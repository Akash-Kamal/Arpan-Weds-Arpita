import React from "react";
import EventCard from "./EventCard";
import ChristianCross from "./ChristianCross";
import { WEDDING_EVENTS } from "@/config/weddingData";

export default function EventTimeline() {
  return (
    <section id="celebrations" className="section section-cream celebrations-section">
      <div className="container">
        {/* Header */}
        <div className="section-header-center">
          <div className="pre-title">THE WEDDING ITINERARY</div>
          <h2 className="section-title font-serif">Wedding Celebrations</h2>
          <div className="ornament-container">
            <div className="ornament-line" />
            <ChristianCross size={20} color="#C5A46D" />
            <div className="ornament-line" />
          </div>
          <p className="section-description">
            A chronological celebration of sacred covenant, joyous fellowship, and family blessings
            across Faridabad and Lucknow.
          </p>

          {/* Quick Dates Ribbon */}
          <div className="dates-summary-pills">
            <span className="date-pill">
              <strong>9 Nov:</strong> Haldi &amp; Mehendi (Faridabad)
            </span>
            <span className="pill-dot">•</span>
            <span className="date-pill">
              <strong>11 Nov:</strong> Holy Matrimony &amp; Dinner (Lucknow)
            </span>
            <span className="pill-dot">•</span>
            <span className="date-pill">
              <strong>14 Nov:</strong> Wedding Reception (Faridabad)
            </span>
          </div>
        </div>

        {/* 6 Events Chronological Grid */}
        <div className="events-grid">
          {WEDDING_EVENTS.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        {/* Note on Lucknow to Faridabad Travel */}
        <div className="itinerary-intermission-card">
          <div className="intermission-content">
            <h4 className="intermission-title font-serif">
              A Thoughtful Two-Day Intermission for Traveling Guests
            </h4>
            <p className="intermission-text">
              Following the Holy Matrimony, Cake Cutting, and Dinner in Lucknow on Wednesday, 11 November,
              there is a two-day travel and rest interval (Thursday 12 &amp; Friday 13 November)
              before we reconvene for the Grand Wedding Reception at Devansh Greens, Ballabhgarh on Saturday, 14 November at 7:00 PM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
