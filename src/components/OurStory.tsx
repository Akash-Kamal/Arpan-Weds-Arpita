import React from "react";
import Image from "next/image";
import ChristianCross from "./ChristianCross";
import { STORY_MILESTONES } from "@/config/weddingData";
import { BookOpen } from "lucide-react";

export default function OurStory() {
  return (
    <section id="story" className="section section-cream story-section">
      <div className="container">
        {/* Header */}
        <div className="section-header-center">
          <div className="pre-title">WALKING IN PROVIDENCE</div>
          <h2 className="section-title font-serif">Our Story</h2>
          <div className="ornament-container">
            <div className="ornament-line" />
            <ChristianCross size={20} color="#C5A46D" />
            <div className="ornament-line" />
          </div>
          <p className="section-intro font-serif">
            “He has made everything beautiful in its time.” — Ecclesiastes 3:11
          </p>
          <p className="section-description">
            A chronicle of quiet grace, answered prayers, and the joyful journey that brings two hearts to the altar.
          </p>
        </div>

        {/* Chronological Timeline */}
        <div className="story-timeline">
          <div className="timeline-central-stem" aria-hidden="true" />

          {STORY_MILESTONES.map((milestone, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`story-milestone-row ${isEven ? "row-left" : "row-right"}`}
              >
                {/* Visual / Image Side */}
                <div className="milestone-media-col">
                  {milestone.image ? (
                    <div className="milestone-arch-frame cathedral-arch-sm">
                      <Image
                        src={milestone.image}
                        alt={milestone.title}
                        width={420}
                        height={280}
                        className="milestone-img"
                      />
                    </div>
                  ) : (
                    <div className="milestone-placeholder-box">
                      <BookOpen size={24} color="#C5A46D" />
                    </div>
                  )}
                </div>

                {/* Central Node Badge */}
                <div className="timeline-center-node">
                  <span className="node-dot" />
                </div>

                {/* Narrative Card */}
                <div className="milestone-card-col">
                  <div className="editorial-card milestone-content-card">
                    <span className="milestone-phase-badge">
                      {milestone.yearOrPhase}
                    </span>
                    <h3 className="milestone-heading font-serif">
                      {milestone.title}
                    </h3>
                    <div className="milestone-subheading">
                      {milestone.subtitle}
                    </div>
                    <p className="milestone-narrative">
                      {milestone.narrative}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Narrative Note */}
        <div className="story-footer-note">
          <p className="note-text">
            Personal milestone chapters can be customized directly in <code className="code-badge">src/config/weddingData.ts</code>.
          </p>
        </div>
      </div>
    </section>
  );
}
