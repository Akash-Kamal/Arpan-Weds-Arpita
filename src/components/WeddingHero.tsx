import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Calendar, Clock, MapPin, Mail } from "lucide-react";
import WeddingCountdown from "./WeddingCountdown";
import ChristianCross from "./ChristianCross";
import { WEDDING_COUPLE } from "@/config/weddingData";

export default function WeddingHero() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-background-wrapper">
        <Image
          src="/images/hero.jpg"
          alt="The Epiphany Church sanctuary with glowing morning light for Arpan Kamal and Arpita Simon Wedding"
          fill
          priority
          sizes="100vw"
          className="hero-background-img"
        />
        <div className="hero-overlay" />
      </div>

      <div className="container hero-content-container">
        {/* Cathedral Arch Frame */}
        <div className="cathedral-portal-frame">
          <div className="arch-inner-border">
            {/* Top Cross Emblem */}
            <div className="hero-emblem">
              <ChristianCross size={26} color="#C5A46D" />
            </div>

            {/* Tagline */}
            <p className="hero-pre-tagline">
              “{WEDDING_COUPLE.tagline}”
            </p>

            {/* Holy Matrimony subtitle */}
            <div className="matrimony-label">
              <span className="gold-line" />
              <span>THE HOLY MATRIMONY OF</span>
              <span className="gold-line" />
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              <span className="hero-groom-name">{WEDDING_COUPLE.groom.name.toUpperCase()}</span>
              <span className="hero-weds-text">WEDS</span>
              <span className="hero-bride-name">{WEDDING_COUPLE.bride.name.toUpperCase()}</span>
            </h1>

            {/* Date & Time & Venue */}
            <div className="hero-key-details">
              <div className="detail-item">
                <Calendar size={17} className="detail-icon" />
                <span className="detail-text">Wednesday, 11 November 2026</span>
              </div>
              <div className="detail-divider" aria-hidden="true">•</div>
              <div className="detail-item">
                <Clock size={17} className="detail-icon" />
                <span className="detail-text">04:30 PM IST</span>
              </div>
            </div>

            <div className="hero-venue-detail">
              <MapPin size={17} className="detail-icon" />
              <span>The Epiphany Church Zahur Bux, Capper Road, Lucknow</span>
            </div>

            {/* Countdown */}
            <div className="hero-countdown-wrapper">
              <div className="countdown-title">
                <span>Counting down in faith &amp; joy</span>
              </div>
              <WeddingCountdown targetDateISO={WEDDING_COUPLE.weddingMainDateISO} />
            </div>

            {/* Action Buttons */}
            <div className="hero-action-buttons">
              <Link href="#official-invitation" className="btn-gold hero-btn">
                <Mail size={15} />
                <span>Wedding Invitation</span>
              </Link>
              <Link href="#celebrations" className="btn-outline-gold hero-btn">
                <span>View Celebrations</span>
              </Link>
              <Link href="#rsvp" className="btn-forest hero-btn">
                <span>RSVP to Attend</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Explore Scroll Down Button */}
        <div className="scroll-down-container">
          <Link href="#official-invitation" className="scroll-down-btn" aria-label="Scroll down to invitation">
            <span className="scroll-text">Explore Our Wedding</span>
            <ChevronDown size={18} className="scroll-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}
