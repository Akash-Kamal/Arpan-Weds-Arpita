import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export interface RSVPRecord {
  id: string;
  fullName: string;
  phoneOrEmail: string;
  attendeesCount: number;
  attendanceStatus: "attending" | "declined";
  selectedEvents: string[];
  dietaryOrNotes?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "rsvps.json");

const EVENT_NAME_MAP: Record<string, string> = {
  "event-haldi": "Haldi Ceremony (9 Nov, 2:30 PM)",
  "event-mehendi": "Mehendi Ceremony (9 Nov, 7:00 PM)",
  "event-church-wedding": "Holy Matrimony / Wedding (11 Nov, 04:30 PM)",
  "event-cake-cutting": "Wedding Cake Cutting (11 Nov, 6:30 PM)",
  "event-wedding-dinner": "Wedding Dinner (11 Nov, 8:00 PM onwards)",
  "event-wedding-reception": "Wedding Reception (14 Nov, 7:00 PM)",
};

function ensureDataFile(): RSVPRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("Error reading rsvps.json:", err);
    return [];
  }
}

function saveDataFile(records: RSVPRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to rsvps.json:", err);
  }
}

// Background Supabase Sync (if configured)
async function syncToSupabase(record: RSVPRecord) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseKey.includes("your_supabase")) return;

  try {
    await fetch(`${supabaseUrl}/rest/v1/rsvps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        id: record.id,
        full_name: record.fullName,
        contact: record.phoneOrEmail,
        attendees_count: record.attendeesCount,
        attendance_status: record.attendanceStatus,
        selected_events: record.selectedEvents,
        notes: record.dietaryOrNotes,
        created_at: record.createdAt,
      }),
    });
  } catch (err) {
    console.warn("Supabase RSVP sync notice:", err);
  }
}

// Dispatch email notification containing ALL RSVP details directly to host's email
async function sendEmailNotification(record: RSVPRecord) {
  const recipientEmail = (
    process.env.RSVP_NOTIFICATION_EMAIL ||
    process.env.TO_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.SMTP_USER ||
    process.env.GMAIL_USER ||
    ""
  ).trim();

  const formattedEvents = record.selectedEvents && record.selectedEvents.length > 0
    ? record.selectedEvents.map((id) => EVENT_NAME_MAP[id] || id).join("\n• ")
    : "None selected";

  const formattedDate = new Date(record.createdAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const subject = `🕊️ Wedding RSVP: ${record.fullName} — ${
    record.attendanceStatus === "attending"
      ? `Attending (${record.attendeesCount} Guest${record.attendeesCount > 1 ? "s" : ""})`
      : "Declined"
  }`;

  const textContent = `
NEW WEDDING RSVP RECEIVED
Arpan Kamal Weds Arpita Simon
========================================

Guest Name: ${record.fullName}
Attendance: ${record.attendanceStatus === "attending" ? "JOYFULLY ATTENDING" : "DECLINED WITH LOVE"}
Total Guests: ${record.attendanceStatus === "attending" ? record.attendeesCount : "0"}
Contact (Phone/Email): ${record.phoneOrEmail || "Not provided"}

Events Attending:
• ${formattedEvents}

Message / Blessings / Notes:
${record.dietaryOrNotes || "None"}

Submitted At: ${formattedDate} (IST)
RSVP ID: ${record.id}
========================================
  `.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f6f2; margin: 0; padding: 24px; color: #203D32; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e0d8c8; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { background: #203D32; color: #ffffff; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0 0 6px; font-size: 22px; letter-spacing: 0.05em; font-weight: 600; color: #F4E3B2; }
    .header p { margin: 0; font-size: 13px; color: #E5ECE7; letter-spacing: 0.1em; text-transform: uppercase; }
    .content { padding: 28px 24px; }
    .status-badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; text-transform: uppercase; margin-bottom: 20px; }
    .status-attending { background: #e6f4ea; color: #137333; border: 1px solid #b7e1cd; }
    .status-declined { background: #fce8e6; color: #c5221f; border: 1px solid #fad2cf; }
    .field-row { margin-bottom: 16px; border-bottom: 1px solid #f0eee6; padding-bottom: 12px; }
    .field-label { font-size: 12px; color: #8F7344; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin-bottom: 4px; }
    .field-value { font-size: 16px; color: #203D32; font-weight: 500; }
    .events-box { background: #F8F5EE; border-left: 3px solid #C5A46D; padding: 12px 16px; margin: 8px 0; border-radius: 0 8px 8px 0; }
    .message-box { background: #F8F5EE; border-left: 3px solid #203D32; padding: 14px; font-style: italic; border-radius: 0 8px 8px 0; margin-top: 6px; color: #2b3e34; }
    .footer { background: #F8F5EE; padding: 16px 24px; text-align: center; font-size: 12px; color: #736E65; border-top: 1px solid #e0d8c8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <p>Christian Wedding of</p>
      <h1>Arpan Kamal &amp; Arpita Simon</h1>
      <p style="margin-top: 6px; font-size: 12px; color: #C5A46D;">Two Hearts. One Journey. With God.</p>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <span class="status-badge ${record.attendanceStatus === "attending" ? "status-attending" : "status-declined"}">
          ${record.attendanceStatus === "attending" ? `✓ JOYFULLY ATTENDING (${record.attendeesCount} GUEST${record.attendeesCount > 1 ? "S" : ""})` : "✕ DECLINED WITH LOVE"}
        </span>
      </div>

      <div class="field-row">
        <div class="field-label">Guest Name</div>
        <div class="field-value" style="font-size: 18px; font-weight: 700;">${record.fullName}</div>
      </div>

      <div class="field-row">
        <div class="field-label">Contact (Phone / Email)</div>
        <div class="field-value">${record.phoneOrEmail || "Not provided"}</div>
      </div>

      ${record.attendanceStatus === "attending" ? `
      <div class="field-row">
        <div class="field-label">Total Attending Guests</div>
        <div class="field-value">${record.attendeesCount} Person(s)</div>
      </div>

      <div class="field-row">
        <div class="field-label">Celebrations Selected</div>
        <div class="events-box">
          <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">
            ${record.selectedEvents.map((id) => `<li><strong>${EVENT_NAME_MAP[id] || id}</strong></li>`).join("")}
          </ul>
        </div>
      </div>
      ` : ""}

      <div class="field-row" style="border-bottom: none;">
        <div class="field-label">Message / Blessings / Special Requests</div>
        <div class="message-box">${record.dietaryOrNotes ? record.dietaryOrNotes.replace(/\n/g, "<br>") : "<em>No special notes provided.</em>"}</div>
      </div>
    </div>
    <div class="footer">
      Received on ${formattedDate} (IST) • RSVP ID: <code>${record.id}</code>
    </div>
  </div>
</body>
</html>
  `.trim();

  // Log to server console so hosts can also see every submission instantly in terminal
  console.log(`\n📬 [NEW RSVP SUBMISSION]`);
  console.log(textContent);
  console.log(`----------------------------------------\n`);

  let emailSent = false;

  // 1. Method A: Nodemailer (SMTP / Gmail App Password)
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (smtpUser && smtpPass && recipientEmail) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "465", 10),
        secure: (process.env.SMTP_PORT || "465") === "465",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Arpan & Arpita Wedding RSVP" <${smtpUser}>`,
        to: recipientEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`✅ RSVP email successfully delivered via SMTP to ${recipientEmail}`);
      emailSent = true;
    } catch (smtpErr) {
      console.error("Nodemailer SMTP delivery error:", smtpErr);
    }
  }

  // 2. Method B: Resend API (if RESEND_API_KEY is configured)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!emailSent && resendApiKey && recipientEmail) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "Arpan & Arpita Wedding <onboarding@resend.dev>",
          to: recipientEmail,
          subject,
          text: textContent,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        console.log(`✅ RSVP email successfully delivered via Resend to ${recipientEmail}`);
        emailSent = true;
      } else {
        const errData = await res.text();
        console.error("Resend API delivery error:", errData);
      }
    } catch (resendErr) {
      console.error("Resend delivery error:", resendErr);
    }
  }

  // 3. Method C: EmailJS (REST API)
  const emailJsService = (process.env.EMAILJS_SERVICE_ID || "").trim();
  const emailJsTemplate = (process.env.EMAILJS_TEMPLATE_ID || "").trim();
  const emailJsPublic = (
    process.env.EMAILJS_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
    process.env.EMAILJS_USER_ID ||
    ""
  ).trim();
  const emailJsPrivate = (
    process.env.EMAILJS_PRIVATE_KEY ||
    process.env.EMAILJS_ACCESS_TOKEN ||
    ""
  ).trim();

  if (!emailSent && emailJsService && emailJsTemplate && emailJsPublic) {
    try {
      const payload: Record<string, unknown> = {
        service_id: emailJsService,
        template_id: emailJsTemplate,
        user_id: emailJsPublic,
        template_params: {
          // Name aliases
          guest_name: record.fullName,
          from_name: record.fullName,
          name: record.fullName,

          // Contact aliases
          contact: record.phoneOrEmail || "Not provided",
          phone: record.phoneOrEmail || "Not provided",
          email: record.phoneOrEmail || "Not provided",

          // Attendance status
          attendance: record.attendanceStatus === "attending" ? "Joyfully Attending" : "Declined with Love",
          status: record.attendanceStatus === "attending" ? "Joyfully Attending" : "Declined with Love",

          // Headcount
          guests_count: record.attendeesCount,
          total_guests: record.attendeesCount,
          guests: record.attendeesCount,

          // Selected celebrations
          events: formattedEvents,
          celebrations: formattedEvents,

          // Personal message & notes
          notes: record.dietaryOrNotes || "None",
          message: record.dietaryOrNotes || "None",

          // Metadata
          date: formattedDate,
          time: formattedDate,
          rsvp_id: record.id,
          to_email: recipientEmail,
          subject,
        },
      };

      if (emailJsPrivate) {
        payload.accessToken = emailJsPrivate;
      }

      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log(`✅ RSVP email successfully delivered via EmailJS!`);
        emailSent = true;
      } else {
        const errorText = await res.text();
        console.error(`❌ EmailJS API returned error (status ${res.status}):`, errorText);
      }
    } catch (emailJsErr) {
      console.error("EmailJS network error:", emailJsErr);
    }
  }

  if (!emailSent) {
    console.warn(
      `⚠️ Note: Email notification was not dispatched to external inbox because EmailJS credentials are not yet entered in .env.local. The RSVP is safely saved to server storage and logged in console above.`
    );
  }
}

