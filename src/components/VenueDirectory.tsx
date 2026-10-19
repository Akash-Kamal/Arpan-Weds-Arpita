import React from "react";
import VenueCard from "./VenueCard";
import ChristianCross from "./ChristianCross";
import { VENUES } from "@/config/weddingData";
import { Info } from "lucide-react";

export default function VenueDirectory() {
  return (
    <section id="venues" className="section section-sage venues-section">
      <div className="container">
        {/* Header */}
        <div className="section-header-center">
          <div className="pre-title">DESTINATIONS &amp; DIRECTIONS</div>
          <h2 className="section-title font-serif">Venues &amp; Locations</h2>
          <div className="ornament-container">
            <div className="ornament-line" />
            <ChristianCross size={20} color="#C5A46D" />
            <div className="ornament-line" />
          </div>
          <p className="section-description">
            Complete location guide for our ceremonies across Faridabad and Lucknow.
            Click “Get Directions” on any venue card to navigate directly via Google Maps.
          </p>
        </div>

        {/* 4 Venues Grid */}
        <div className="venues-grid">
          {VENUES.map((venue, index) => (
            <VenueCard key={venue.id} venue={venue} index={index} />
          ))}
        </div>

        {/* Configuration & Verification Note */}
        <div className="venue-config-notice">
          <Info size={18} className="info-icon" />
          <p className="notice-text">
            <strong>Guest Guidance &amp; Verification Note:</strong> Venue addresses and Google Maps destination links are configured in{" "}
            <code>src/config/weddingData.ts</code>. Exact gate numbers, parking landmarks, or verified GPS pin coordinates can be updated prior to the wedding date without affecting layout integrity.
          </p>
        </div>
      </div>
    </section>
  );
}
