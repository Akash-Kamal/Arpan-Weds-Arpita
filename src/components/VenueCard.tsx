"use client";

import React, { useState } from "react";
import Image from "next/image";
import { VenueInfo } from "@/types/wedding";
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Compass,
  QrCode,
  ExternalLink,
} from "lucide-react";

interface VenueCardProps {
  venue: VenueInfo;
  index: number;
}

export default function VenueCard({ venue, index }: VenueCardProps) {
  const [copied, setCopied] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleCopyAddress = async () => {
    const textToCopy = `${venue.name}, ${venue.fullAddress}, ${venue.cityState}`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="venue-card-root">
      {/* Header Badge & Title */}
      <div className="venue-top-bar">
        <div className="venue-index">
          <span>LOCATION 0{index + 1}</span>
        </div>
        <div
          className={`verification-badge ${
            venue.isAddressVerified ? "verified" : "needs-confirmation"
          }`}
        >
          {venue.isAddressVerified ? (
            <>
              <CheckCircle2 size={13} />
              <span>Location Confirmed</span>
            </>
          ) : (
            <>
              <AlertCircle size={13} />
              <span>Gate / Landmark Confirmation Required</span>
            </>
          )}
        </div>
      </div>

      <h3 className="venue-name font-serif">{venue.name}</h3>

      {/* Events held here */}
      <div className="events-held-box">
        <div className="events-held-title">
          <Calendar size={14} className="events-icon" />
          <span>Events Hosted Here:</span>
        </div>
        <ul className="events-list">
          {venue.eventsHeld.map((item, idx) => (
            <li key={idx} className="events-list-item">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Address */}
      <div className="address-container">
        <div className="address-label">
          <MapPin size={15} className="address-pin-icon" />
          <span>Address Details</span>
        </div>
        <p className="full-address-text">
          {venue.fullAddress}
          <br />
          <span className="city-state">{venue.cityState}</span>
        </p>

        {venue.landmarkNotice && (
          <div className="landmark-note">
            <span className="landmark-tag">Notice:</span> {venue.landmarkNotice}
          </div>
        )}

        {venue.recommendedTravelNote && (
          <div className="travel-note">
            <Compass size={13} className="compass-icon" />
            <span>{venue.recommendedTravelNote}</span>
          </div>
        )}
      </div>

      {/* Embedded Map Toggle & View */}
      {showMap && (
        <div className="map-embed-wrapper">
          <iframe
            title={`Map for ${venue.name}`}
            width="100%"
            height="220"
            style={{ border: 0, borderRadius: "10px" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              venue.name + " " + venue.cityState
            )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          />
        </div>
      )}

      {/* Venue QR Code for GPS Navigation (Devansh Greens) */}
      {venue.qrCodeImage && (
        <div className="venue-qr-card">
          <div className="qr-img-wrapper">
            <Image
              src={venue.qrCodeImage}
              alt={`QR code for ${venue.name} location`}
              width={100}
              height={100}
              className="qr-img"
            />
          </div>
          <div className="qr-info-box">
            <div className="qr-badge">
              <QrCode size={12} />
              <span>DIRECT MAP QR</span>
            </div>
            <h4 className="qr-title font-serif">Scan for Exact Location</h4>
            <p className="qr-desc">Scan with your phone camera or click below to open Devansh Greens directly on Google Maps.</p>
            <a
              href={venue.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="qr-map-link"
            >
              <span>Open in Google Maps</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="venue-actions-footer">
        <a
          href={venue.googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-directions"
          title="Open Google Maps with turn-by-turn navigation"
        >
          <Navigation size={15} />
          <span>Get Directions</span>
        </a>

        <button
          type="button"
          onClick={handleCopyAddress}
          className={`btn-copy-address ${copied ? "copied" : ""}`}
          aria-label={`Copy address for ${venue.name}`}
        >
          {copied ? (
            <>
              <Check size={14} className="check-icon" />
              <span>Address Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Address</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="btn-toggle-map"
          aria-expanded={showMap}
        >
          {showMap ? "Hide Map" : "Preview Map"}
        </button>
      </div>

      <style jsx>{`
        .venue-card-root {
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.3);
          border-radius: 18px;
          padding: clamp(1.4rem, 2.8vw, 2rem);
          box-shadow: 0 6px 24px rgba(32, 61, 50, 0.05);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .venue-card-root:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(197, 164, 109, 0.16);
          border-color: rgba(197, 164, 109, 0.55);
        }

        .venue-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 0.85rem;
        }

        .venue-index {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-gold-deep);
        }

        .verification-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
        }

        .verification-badge.verified {
          background: #E8F5E9;
          color: #2E7D32;
          border: 1px solid #A5D6A7;
        }

        .verification-badge.needs-confirmation {
          background: #FFF8E1;
          color: #F57F17;
          border: 1px solid #FFE082;
        }

        .venue-name {
          font-size: clamp(1.45rem, 2.2vw, 1.85rem);
          color: var(--color-forest);
          margin-bottom: 0.85rem;
          line-height: 1.25;
        }

        .events-held-box {
          background: #FAF7F0;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          border-left: 3px solid var(--color-gold);
          margin-bottom: 1.1rem;
        }

        .events-held-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-forest);
          margin-bottom: 0.35rem;
        }

        .events-icon {
          color: var(--color-gold-deep);
        }

        .events-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .events-list-item {
          font-size: 0.86rem;
          color: var(--color-charcoal);
          font-weight: 500;
        }

        .address-container {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .address-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-charcoal-light);
        }

        .address-pin-icon {
          color: var(--color-gold-deep);
        }

        .full-address-text {
          font-size: 0.94rem;
          color: var(--color-charcoal);
          line-height: 1.5;
        }

        .city-state {
          font-weight: 600;
          color: var(--color-forest);
        }

        .landmark-note {
          background: #FFFDF9;
          border: 1px solid rgba(197, 164, 109, 0.25);
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.82rem;
          color: var(--color-charcoal-muted);
          line-height: 1.45;
        }

        .landmark-tag {
          font-weight: 700;
          color: var(--color-gold-deep);
        }

        .travel-note {
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: var(--color-forest);
          font-style: italic;
          line-height: 1.4;
          margin-top: 0.25rem;
        }

        .compass-icon {
          color: var(--color-gold-deep);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .map-embed-wrapper {
          margin-bottom: 1rem;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(197, 164, 109, 0.3);
        }

        .venue-qr-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: #FAF7F0;
          border: 1.5px solid rgba(197, 164, 109, 0.45);
          border-radius: 14px;
          padding: 0.85rem;
          margin-bottom: 1.2rem;
        }

        .qr-img-wrapper {
          width: 95px;
          height: 95px;
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.35);
          border-radius: 10px;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(32, 61, 50, 0.06);
        }

        .qr-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 6px;
        }

        .qr-info-box {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          text-align: left;
        }

        .qr-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-gold-deep);
        }

        .qr-title {
          font-size: 1.05rem;
          color: var(--color-forest);
          line-height: 1.2;
          margin: 0;
        }

        .qr-desc {
          font-size: 0.76rem;
          color: var(--color-charcoal-muted);
          line-height: 1.35;
          margin: 0;
        }

        .qr-map-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-forest);
          margin-top: 0.25rem;
          text-decoration: underline;
        }

        .qr-map-link:hover {
          color: var(--color-gold-deep);
        }

        .venue-actions-footer {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          padding-top: 1rem;
          border-top: 1px solid rgba(197, 164, 109, 0.2);
          margin-top: auto;
        }

        .btn-directions {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--color-forest);
          color: var(--color-ivory);
          padding: 0.55rem 1.1rem;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
        }

        .btn-directions:hover {
          background: var(--color-gold-deep);
          color: #FFFFFF;
        }

        .btn-copy-address {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #FAF7F0;
          border: 1px solid var(--color-gold);
          color: var(--color-forest);
          padding: 0.55rem 1rem;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
        }

        .btn-copy-address:hover {
          background: var(--color-gold);
          color: #FFFFFF;
        }

        .btn-copy-address.copied {
          background: #E8F5E9;
          color: #2E7D32;
          border-color: #81C784;
        }

        .check-icon {
          color: #2E7D32;
        }

        .btn-toggle-map {
          margin-left: auto;
          font-size: 0.78rem;
          color: var(--color-charcoal-light);
          text-decoration: underline;
          padding: 0.3rem 0.5rem;
        }

        .btn-toggle-map:hover {
          color: var(--color-forest);
        }

        @media (max-width: 500px) {
          .venue-actions-footer {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-directions,
          .btn-copy-address,
          .btn-toggle-map {
            width: 100%;
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
