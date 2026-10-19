"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";

interface CountdownProps {
  targetDateISO: string;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

const emptySubscribe = () => () => {};

export default function WeddingCountdown({
  targetDateISO,
  className = "",
}: CountdownProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateRemaining = () => {
      const targetTime = new Date(targetDateISO).getTime();
      const currentTime = new Date().getTime();
      const diff = targetTime - currentTime;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
      });
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [targetDateISO]);

  if (!mounted) {
    // Elegant server-rendered placeholder to avoid hydration mismatch
    return (
      <div className={`countdown-container ${className}`}>
        <div className="countdown-grid">
          {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
            <div key={label} className="countdown-card">
              <span className="countdown-num">--</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
        <style jsx>{`
          .countdown-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .countdown-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: clamp(0.5rem, 2vw, 1.25rem);
            max-width: 520px;
            width: 100%;
          }
          .countdown-card {
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(197, 164, 109, 0.4);
            border-radius: 12px;
            padding: 0.8rem 0.5rem;
            text-align: center;
          }
          .countdown-num {
            display: block;
            font-family: var(--font-serif);
            font-size: clamp(1.4rem, 2.5vw, 2.2rem);
            color: var(--color-forest);
            font-weight: 600;
          }
          .countdown-label {
            display: block;
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--color-charcoal-light);
          }
        `}</style>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className={`countdown-celebration-box ${className}`}>
        <p className="celebration-text font-serif">
          “So they are no longer two, but one flesh. Therefore, what God has joined together, let no one separate.”
        </p>
        <p className="celebration-subtext">
          Arpan &amp; Arpita are joyfully united in Holy Matrimony.
        </p>
        <style jsx>{`
          .countdown-celebration-box {
            text-align: center;
            padding: 1.5rem 2rem;
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid var(--color-gold);
            border-radius: 16px;
            max-width: 520px;
            margin: 0 auto;
            box-shadow: var(--shadow-subtle);
          }
          .celebration-text {
            font-size: 1.4rem;
            color: var(--color-forest);
            margin-bottom: 0.3rem;
            font-style: italic;
          }
          .celebration-subtext {
            font-size: 0.9rem;
            color: var(--color-gold-deep);
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`countdown-container ${className}`}>
      <div className="countdown-grid">
        <div className="countdown-card">
          <span className="countdown-num">
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="countdown-label">Days</span>
        </div>
        <div className="countdown-card">
          <span className="countdown-num">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="countdown-label">Hours</span>
        </div>
        <div className="countdown-card">
          <span className="countdown-num">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="countdown-label">Minutes</span>
        </div>
        <div className="countdown-card">
          <span className="countdown-num">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="countdown-label">Seconds</span>
        </div>
      </div>

      <style jsx>{`
        .countdown-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 1rem;
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.45rem;
          max-width: 100%;
          width: 100%;
        }

        .countdown-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(197, 164, 109, 0.45);
          border-radius: 12px;
          padding: 0.6rem 0.3rem;
          text-align: center;
          box-shadow: 0 4px 18px rgba(32, 61, 50, 0.06);
          position: relative;
          transition: transform 0.25s ease;
        }

        .countdown-card::after {
          content: "";
          position: absolute;
          inset: 3px;
          border-radius: 11px;
          border: 1px solid rgba(197, 164, 109, 0.15);
          pointer-events: none;
        }

        .countdown-num {
          display: block;
          font-family: var(--font-serif);
          font-size: clamp(1.6rem, 3.2vw, 2.4rem);
          font-weight: 600;
          color: var(--color-forest);
          line-height: 1.1;
        }

        .countdown-label {
          display: block;
          font-size: clamp(0.65rem, 1.2vw, 0.75rem);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--color-charcoal-muted);
          margin-top: 0.35rem;
          font-weight: 500;
        }

        @media (max-width: 480px) {
          .countdown-grid {
            gap: 0.4rem;
          }
          .countdown-card {
            padding: 0.5rem 0.2rem;
          }
        }
      `}</style>
    </div>
  );
}
