"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WeddingEvent } from "@/types/wedding";
import { downloadICSFile, getGoogleCalendarUrl } from "@/utils/calendar";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  CalendarPlus,
  Navigation,
  Check,
  QrCode,
} from "lucide-react";

interface EventCardProps {
  event: WeddingEvent;
  index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);

  const handleDownloadICS = () => {
    downloadICSFile(event);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
    setCalendarMenuOpen(false);
  };

  const googleCalUrl = getGoogleCalendarUrl(event);
  const directionsUrl =
    event.googleMapsUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      event.mapQuery
    )}`;
  const viewMapUrl =
    event.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      event.mapQuery
    )}`;

  return (
    <article className="event-card-root">
      {/* Visual Header / Photography */}
      <div className="event-image-container">
        <Image
          src={event.image}
          alt={`${event.name} at ${event.venueName}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="event-card-img"
        />
        <div className="event-image-overlay" />
        <div className="event-number-badge">
          <span>EVENT 0{index + 1}</span>
        </div>
        <div className="event-tag-badge">
          <span>{event.badge}</span>
        </div>
      </div>

      {/* Details Body */}
      <div className="event-body">
        <h3 className="event-title font-serif">{event.name}</h3>

        {/* Date, Day & Time */}
        <div className="event-schedule-block">
          <div className="schedule-item">
            <Calendar size={16} className="schedule-icon" />
            <span className="schedule-date-bold">{event.displayDate}</span>
          </div>
          <div className="schedule-item">
            <Clock size={16} className="schedule-icon" />
            <span className="schedule-time">{event.time} IST</span>
          </div>
        </div>

        {/* Venue & Address */}
        <div className="event-venue-block">
          <div className="venue-header">
            <MapPin size={16} className="venue-icon" />
            <span className="venue-name">{event.venueName}</span>
          </div>
          <address className="venue-address">
            {event.venueAddress}, {event.city}, {event.state}
          </address>
        </div>

        {/* Dedicated Scripture Quote */}
        {event.scripture && (
          <div className="event-scripture-quote">
            <p className="scripture-quote-text font-serif">
              “{event.scripture.verse}”
            </p>
            <cite className="scripture-quote-cite font-serif">
              — {event.scripture.reference}
            </cite>
          </div>
        )}

        {/* Description / Celebrations */}
        {event.description && (
          <p className="event-description">{event.description}</p>
        )}

        {event.benediction && (
          <p className="event-benediction-text font-serif">
            “{event.benediction}”
          </p>
        )}

        {event.celebrationsDetail && (
          <div className="celebrations-note">
            <span className="note-label">Celebrations Itinerary:</span>{" "}
            <span>{event.celebrationsDetail}</span>
          </div>
        )}

        {/* Dedicated QR Code block (Devansh Greens) */}
        {event.qrCodeImage && (
          <div className="event-qr-card">
            <div className="qr-image-wrapper">
              <Image
                src={event.qrCodeImage}
                alt={`QR code for ${event.venueName} navigation`}
                width={110}
                height={110}
                className="qr-img"
              />
            </div>
            <div className="qr-info-content">
              <div className="qr-badge">
                <QrCode size={12} />
                <span>GPS SCAN CODE</span>
              </div>
              <h4 className="qr-title font-serif">Scan for Exact Location</h4>
              <p className="qr-hint">Scan with camera to open Devansh Greens directly in Google Maps.</p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="qr-direct-link"
              >
                <span>Open in Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

        {/* Action Buttons: Add to Calendar & Maps */}
        <div className="event-actions-row">
          {/* Calendar Actions */}
          <div className="calendar-dropdown-container">
            <button
              type="button"
              className="action-btn-calendar"
              onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
              aria-expanded={calendarMenuOpen}
              aria-label={`Add ${event.name} to calendar`}
            >
              {downloadSuccess ? (
                <>
                  <Check size={15} className="text-green" />
                  <span>Calendar Saved</span>
                </>
              ) : (
                <>
                  <CalendarPlus size={15} />
                  <span>Add to Calendar</span>
                </>
              )}
            </button>

            {calendarMenuOpen && (
              <div className="calendar-options-popover">
                <button
                  type="button"
                  className="cal-option-btn"
                  onClick={handleDownloadICS}
                >
                  Download .ICS File (Apple / Outlook)
                </button>
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cal-option-btn"
                  onClick={() => setCalendarMenuOpen(false)}
                >
                  Open in Google Calendar
                  <ExternalLink size={13} className="ml-1" />
                </a>
              </div>
            )}
          </div>

          {/* Map Directions */}
          <div className="map-actions-group">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn-directions"
              title="Get driving directions in Google Maps"
            >
              <Navigation size={14} />
              <span>Get Directions</span>
            </a>
            <a
              href={viewMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn-map"
              title="View location in Google Maps"
            >
              <ExternalLink size={14} />
              <span>View Map</span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .event-card-root {
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.28);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(32, 61, 50, 0.05);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          position: relative;
        }

        .event-card-root:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 34px rgba(197, 164, 109, 0.18);
          border-color: rgba(197, 164, 109, 0.6);
        }

        .event-image-container {
          position: relative;
          width: 100%;
          height: 230px;
          overflow: hidden;
          background: #203D32;
        }

        .event-card-img {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .event-card-root:hover .event-card-img {
          transform: scale(1.04);
        }

        .event-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(32, 61, 50, 0.6) 100%);
        }

        .event-number-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(32, 61, 50, 0.85);
          backdrop-filter: blur(6px);
          color: var(--color-gold-light);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          border: 1px solid rgba(197, 164, 109, 0.4);
        }

        .event-tag-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(6px);
          color: var(--color-forest);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .event-body {
          padding: clamp(1.4rem, 2.5vw, 1.8rem);
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .event-title {
          font-size: clamp(1.5rem, 2.2vw, 1.85rem);
          color: var(--color-forest);
          margin-bottom: 0.85rem;
          line-height: 1.25;
        }

        .event-schedule-block {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding: 0.85rem 1rem;
          background: #FAF7F0;
          border-radius: 10px;
          border-left: 3px solid var(--color-gold);
          margin-bottom: 1rem;
        }

        .schedule-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .schedule-icon {
          color: var(--color-gold-deep);
          flex-shrink: 0;
        }

        .schedule-date-bold {
          font-weight: 600;
          color: var(--color-forest);
          font-size: 0.92rem;
        }

        .schedule-time {
          font-weight: 600;
          color: var(--color-charcoal);
          font-size: 0.88rem;
        }

        .event-venue-block {
          margin-bottom: 0.85rem;
        }

        .venue-header {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-weight: 600;
          color: var(--color-forest);
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }

        .venue-icon {
          color: var(--color-gold-deep);
          flex-shrink: 0;
        }

        .venue-address {
          font-style: normal;
          font-size: 0.86rem;
          color: var(--color-charcoal-muted);
          line-height: 1.45;
          padding-left: 1.45rem;
        }

        .event-scripture-quote {
          background: rgba(197, 164, 109, 0.08);
          border-left: 2px solid var(--color-gold);
          border-radius: 0 8px 8px 0;
          padding: 0.6rem 0.85rem;
          margin-bottom: 0.85rem;
        }

        .scripture-quote-text {
          font-size: 0.95rem;
          color: var(--color-forest);
          font-style: italic;
          line-height: 1.45;
          margin-bottom: 0.2rem;
        }

        .scripture-quote-cite {
          font-size: 0.78rem;
          color: var(--color-gold-deep);
          font-weight: 600;
          letter-spacing: 0.04em;
          display: block;
        }

        .event-description {
          font-size: 0.92rem;
          color: var(--color-charcoal-muted);
          line-height: 1.6;
          margin-bottom: 0.75rem;
          flex-grow: 1;
        }

        .event-benediction-text {
          font-size: 0.88rem;
          color: var(--color-forest);
          font-style: italic;
          line-height: 1.45;
          margin-bottom: 0.85rem;
        }

        .celebrations-note {
          background: rgba(197, 164, 109, 0.1);
          border: 1px solid rgba(197, 164, 109, 0.3);
          border-radius: 8px;
          padding: 0.5rem 0.8rem;
          font-size: 0.82rem;
          color: var(--color-forest);
          margin-bottom: 1.25rem;
        }

        .event-qr-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: #FAF7F0;
          border: 1.5px solid rgba(197, 164, 109, 0.45);
          border-radius: 14px;
          padding: 0.85rem;
          margin-bottom: 1.2rem;
        }

        .qr-image-wrapper {
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

        .qr-info-content {
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

        .qr-hint {
          font-size: 0.76rem;
          color: var(--color-charcoal-muted);
          line-height: 1.35;
          margin: 0;
        }

        .qr-direct-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-forest);
          margin-top: 0.25rem;
          text-decoration: underline;
        }

        .qr-direct-link:hover {
          color: var(--color-gold-deep);
        }

        .note-label {
          font-weight: 600;
          color: var(--color-gold-deep);
        }

        .event-actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.6rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(197, 164, 109, 0.2);
          margin-top: auto;
          position: relative;
        }

        .calendar-dropdown-container {
          position: relative;
        }

        .action-btn-calendar {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #FAF7F0;
          border: 1px solid var(--color-gold);
          color: var(--color-forest);
          padding: 0.5rem 0.95rem;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
        }

        .action-btn-calendar:hover {
          background: var(--color-gold);
          color: #FFFFFF;
        }

        .calendar-options-popover {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 0;
          background: #FFFFFF;
          border: 1px solid var(--color-gold);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(32, 61, 50, 0.15);
          width: 250px;
          padding: 0.4rem;
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .cal-option-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.55rem 0.75rem;
          border-radius: 8px;
          font-size: 0.78rem;
          color: var(--color-forest);
          text-align: left;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .cal-option-btn:hover {
          background: #FAF7F0;
          color: var(--color-gold-deep);
        }

        .map-actions-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .action-btn-directions {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--color-forest);
          color: var(--color-ivory);
          padding: 0.5rem 0.9rem;
          border-radius: 30px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
        }

        .action-btn-directions:hover {
          background: var(--color-gold-deep);
          color: #FFFFFF;
        }

        .action-btn-map {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: transparent;
          color: var(--color-charcoal-muted);
          padding: 0.5rem 0.65rem;
          border-radius: 30px;
          font-size: 0.78rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .action-btn-map:hover {
          color: var(--color-forest);
        }

        .text-green {
          color: #2F855A;
        }

        @media (max-width: 540px) {
          .event-actions-row {
            flex-direction: column;
            align-items: stretch;
          }
          .calendar-dropdown-container,
          .action-btn-calendar,
          .map-actions-group {
            width: 100%;
          }
          .action-btn-directions,
          .action-btn-map {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </article>
  );
}
