import React from "react";
import Image from "next/image";
import ChristianCross from "./ChristianCross";
import { WEDDING_COUPLE } from "@/config/weddingData";

export default function BlessingSection() {
  return (
    <section id="blessing" className="section section-cream blessing-section">
      <div className="container">
        <div className="blessing-grid">
          {/* Left / Top: Arched Image of Holy Scripture & Wedding Bands */}
          <div className="blessing-image-wrapper">
            <div className="cathedral-arch arch-double-border blessing-arch">
              <Image
                src="/images/blessing.jpg"
                alt="Sacred Bible, gold wedding rings, and olive branch"
                width={520}
                height={680}
                className="blessing-img"
              />
            </div>
            <div className="image-caption-card">
              <p className="caption-text font-serif">
                “Two Hearts. One Journey. With God.”
              </p>
            </div>
          </div>

          {/* Right / Content: Editorial Blessing & Scripture */}
          <div className="blessing-content">
            <div className="blessing-cross">
              <ChristianCross size={32} color="#C5A46D" />
            </div>

            <div className="pre-title">A SACRED INVITATION</div>

            <h2 className="blessing-title font-serif">
              A Blessing &amp; Welcome
            </h2>

            <div className="ornament-container">
              <div className="ornament-line" />
              <span className="monogram-text font-serif">{WEDDING_COUPLE.monogram}</span>
              <div className="ornament-line" />
            </div>

            <p className="blessing-lead font-serif">
              “Grace, peace, and divine favor be multiplied to you as we gather under God’s boundless love.”
            </p>

            <div className="blessing-body">
              <p>
                With hearts brimming with praise, gratitude, and joy, we invite our beloved family,
                cherished mentors, and dear friends to witness and bless the beginning of our married life.
              </p>
              <p>
                From our first quiet conversations to the sacred vows we will profess before God’s altar at The Epiphany Church,
                we have felt His gracious guiding hand uniting our paths, our hopes, and our families.
              </p>
              <p>
                As we unite two lives into one holy covenant, your presence, your fellowship, and your prayers
                are the greatest gifts we could ever receive.
              </p>
            </div>

            {/* Scripture Highlight Box */}
            <blockquote className="scripture-card">
              <p className="scripture-verse font-serif">
                “{WEDDING_COUPLE.scripture.verse}”
              </p>
              <footer className="scripture-ref">
                — {WEDDING_COUPLE.scripture.reference}
              </footer>
            </blockquote>

            <div className="secondary-verse-note">
              <span>“{WEDDING_COUPLE.scripture.secondaryVerse}”</span>
              <cite> — {WEDDING_COUPLE.scripture.secondaryReference}</cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