/**
 * GET /api/rsvp
 * Protected: Only accessible with admin secret to prevent public guest data leakage.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = req.headers.get("x-admin-secret") || searchParams.get("secret") || "";
  const serverSecret = process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  const records = ensureDataFile();

  // If unauthenticated, only return aggregate counts, never guest PII
  if (!serverSecret || secret !== serverSecret) {
    return NextResponse.json({
      success: true,
      notice: "Public guest confirmations are disabled for guest privacy. Full list is sent to host's email.",
      stats: {
        totalResponses: records.length,
      },
    });
  }

  const stats = {
    totalResponses: records.length,
    attendingCount: records.filter((r) => r.attendanceStatus === "attending").length,
    declinedCount: records.filter((r) => r.attendanceStatus === "declined").length,
    totalGuestsAttending: records
      .filter((r) => r.attendanceStatus === "attending")
      .reduce((sum, r) => sum + (Number(r.attendeesCount) || 1), 0),
  };

  return NextResponse.json({
    success: true,
    stats,
    records,
  });
}

/**
 * POST /api/rsvp
 * Accepts guest RSVP and delivers ALL details directly to host's email.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phoneOrEmail,
      attendeesCount,
      attendanceStatus,
      selectedEvents,
      dietaryOrNotes,
    } = body;

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name." },
        { status: 400 }
      );
    }

    const records = ensureDataFile();

    const newRecord: RSVPRecord = {
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fullName: fullName.trim(),
      phoneOrEmail: (phoneOrEmail || "").trim(),
      attendeesCount: attendanceStatus === "declined" ? 0 : Math.max(1, Number(attendeesCount) || 1),
      attendanceStatus: attendanceStatus === "declined" ? "declined" : "attending",
      selectedEvents: Array.isArray(selectedEvents) ? selectedEvents : [],
      dietaryOrNotes: (dietaryOrNotes || "").trim(),
      createdAt: new Date().toISOString(),
    };

    // 1. Save locally to server data store as safety backup
    records.unshift(newRecord);
    saveDataFile(records);

    // 2. Asynchronously deliver email notification to host & sync Supabase
    Promise.allSettled([
      sendEmailNotification(newRecord),
      syncToSupabase(newRecord),
    ]).catch((err) => console.error("RSVP notification error:", err));

    return NextResponse.json({
      success: true,
      message: "Your RSVP response has been submitted directly to the hosts. Thank you!",
      // We do not leak other guest confirmations or return private lists
      submittedName: newRecord.fullName,
    });
  } catch (error) {
    console.error("Error saving RSVP:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while saving your RSVP." },
      { status: 500 }
    );
  }
}
