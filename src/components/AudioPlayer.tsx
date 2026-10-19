"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  customAudioSrc?: string;
  className?: string;
}

export default function AudioPlayer({
  customAudioSrc,
  className = "",
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);

  // Canon in D chord progression note frequencies (Hz) for gentle acoustic harp arpeggio
  // D - A - Bm - F#m - G - D - G - A
  const melodyNotes = [
    // Chord 1: D major (D4, F#4, A4, D5)
    293.66, 369.99, 440.0, 587.33,
    // Chord 2: A major (C#4, E4, A4, C#5)
    277.18, 329.63, 440.0, 554.37,
    // Chord 3: B minor (B3, D4, F#4, B4)
    246.94, 293.66, 369.99, 493.88,
    // Chord 4: F# minor (A3, C#4, F#4, A4)
    220.0, 277.18, 369.99, 440.0,
    // Chord 5: G major (G3, B3, D4, G4)
    196.0, 246.94, 293.66, 392.0,
    // Chord 6: D major (F#3, A3, D4, F#4)
    185.0, 220.0, 293.66, 369.99,
    // Chord 7: G major (G3, B3, D4, G4)
    196.0, 246.94, 293.66, 392.0,
    // Chord 8: A major (A3, C#4, E4, A4)
    220.0, 277.18, 329.63, 440.0,
  ];

  let noteIndex = 0;

  const playSynthesizedHarpNote = (freq: number) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Warm sine + subtle triangle wave for romantic acoustic harp timbre
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Envelope: quick gentle attack, soft resonance, gentle exponential decay
    gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.85);
  };

  const startSynthesizer = () => {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtx();
    }

    if (intervalRef.current) clearInterval(intervalRef.current);

    // Play next note every 480ms for a gentle and tranquil flow
    intervalRef.current = setInterval(() => {
      const note = melodyNotes[noteIndex % melodyNotes.length];
      playSynthesizedHarpNote(note);
      noteIndex++;
    }, 480);
  };

  const stopSynthesizer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
      }
      stopSynthesizer();
      setIsPlaying(false);
    } else {
      if (customAudioSrc && htmlAudioRef.current) {
        htmlAudioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Fallback to Web Audio synthesizer if audio file fails to load
            startSynthesizer();
            setIsPlaying(true);
          });
      } else {
        startSynthesizer();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopSynthesizer();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className={`audio-player-wrapper ${className}`}>
      {customAudioSrc && (
        <audio ref={htmlAudioRef} src={customAudioSrc} loop preload="none" />
      )}
      <button
        type="button"
        onClick={toggleMusic}
        className="music-toggle-btn"
        aria-label={isPlaying ? "Pause wedding instrumental music" : "Play wedding instrumental music"}
        title={isPlaying ? "Pause music" : "Play wedding melody"}
      >
        <span className="music-icon-box">
          {isPlaying ? (
            <Volume2 className="icon-pulse" size={17} />
          ) : (
            <VolumeX size={17} />
          )}
        </span>
        <span className="music-label">
          {isPlaying ? "Music On" : "Music"}
        </span>
        {isPlaying && (
          <span className="audio-bars" aria-hidden="true">
            <span className="bar bar-1"></span>
            <span className="bar bar-2"></span>
            <span className="bar bar-3"></span>
          </span>
        )}
      </button>

      <style jsx>{`
        .audio-player-wrapper {
          display: inline-flex;
          align-items: center;
        }

        .music-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(197, 164, 109, 0.45);
          color: var(--color-forest);
          padding: 0.36rem 0.75rem;
          border-radius: 24px;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          box-shadow: 0 2px 8px rgba(32, 61, 50, 0.06);
          transition: all 0.25s ease;
        }

        .music-toggle-btn:hover {
          background: #FFFFFF;
          border-color: var(--color-gold);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(197, 164, 109, 0.2);
        }

        .music-icon-box {
          display: flex;
          align-items: center;
          color: var(--color-gold-deep);
        }

        .music-label {
          color: var(--color-charcoal);
        }

        .audio-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 12px;
          margin-left: 2px;
        }

        .bar {
          width: 2px;
          background-color: var(--color-gold);
          border-radius: 1px;
          animation: wave 1s infinite ease-in-out;
        }

        .bar-1 { height: 6px; animation-delay: 0.1s; }
        .bar-2 { height: 11px; animation-delay: 0.3s; }
        .bar-3 { height: 8px; animation-delay: 0.2s; }

        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
