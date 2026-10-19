import { WeddingEvent } from "@/types/wedding";

function formatToICSDate(isoString: string): string {
  // Convert ISO string e.g. "2026-11-11T16:00:00+05:30" to UTC ICS format "YYYYMMDDTHHmmssZ"
  const date = new Date(isoString);
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function generateICSContent(event: WeddingEvent): string {
  const start = formatToICSDate(event.startDateTime);
  const end = event.endDateTime
    ? formatToICSDate(event.endDateTime)
    : formatToICSDate(new Date(new Date(event.startDateTime).getTime() + 2 * 60 * 60 * 1000).toISOString());

  const fullLocation = `${event.venueName}, ${event.venueAddress}, ${event.city}, ${event.state}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Arpan & Arpita Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}-202611@arpanarpita.wedding`,
    `DTSTAMP:${formatToICSDate(new Date().toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.name} — Arpan Kamal & Arpita Simon Wedding`,
    `DESCRIPTION:${event.description || event.calendarDescription}`,
    `LOCATION:${fullLocation}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICSFile(event: WeddingEvent): void {
  const icsContent = generateICSContent(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${event.id}-arpan-arpita.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(event: WeddingEvent): string {
  const start = formatToICSDate(event.startDateTime);
  const end = event.endDateTime
    ? formatToICSDate(event.endDateTime)
    : formatToICSDate(new Date(new Date(event.startDateTime).getTime() + 2 * 60 * 60 * 1000).toISOString());

  const fullLocation = `${event.venueName}, ${event.venueAddress}, ${event.city}, ${event.state}`;
  const title = `${event.name} — Arpan Kamal & Arpita Simon`;
  const details = `${event.description || ""}\n\nTwo Hearts. One Journey. With God.`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: details,
    location: fullLocation,
    ctz: "Asia/Kolkata",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
