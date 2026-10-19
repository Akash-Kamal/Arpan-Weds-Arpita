"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Mail, Users, Calendar, Heart } from "lucide-react";

const NAV_TABS = [
  { id: "hero", label: "Home", icon: Home, href: "#hero" },
  { id: "official-invitation", label: "Invite", icon: Mail, href: "#official-invitation" },
  { id: "families", label: "Family", icon: Users, href: "#families" },
  { id: "celebrations", label: "Events", icon: Calendar, href: "#celebrations" },
  { id: "rsvp", label: "RSVP", icon: Heart, href: "#rsvp", isHighlight: true },
];

export default function MobileAppNav() {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      for (const tab of NAV_TABS) {
        const el = document.getElementById(tab.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(tab.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="mobile-bottom-app-bar" aria-label="Mobile App Navigation">
      <div className="bottom-bar-inner">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`app-nav-tab ${isActive ? "active" : ""} ${
                tab.isHighlight ? "highlight-tab" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="tab-icon-wrap">
                <Icon size={tab.isHighlight ? 18 : 20} className="tab-icon" />
                {isActive && <span className="active-dot" />}
              </div>
              <span className="tab-label">{tab.label}</span>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .mobile-bottom-app-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 999;
          display: flex;
          justify-content: center;
          padding: 0.5rem 0.75rem max(0.6rem, env(safe-area-inset-bottom));
          pointer-events: none;
        }

        .bottom-bar-inner {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          max-width: 480px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(197, 164, 109, 0.35);
          border-radius: 36px;
          padding: 0.45rem 0.5rem;
          box-shadow: 0 8px 32px rgba(32, 61, 50, 0.16);
        }

        .app-nav-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          flex: 1;
          padding: 0.35rem 0.2rem;
          color: var(--color-charcoal-muted);
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 16px;
          position: relative;
        }

        .tab-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 24px;
        }

        .tab-label {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--color-charcoal-muted);
          transition: color 0.2s ease;
        }

        .app-nav-tab.active {
          color: var(--color-forest);
        }

        .app-nav-tab.active .tab-label {
          color: var(--color-forest);
          font-weight: 700;
        }

        .app-nav-tab.active .tab-icon {
          color: var(--color-forest);
          transform: translateY(-1px);
        }

        .active-dot {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--color-gold);
        }

        .highlight-tab {
          color: var(--color-forest);
        }

        .highlight-tab .tab-icon-wrap {
          background: var(--color-forest);
          color: var(--color-gold-light);
          border-radius: 50%;
          width: 26px;
          height: 26px;
        }

        .highlight-tab .tab-icon {
          color: var(--color-gold-light);
        }

        .highlight-tab.active .tab-icon-wrap {
          background: var(--color-gold);
          color: #FFFFFF;
        }

        .highlight-tab.active .tab-icon {
          color: #FFFFFF;
        }

        @media (max-width: 360px) {
          .tab-label {
            font-size: 0.62rem;
          }
        }
      `}</style>
    </nav>
  );
}
