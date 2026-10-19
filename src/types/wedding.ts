export interface WeddingEvent {
  id: string;
  name: string;
  dayOfWeek: string;
  date: string; // ISO date or formatted
  displayDate: string;
  time: string;
  startDateTime: string; // ISO for calendar & countdown
  endDateTime?: string;
  venueName: string;
  venueAddress: string;
  city: string;
  state: string;
  description?: string;
  celebrationsDetail?: string;
  scripture?: {
    verse: string;
    reference: string;
  };
  invitationText?: string;
  benediction?: string;
  image: string;
  themeColor: string;
  themeAccent: string;
  badge: string;
  mapQuery: string;
  googleMapsUrl?: string;
  qrCodeImage?: string;
  calendarSummary: string;
  calendarDescription: string;
}

export interface VenueInfo {
  id: string;
  name: string;
  eventsHeld: string[];
  fullAddress: string;
  cityState: string;
  landmarkNotice?: string;
  isAddressVerified: boolean;
  googleMapsDirectionsUrl: string;
  googleMapsEmbedQuery: string;
  qrCodeImage?: string;
  recommendedTravelNote?: string;
  phoneContactPlaceholder?: string;
}

export interface FamilyMember {
  role: string;
  name: string;
  relation: string;
  note?: string;
  isEditablePlaceholder?: boolean;
}

export interface MemorialLovedOne {
  name: string;
  title: string;
  relation?: string;
}

export interface FamilySide {
  side: "Groom" | "Bride";
  personName: string;
  fatherName?: string;
  motherName?: string;
  siblings?: FamilyMember[];
}

export interface StoryMilestone {
  yearOrPhase: string;
  title: string;
  subtitle: string;
  narrative: string;
  image?: string;
  isEditable?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  src: string;
  category: "Ceremony" | "Moments" | "Celebrations" | "Editorial";
  creditNotice?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: "Schedule" | "Locations" | "Travel" | "Attire" | "RSVP";
  isConfirmed: boolean;
}
