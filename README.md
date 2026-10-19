# Arpan & Arpita — Wedding Celebration Website

An elegant, luxury Christian wedding invitation and celebration web application built with **Next.js (App Router)**, **TypeScript**, **Supabase Storage**, and **EmailJS**.

Designed in an opulent palette of **deep forest green**, **champagne gold**, and **warm ivory**, featuring classic serif typography, sacred scripture verses, and responsive layouts.

---

## ✨ Features

- **Hero & Sacred Countdown**: Real-time countdown to the Holy Matrimony in Asia/Kolkata timezone with liturgical scripture verses.
- **Event Schedule & Itinerary**: Complete confirmed celebration details for:
  - Haldi Ceremony (9 Nov 2026, Green Fields Colony, Faridabad)
  - Mehendi Ceremony (9 Nov 2026, Green Fields Colony, Faridabad)
  - Holy Matrimony Service (11 Nov 2026, The Epiphany Church Zahur Bux, Lucknow)
  - Wedding Cake Cutting (11 Nov 2026, Saket Northern Railway Club, Lucknow)
  - Wedding Dinner Banquet (11 Nov 2026, Saket Northern Railway Club, Lucknow)
  - Grand Wedding Reception (14 Nov 2026, Devansh Greens, Ballabhgarh, Faridabad)
- **Interactive Calendar Integration**: 1-click Google Calendar export and downloadable `.ics` iCalendar invites for all events.
- **GPS Navigation & QR Codes**: Direct Google Maps links and scannable navigation QR codes for each venue.
- **Private RSVP with Email Notifications**: Guests submit attendance, headcount, event selection, and personal blessings directly to the hosts' inbox via EmailJS / SMTP without exposing private guest lists publicly.
- **Community Memory Vault (Photo Archive)**: Guest photo uploads with client-side compression, magic byte validation, and cloud storage via **Supabase Storage** (`wedding-photos` bucket).
- **Background Hymn / Audio Player**: Ambient liturgical background music with play/pause and volume controls.
- **SEO & Social Sharing Ready**: Complete OpenGraph, Twitter card metadata, and semantic markup.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/arpan-arpita.git
cd arpan-arpita
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your service credentials:
```env
# 1. Supabase Cloud Storage & Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 2. EmailJS Notifications (for guest RSVP delivery)
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the wedding website.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage & Database**: [Supabase](https://supabase.com/)
- **Email Delivery**: [EmailJS](https://www.emailjs.com/) / [Nodemailer](https://nodemailer.com/)
- **Client Image Compression**: [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)

---

## 📦 Production Build

To create an optimized production build:
```bash
npm run build
npm run start
```

---

## 💒 Dedication
*“So they are no longer two, but one flesh. Therefore, what God has joined together, let no one separate.”*  
— **Matthew 19:6**
