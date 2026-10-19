"use client";

import React, { useState } from "react";
import ChristianCross from "./ChristianCross";
import { WEDDING_EVENTS } from "@/config/weddingData";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";

interface RSVPFormData {
  fullName: string;
  phoneOrEmail: string;
  attendeesCount: number;
  attendanceStatus: "attending" | "declined";
  selectedEvents: string[];
  dietaryOrNotes: string;
}

export default function RSVPForm() {
  const [formData, setFormData] = useState<RSVPFormData>({
    fullName: "",
    phoneOrEmail: "",
    attendeesCount: 1,
    attendanceStatus: "attending",
    selectedEvents: [
      "event-church-wedding",
      "event-cake-cutting",
      "event-wedding-dinner",
      "event-wedding-reception",
    ],
    dietaryOrNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckboxChange = (eventId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedEvents.includes(eventId);
      return {
        ...prev,
        selectedEvents: exists
          ? prev.selectedEvents.filter((id) => id !== eventId)
          : [...prev.selectedEvents, eventId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (formData.attendanceStatus === "attending" && formData.selectedEvents.length === 0) {
      setErrorMsg("Please select at least one celebration you will be attending.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to submit RSVP");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Error submitting RSVP:", err);
      const msg = err instanceof Error ? err.message : "Failed to connect to the server. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="section section-sage rsvp-section">
      <div className="container">
        {/* Header */}
        <div className="section-header-center">
          <div className="pre-title">WE JOYFULLY AWAIT YOUR PRESENCE</div>
          <h2 className="section-title">RSVP</h2>
          <div className="ornament-container">
            <div className="ornament-line" />
            <ChristianCross size={20} color="#C5A46D" />
            <div className="ornament-line" />
          </div>
          <p className="section-description">
            Kindly confirm your attendance by <strong>15 October 2026</strong>.
            Your response helps us coordinate personal seating, banquet arrangements, and warm hospitality.
          </p>
        </div>

        <div className="rsvp-card-wrapper">
          {submitted ? (
            <div className="rsvp-success-card animate-fade-in">
              <div className="success-icon-wrapper">
                <CheckCircle2 size={48} className="success-icon" />
              </div>

              <h3 className="success-title font-serif">
                Thank You, {formData.fullName}!
              </h3>

              <p className="success-text">
                Your RSVP details have been sent directly to Arpan &amp; Arpita’s family via email. We look forward to celebrating together in God&apos;s grace!
              </p>

              <div className="success-actions" style={{ justifyContent: "center", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: "",
                      phoneOrEmail: "",
                      attendeesCount: 1,
                      attendanceStatus: "attending",
                      selectedEvents: [
                        "event-church-wedding",
                        "event-cake-cutting",
                        "event-wedding-dinner",
                        "event-wedding-reception",
                      ],
                      dietaryOrNotes: "",
                    });
                  }}
                  className="btn-gold"
                >
                  Submit Another Response
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rsvp-form" noValidate>
              {errorMsg && (
                <div className="error-banner" role="alert">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Attendance Choice */}
              <div className="form-group-attendance">
                <label className="group-label">Will you be attending?</label>
                <div className="radio-options-row">
                  <label
                    className={`radio-card ${
                      formData.attendanceStatus === "attending" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendanceStatus"
                      value="attending"
                      checked={formData.attendanceStatus === "attending"}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          attendanceStatus: "attending",
                        }))
                      }
                      className="sr-only"
                    />
                    <div className="radio-indicator">
                      {formData.attendanceStatus === "attending" && <div className="radio-dot" />}
                    </div>
                    <div className="radio-text">
                      <span className="radio-title">Joyfully Attending</span>
                      <span className="radio-sub">I / We will be there to celebrate</span>
                    </div>
                  </label>

                  <label
                    className={`radio-card ${
                      formData.attendanceStatus === "declined" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendanceStatus"
                      value="declined"
                      checked={formData.attendanceStatus === "declined"}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          attendanceStatus: "declined",
                        }))
                      }
                      className="sr-only"
                    />
                    <div className="radio-indicator">
                      {formData.attendanceStatus === "declined" && <div className="radio-dot" />}
                    </div>
                    <div className="radio-text">
                      <span className="radio-title">Regretfully Decline</span>
                      <span className="radio-sub">Celebrating with you in spirit</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Guest Details */}
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="fullName" className="field-label">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="e.g. Mr. Samuel Masih &amp; Family"
                    className="input-text"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneOrEmail" className="field-label">
                    Mobile / WhatsApp or Email
                  </label>
                  <input
                    type="text"
                    id="phoneOrEmail"
                    value={formData.phoneOrEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phoneOrEmail: e.target.value }))
                    }
                    placeholder="e.g. +91 98765 43210"
                    className="input-text"
                  />
                </div>
              </div>

              {/* Conditional fields if attending */}
              {formData.attendanceStatus === "attending" && (
                <>
                  {/* Headcount - Single Stepper Option (1 to 10 max) */}
                  <div className="form-group">
                    <label className="field-label">
                      Number of Guests Attending:
                    </label>

                    <div className="single-stepper-container">
                      <button
                        type="button"
                        className="stepper-btn"
                        disabled={formData.attendeesCount <= 1}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            attendeesCount: Math.max(1, prev.attendeesCount - 1),
                          }))
                        }
                        aria-label="Decrease number of guests"
                      >
                        <Minus size={18} />
                      </button>

                      <div className="stepper-display">
                        <span className="stepper-number font-serif">
                          {formData.attendeesCount}
                        </span>
                        <span className="stepper-text">
                          {formData.attendeesCount === 1 ? "Guest" : "Guests"}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="stepper-btn"
                        disabled={formData.attendeesCount >= 10}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            attendeesCount: Math.min(10, prev.attendeesCount + 1),
                          }))
                        }
                        aria-label="Increase number of guests"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <p className="stepper-subtext">
                      Use − or + to adjust number of guests (1 to 10 guests)
                    </p>
                  </div>

                  {/* Celebrations Attending */}
                  <div className="form-group">
                    <label className="field-label">
                      Which celebrations will you attend? <span className="req">*</span>
                    </label>
                    <div className="events-checkbox-grid">
                      {WEDDING_EVENTS.map((event) => {
                        const isChecked = formData.selectedEvents.includes(event.id);
                        return (
                          <label
                            key={event.id}
                            className={`event-check-card ${isChecked ? "checked" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckboxChange(event.id)}
                              className="sr-only"
                            />
                            <div className="check-box-indicator">
                              {isChecked && <CheckCircle2 size={15} color="#203D32" />}
                            </div>
                            <div className="check-text">
                              <span className="check-title">{event.name}</span>
                              <span className="check-sub">
                                {event.displayDate} • {event.time}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Optional message / dietary */}
              <div className="form-group">
                <label htmlFor="dietaryOrNotes" className="field-label">
                  Message, Blessings or Special Requests
                </label>
                <textarea
                  id="dietaryOrNotes"
                  rows={3}
                  value={formData.dietaryOrNotes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dietaryOrNotes: e.target.value,
                    }))
                  }
                  placeholder="Share a verse, warm blessing, or special dietary requirement..."
                  className="input-textarea"
                />
              </div>

              {/* Submit CTA */}
              <div className="form-submit-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold btn-submit"
                >
                  {isSubmitting ? (
                    <span>Recording RSVP...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit RSVP</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .rsvp-section {
          background-color: #F4F6F1;
          position: relative;
        }

        .section-header-center {
          text-align: center;
          max-width: 680px;
          margin: 0 auto clamp(2rem, 4vw, 3rem);
        }

        .pre-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: var(--color-gold-deep);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .section-title {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          color: var(--color-forest);
        }

        .section-description {
          font-size: 0.95rem;
          color: var(--color-charcoal-muted);
          line-height: 1.6;
          margin-top: 1rem;
        }

        .rsvp-card-wrapper {
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.35);
          border-radius: 20px;
          padding: clamp(1.5rem, 3.5vw, 2.5rem);
          box-shadow: 0 12px 36px rgba(32, 61, 50, 0.08);
          max-width: 720px;
          margin: 0 auto;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #FFEBEE;
          border-left: 4px solid #D32F2F;
          color: #C62828;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.88rem;
        }

        /* Attendance choice cards */
        .form-group-attendance {
          margin-bottom: 1.5rem;
        }

        .group-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-forest);
          margin-bottom: 0.75rem;
        }

        .radio-options-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .radio-card {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          border: 1.5px solid rgba(197, 164, 109, 0.3);
          border-radius: 12px;
          background: #FAF7F0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .radio-card:hover {
          border-color: var(--color-gold);
          background: #FFFFFF;
        }

        .radio-card.selected {
          border-color: var(--color-gold-deep);
          background: #FFFFFF;
          box-shadow: 0 4px 12px rgba(197, 164, 109, 0.2);
        }

        .radio-indicator {
          width: 20px;
          height: 20px;
          border: 2px solid var(--color-gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .radio-dot {
          width: 10px;
          height: 10px;
          background: var(--color-forest);
          border-radius: 50%;
        }

        .radio-title {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-forest);
        }

        .radio-sub {
          display: block;
          font-size: 0.78rem;
          color: var(--color-charcoal-muted);
          margin-top: 0.15rem;
        }

        /* Form elements */
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .form-group {
          margin-bottom: 1.4rem;
        }

        .field-label {
          display: block;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--color-forest);
          margin-bottom: 0.45rem;
        }

        .req {
          color: #D32F2F;
        }

        .input-text,
        .input-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(197, 164, 109, 0.4);
          border-radius: 10px;
          font-size: 0.92rem;
          color: var(--color-charcoal);
          background: #FAF7F0;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .input-text:focus,
        .input-textarea:focus {
          outline: none;
          border-color: var(--color-gold-deep);
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(197, 164, 109, 0.18);
        }

        /* Single Stepper Guest Counter (1 to 10 max) */
        .single-stepper-container {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          border: 1.5px solid rgba(32, 61, 50, 0.4);
          border-radius: 16px;
          padding: 0.35rem 0.5rem;
          min-width: 220px;
          box-shadow: 0 4px 14px rgba(32, 61, 50, 0.05);
          margin-top: 0.35rem;
        }

        .stepper-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(197, 164, 109, 0.35);
          background: #FAF7F0;
          color: var(--color-forest);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .stepper-btn:hover:not(:disabled) {
          background: var(--color-forest);
          color: #FFFFFF;
          border-color: var(--color-forest);
          transform: scale(1.05);
        }

        .stepper-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          background: #F4F1EA;
          color: var(--color-charcoal-muted);
          border-color: rgba(197, 164, 109, 0.15);
        }

        .stepper-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 1.2rem;
          min-width: 90px;
        }

        .stepper-number {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--color-forest);
          line-height: 1;
        }

        .stepper-text {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-gold-deep);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.2rem;
        }

        .stepper-subtext {
          font-size: 0.78rem;
          color: var(--color-charcoal-muted);
          margin-top: 0.45rem;
          line-height: 1.4;
        }

        /* Events Checkboxes */
        .events-checkbox-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .event-check-card {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.75rem 0.9rem;
          border: 1px solid rgba(197, 164, 109, 0.3);
          border-radius: 10px;
          background: #FAF7F0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .event-check-card:hover {
          border-color: var(--color-gold);
          background: #FFFFFF;
        }

        .event-check-card.checked {
          border-color: var(--color-forest);
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(32, 61, 50, 0.08);
        }

        .check-box-indicator {
          width: 20px;
          height: 20px;
          border: 1.5px solid var(--color-forest);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #FFFFFF;
        }

        .check-title {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-forest);
        }

        .check-sub {
          display: block;
          font-size: 0.72rem;
          color: var(--color-charcoal-muted);
          margin-top: 0.1rem;
        }

        /* Submit Row */
        .form-submit-row {
          margin-top: 1.8rem;
          text-align: center;
        }

        .btn-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.95rem 2.5rem;
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          border-radius: 40px;
          width: 100%;
          max-width: 320px;
          box-shadow: 0 6px 20px rgba(197, 164, 109, 0.3);
        }

        /* Success Card */
        .rsvp-success-card {
          text-align: center;
          padding: 1.5rem 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-icon-wrapper {
          color: #2E7D32;
          margin-bottom: 0.8rem;
        }

        .confirmation-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(32, 61, 50, 0.08);
          border: 1px solid rgba(32, 61, 50, 0.2);
          color: var(--color-forest);
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
        }

        .success-title {
          font-size: 2rem;
          color: var(--color-forest);
          margin-bottom: 0.5rem;
        }

        .success-text {
          font-size: 1rem;
          color: var(--color-charcoal-muted);
          max-width: 480px;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }

        .confirmed-summary-box {
          background: #FAF7F0;
          border: 1px solid rgba(197, 164, 109, 0.35);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          width: 100%;
          max-width: 480px;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.35rem 0;
          font-size: 0.88rem;
          border-bottom: 1px solid rgba(197, 164, 109, 0.15);
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-label {
          color: var(--color-charcoal-muted);
          font-weight: 500;
        }

        .summary-val {
          color: var(--color-forest);
        }

        .summary-status-tag {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 12px;
        }

        .summary-status-tag.attending {
          background: #E8F5E9;
          color: #2E7D32;
        }

        .summary-status-tag.declined {
          background: #FFEBEE;
          color: #C62828;
        }

        .summary-note-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.2rem;
        }

        .rsvp-honest-notice {
          background: #FAF7F0;
          border: 1px solid rgba(197, 164, 109, 0.4);
          border-radius: 12px;
          padding: 0.85rem 1.2rem;
          font-size: 0.84rem;
          color: var(--color-forest);
          line-height: 1.5;
          margin-bottom: 1.5rem;
          max-width: 480px;
        }

        .success-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
          width: 100%;
          max-width: 360px;
        }

        .btn-whatsapp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #25D366;
          color: #FFFFFF;
          padding: 0.85rem 1.6rem;
          border-radius: 40px;
          font-size: 0.9rem;
          font-weight: 600;
          width: 100%;
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);
          transition: transform 0.2s ease;
        }

        .btn-whatsapp:hover {
          transform: translateY(-2px);
          background: #20BA5A;
        }

        .btn-edit-rsvp {
          font-size: 0.82rem;
          color: var(--color-charcoal-muted);
          text-decoration: underline;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .btn-edit-rsvp:hover {
          color: var(--color-forest);
        }

        /* Host Overview Section */
        .host-admin-section {
          margin-top: 2rem;
          text-align: center;
        }

        .btn-toggle-admin {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: transparent;
          border: 1px solid rgba(197, 164, 109, 0.4);
          color: var(--color-forest);
          padding: 0.55rem 1.25rem;
          border-radius: 25px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-toggle-admin:hover {
          background: #FFFFFF;
          border-color: var(--color-gold);
        }

        .admin-dashboard-card {
          margin-top: 1.25rem;
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.35);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 28px rgba(32, 61, 50, 0.06);
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
          text-align: left;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid rgba(197, 164, 109, 0.2);
        }

        .dashboard-title {
          font-size: 1.2rem;
          color: var(--color-forest);
          margin: 0;
        }

        .dashboard-subtitle {
          font-size: 0.78rem;
          color: var(--color-charcoal-muted);
          margin: 0.15rem 0 0;
        }

        .dashboard-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-dash-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #FAF7F0;
          border: 1px solid rgba(197, 164, 109, 0.35);
          color: var(--color-forest);
          padding: 0.4rem 0.85rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-dash-action:hover {
          background: #FFFFFF;
          border-color: var(--color-gold);
        }

        .btn-dash-gold {
          background: var(--color-forest);
          color: #FFFFFF;
          border-color: var(--color-forest);
        }

        .btn-dash-gold:hover {
          background: var(--color-gold-deep);
          border-color: var(--color-gold-deep);
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .metric-tile {
          background: #FAF7F0;
          border: 1px solid rgba(197, 164, 109, 0.25);
          border-radius: 10px;
          padding: 0.75rem 0.5rem;
          text-align: center;
        }

        .metric-val {
          display: block;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-forest);
        }

        .metric-lbl {
          display: block;
          font-size: 0.68rem;
          color: var(--color-charcoal-muted);
          margin-top: 0.15rem;
        }

        .records-table-container {
          overflow-x: auto;
        }

        .records-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }

        .records-table th {
          text-align: left;
          padding: 0.6rem 0.75rem;
          background: #FAF7F0;
          color: var(--color-forest);
          font-weight: 600;
          border-bottom: 1.5px solid rgba(197, 164, 109, 0.3);
          white-space: nowrap;
        }

        .records-table td {
          padding: 0.65rem 0.75rem;
          border-bottom: 1px solid rgba(197, 164, 109, 0.15);
          color: var(--color-charcoal);
        }

        .cell-name {
          font-weight: 600;
          color: var(--color-forest);
        }

        .cell-center {
          text-align: center;
        }

        .cell-contact {
          font-size: 0.75rem;
          color: var(--color-charcoal-muted);
        }

        .cell-events {
          font-size: 0.75rem;
          white-space: nowrap;
        }

        .cell-notes {
          font-size: 0.75rem;
          color: var(--color-charcoal-muted);
          max-width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .table-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 10px;
        }

        .table-badge.attending {
          background: #E8F5E9;
          color: #2E7D32;
        }

        .table-badge.declined {
          background: #FFEBEE;
          color: #C62828;
        }

        .empty-records {
          text-align: center;
          padding: 1.5rem;
          font-size: 0.85rem;
          color: var(--color-charcoal-muted);
          font-style: italic;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        @media (max-width: 640px) {
          .form-row-2,
          .events-checkbox-grid,
          .radio-options-row {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
