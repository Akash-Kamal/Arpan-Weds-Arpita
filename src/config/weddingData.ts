import {
  WeddingEvent,
  VenueInfo,
  FamilySide,
  StoryMilestone,
  GalleryItem,
  FAQItem,
  MemorialLovedOne,
} from "@/types/wedding";

export const WEDDING_COUPLE = {
  groom: {
    name: "Arpan Kamal",
    father: "Mr. Kamal Masih",
    mother: "Mrs. Sonia Kamal",
    initial: "A",
  },
  bride: {
    name: "Arpita Simon",
    initial: "A",
  },
  headline: "ARPAN KAMAL WEDS ARPITA SIMON",
  monogram: "A & A",
  tagline: "Two Hearts. One Journey. With God.",
  scripture: {
    verse: "So they are no longer two, but one flesh. Therefore, what God has joined together, let no one separate.",
    reference: "Matthew 19:6",
    secondaryVerse: "And over all these virtues put on love, which binds them all together in perfect unity.",
    secondaryReference: "Colossians 3:14",
  },
  weddingMainDateISO: "2026-11-11T16:30:00+05:30", // Wednesday, 11 Nov 2026, 04:30 PM IST
  timezone: "Asia/Kolkata",
  contactInfo: {
    rsvpWhatsAppNumber: "+919876543210",
    rsvpEmail: "rsvp@arpanarpita.wedding",
    isWhatsAppConfirmed: false,
  },
};

export const MEMORIAL_LOVED_ONES: MemorialLovedOne[] = [
  {
    name: "Late Mr. & Mrs. Prabhu Das Masih",
    title: "Remembering Our Loved Ones",
    relation: "Paternal Elders",
  },
  {
    name: "Late Mr. & Mrs. David",
    title: "Remembering Our Loved Ones",
    relation: "Beloved Elders",
  },
];

export const FAMILY_DATA: { groom: FamilySide; bride: FamilySide } = {
  groom: {
    side: "Groom",
    personName: "Arpan Kamal",
    fatherName: "Mr. Kamal Masih",
    motherName: "Mrs. Sonia Kamal",
    siblings: [
      {
        role: "Groom's Brother",
        name: "Mr. Akash Kamal",
        relation: "Brother",
        note: "Beloved Brother of the Groom",
        isEditablePlaceholder: false,
      },
      {
        role: "Groom's Sister",
        name: "Miss Akanksha Kamal",
        relation: "Sister",
        note: "Beloved Sister of the Groom",
        isEditablePlaceholder: false,
      },
    ],
  },
  bride: {
    side: "Bride",
    personName: "Arpita Simon",
    siblings: [],
  },
};

export const STORY_MILESTONES: StoryMilestone[] = [
  {
    yearOrPhase: "Chapter I",
    title: "Guided by Faith",
    subtitle: "A Meeting Ordained in Grace",
    narrative:
      "Every love story written in prayer unfolds in God's perfect season. Across families rooted in faith, love, and shared values, Arpan and Arpita's paths crossed with mutual reverence and open hearts.",
    image: "/images/church.jpg",
    isEditable: true,
  },
  {
    yearOrPhase: "Chapter II",
    title: "Two Hearts in Fellowship",
    subtitle: "Conversations, Laughter & Shared Prayers",
    narrative:
      "As seasons turned, conversations grew deeper — from cherished family memories to hopes for tomorrow. Through every prayer and heartfelt sharing, their bond strengthened with gentle certainty.",
    image: "/images/gallery_walk.jpg",
    isEditable: true,
  },
  {
    yearOrPhase: "Chapter III",
    title: "The Sacred Promise",
    subtitle: "With the Blessings of Our Families",
    narrative:
      "Surrounded by the warm prayers and deep love of our families, Arpan and Arpita made the quiet, sacred commitment to walk side by side into a life devoted to God and each other.",
    image: "/images/blessing.jpg",
    isEditable: true,
  },
  {
    yearOrPhase: "Chapter IV",
    title: "Towards the Altar",
    subtitle: "Wednesday, 11 November 2026",
    narrative:
      "Now, with thankful hearts, we prepare to exchange solemn holy vows at The Epiphany Church Zahur Bux on Capper Road, Lucknow, uniting two families and two journeys as one under God's everlasting grace.",
    image: "/images/hero.jpg",
    isEditable: true,
  },
];

export const INVITATION_PAGES = [
  {
    pageNumber: 1,
    title: "Holy Matrimony & Dinner",
    badge: "The Sacred Wedding",
    scripture: {
      verse: "So they are no longer two, but one flesh. Therefore, what God has joined together, let no one separate.",
      reference: "Matthew 19:6",
    },
    hosts: "Mr. Kamal Masih & Mrs. Sonia Kamal",
    invitationPreamble:
      "cordially request your presence and prayers at the Holy Matrimony of their beloved son",
    coupleDisplay: {
      groom: "Arpan Kamal",
      bride: "Arpita Simon",
    },
    dateDisplay: "WEDNESDAY, 11 NOVEMBER 2026",
    timeDisplay: "Holy Matrimony at 4:30 PM",
    venueDisplay: "The Epiphany Church Zahur Bux, Capper Road, Lucknow",
    dinnerDisplay: "Thereafter, dinner at The Railway Club, 2-A, Vivekanand Marg, Bandariya Bagh, Lucknow – 226001",
    mapUrl: "https://maps.app.goo.gl/USPANMpoeiHrCnsA9?g_st=ac",
    qrCodeImage: "/images/epiphany_church_qr.png",
    blessingsLabel: "With the Blessings of Our Families",
    blessingMembers: [
      "Mr. Kamal Masih & Mrs. Sonia Kamal",
      "Mr. Akash Kamal & Miss Akanksha Kamal",
      "Late Mr. & Mrs. Prabhu Das Masih",
      "Late Mr. & Mrs. David",
    ],
  },
  {
    pageNumber: 2,
    title: "Haldi Ceremony",
    badge: "Pre-Wedding Celebration",
    scripture: {
      verse: "The Lord has done great things for us, and we are filled with joy.",
      reference: "Psalm 126:3",
    },
    hosts: "With Love & Blessings From Both Families",
    invitationPreamble:
      "With hearts full of joy and gratitude to God, we invite you to join our family for a beautiful celebration of love, laughter and togetherness as we prepare for the wedding of",
    coupleDisplay: {
      groom: "Arpan Kamal",
      bride: "Arpita Simon",
    },
    dateDisplay: "MONDAY, 9 NOVEMBER 2026",
    timeDisplay: "1:00 PM",
    venueDisplay: "A-1702, Second Floor, Green Fields Colony, Faridabad, Haryana",
    mapUrl: "https://goo.gl/maps/uHTUEqBD7KXkgL817?g_st=ac",
    qrCodeImage: "/images/green_fields_qr.png",
    benediction:
      "May this joyful gathering be filled with God's love, happiness and countless blessings.",
    blessingsLabel: "With Love & Blessings From Both Families",
    blessingMembers: [
      "Mr. Kamal Masih & Mrs. Sonia Kamal",
      "Mr. Akash Kamal & Miss Akanksha Kamal",
      "Late Mr. & Mrs. Prabhu Das Masih",
      "Late Mr. & Mrs. David",
    ],
  },
  {
    pageNumber: 3,
    title: "Mehendi Ceremony",
    badge: "Henna Celebration",
    scripture: {
      verse: "Love is patient, love is kind.",
      reference: "1 Corinthians 13:4",
    },
    hosts: "With Love & Blessings From Both Families",
    invitationPreamble:
      "With grateful hearts and joyful spirits, we invite you to an evening of beautiful traditions, laughter and family togetherness as we celebrate the upcoming union of",
    coupleDisplay: {
      groom: "Arpan Kamal",
      bride: "Arpita Simon",
    },
    dateDisplay: "MONDAY, 9 NOVEMBER 2026",
    timeDisplay: "7:00 PM",
    venueDisplay: "A-1702, Second Floor, Green Fields Colony, Faridabad, Haryana",
    mapUrl: "https://goo.gl/maps/uHTUEqBD7KXkgL817?g_st=ac",
    qrCodeImage: "/images/green_fields_qr.png",
    benediction:
      "May every colour of this celebration bring happiness, every prayer bring blessings, and every moment become a cherished memory.",
    blessingsLabel: "With Love & Blessings From Both Families",
    blessingMembers: [
      "Mr. Kamal Masih & Mrs. Sonia Kamal",
      "Mr. Akash Kamal & Miss Akanksha Kamal",
      "Late Mr. & Mrs. Prabhu Das Masih",
      "Late Mr. & Mrs. David",
    ],
  },
  {
    pageNumber: 4,
    title: "Wedding Reception",
    badge: "Grand Evening Reception",
    scripture: {
      verse: "Above all, love each other deeply.",
      reference: "1 Peter 4:8",
    },
    hosts: "With Best Wishes From Both Families",
    invitationPreamble:
      "We request the pleasure of your company to bless the newlyweds as they begin their beautiful journey together, united in love and blessed by God.",
    coupleDisplay: {
      groom: "Arpan Kamal",
      bride: "Arpita Simon",
    },
    dateDisplay: "SATURDAY, 14 NOVEMBER 2026",
    timeDisplay: "7:00 PM",
    venueDisplay: "Devansh Greens, 45, Mile Stone, Delhi Mathura Road, Ballabgarh, Faridabad",
    mapUrl: "https://maps.app.goo.gl/neB2MUKSQgieRiJy6",
    qrCodeImage: "/images/devansh_greens_qr.png",
    benediction:
      "With grateful hearts, we look forward to celebrating this blessed new beginning with you. Your presence, prayers and blessings will make the occasion truly special.",
    blessingsLabel: "With Best Wishes From",
    blessingMembers: [
      "Mr. Kamal Masih & Mrs. Sonia Kamal",
      "Mr. Akash Kamal & Miss Akanksha Kamal",
      "Late Mr. & Mrs. Prabhu Das Masih",
      "Late Mr. & Mrs. David",
    ],
  },
];

export const WEDDING_EVENTS: WeddingEvent[] = [
  {
    id: "event-haldi",
    name: "Haldi Ceremony",
    dayOfWeek: "Monday",
    date: "2026-11-09",
    displayDate: "Monday, 9 November 2026",
    time: "1:00 PM",
    startDateTime: "2026-11-09T13:00:00+05:30",
    endDateTime: "2026-11-09T16:00:00+05:30",
    venueName: "Green Fields Colony",
    venueAddress: "A-1702, Second Floor, Green Fields Colony",
    city: "Faridabad",
    state: "Haryana, India",
    scripture: {
      verse: "The Lord has done great things for us, and we are filled with joy.",
      reference: "Psalm 126:3",
    },
    invitationText:
      "With hearts full of joy and gratitude to God, we invite you to join our family for a beautiful celebration of love, laughter and togetherness as we prepare for the wedding of Arpan Kamal & Arpita Simon.",
    benediction:
      "May this joyful gathering be filled with God's love, happiness and countless blessings.",
    description:
      "A joyful pre-wedding blessing with fragrant turmeric, marigold petals, love, and laughter as preparations begin.",
    image: "/images/haldi.jpg",
    themeColor: "#8D6B19",
    themeAccent: "#F4E3B2",
    badge: "Pre-Wedding Blessing",
    googleMapsUrl: "https://goo.gl/maps/uHTUEqBD7KXkgL817?g_st=ac",
    qrCodeImage: "/images/green_fields_qr.png",
    mapQuery: "A-1702, Second Floor, Green Fields Colony, Faridabad, Haryana, India",
    calendarSummary: "Arpan & Arpita — Haldi Ceremony",
    calendarDescription:
      "Haldi Ceremony for Arpan Kamal & Arpita Simon\\nVenue: A-1702, Second Floor, Green Fields Colony, Faridabad, Haryana, India\\nTime: 1:00 PM IST",
  },
  {
    id: "event-mehendi",
    name: "Mehendi Ceremony",
    dayOfWeek: "Monday",
    date: "2026-11-09",
    displayDate: "Monday, 9 November 2026",
    time: "7:00 PM",
    startDateTime: "2026-11-09T19:00:00+05:30",
    endDateTime: "2026-11-09T22:30:00+05:30",
    venueName: "Green Fields Colony",
    venueAddress: "A-1702, Second Floor, Green Fields Colony",
    city: "Faridabad",
    state: "Haryana, India",
    scripture: {
      verse: "Love is patient, love is kind.",
      reference: "1 Corinthians 13:4",
    },
    invitationText:
      "With grateful hearts and joyful spirits, we invite you to an evening of beautiful traditions, laughter and family togetherness as we celebrate the upcoming union of Arpan Kamal & Arpita Simon.",
    benediction:
      "May every colour of this celebration bring happiness, every prayer bring blessings, and every moment become a cherished memory.",
    description:
      "An enchanting evening of intricate henna artistry, gentle music, and warm family fellowship amidst sage foliage.",
    image: "/images/mehendi.jpg",
    themeColor: "#2F5445",
    themeAccent: "#D6E3D8",
    badge: "Henna Celebration",
    googleMapsUrl: "https://goo.gl/maps/uHTUEqBD7KXkgL817?g_st=ac",
    qrCodeImage: "/images/green_fields_qr.png",
    mapQuery: "A-1702, Second Floor, Green Fields Colony, Faridabad, Haryana, India",
    calendarSummary: "Arpan & Arpita — Mehendi Ceremony",
    calendarDescription:
      "Mehendi Ceremony for Arpan Kamal & Arpita Simon\\nVenue: A-1702, Second Floor, Green Fields Colony, Faridabad, Haryana, India\\nTime: 7:00 PM IST",
  },
  {
    id: "event-church-wedding",
    name: "Wedding Ceremony",
    dayOfWeek: "Wednesday",
    date: "2026-11-11",
    displayDate: "Wednesday, 11 November 2026",
    time: "04:30 PM",
    startDateTime: "2026-11-11T16:30:00+05:30",
    endDateTime: "2026-11-11T18:00:00+05:30",
    venueName: "The Epiphany Church Zahur Bux",
    venueAddress: "Capper Road",
    city: "Lucknow",
    state: "Uttar Pradesh, India",
    scripture: {
      verse: "So they are no longer two, but one flesh. Therefore, what God has joined together, let no one separate.",
      reference: "Matthew 19:6",
    },
    invitationText:
      "Mr. Kamal Masih & Mrs. Sonia Kamal cordially request your presence and prayers at the Holy Matrimony of their beloved son Arpan Kamal with Arpita Simon.",
    description:
      "Solemn Christian Holy Matrimony service, sacred wedding vows, exchange of rings, choral praise, and divine blessings under cathedral stone arches.",
    image: "/images/church.jpg",
    themeColor: "#C5A46D",
    themeAccent: "#F8F5EE",
    badge: "Holy Matrimony",
    googleMapsUrl: "https://maps.app.goo.gl/USPANMpoeiHrCnsA9?g_st=ac",
    qrCodeImage: "/images/epiphany_church_qr.png",
    mapQuery: "The Epiphany Church Zahur Bux, Capper Road, Lucknow, Uttar Pradesh, India",
    calendarSummary: "Arpan Kamal weds Arpita Simon — Holy Matrimony",
    calendarDescription:
      "Holy Matrimony Service for Arpan Kamal & Arpita Simon\\nVenue: The Epiphany Church Zahur Bux, Capper Road, Lucknow, Uttar Pradesh, India\\nTime: 04:30 PM IST",
  },
  {
    id: "event-cake-cutting",
    name: "Wedding Cake Cutting",
    dayOfWeek: "Wednesday",
    date: "2026-11-11",
    displayDate: "Wednesday, 11 November 2026",
    time: "6:30 PM",
    startDateTime: "2026-11-11T18:30:00+05:30",
    endDateTime: "2026-11-11T19:45:00+05:30",
    venueName: "The Railway Club",
    venueAddress: "2-A, Vivekanand Marg, Bandariya Bagh",
    city: "Lucknow – 226001",
    state: "Uttar Pradesh, India",
    description:
      "A joyful post-ceremony toast, ceremonial cutting of the wedding cake, and congratulations at The Railway Club banquet hall.",
    image: "/images/cake.jpg",
    themeColor: "#8F7344",
    themeAccent: "#F8F5EE",
    badge: "Ceremonial Toast & Cake",
    googleMapsUrl: "https://maps.app.goo.gl/fs1VmWxaAyMfR3Fg9?g_st=ac",
    qrCodeImage: "/images/railway_club_qr.png",
    mapQuery: "The Railway Club, 2-A, Vivekanand Marg, Bandariya Bagh, Lucknow 226001, Uttar Pradesh, India",
    calendarSummary: "Arpan & Arpita — Wedding Cake Cutting",
    calendarDescription:
      "Wedding Cake Cutting Celebration for Arpan Kamal & Arpita Simon\\nVenue: The Railway Club, 2-A, Vivekanand Marg, Bandariya Bagh, Lucknow – 226001\\nTime: 6:30 PM IST",
  },
  {
    id: "event-wedding-dinner",
    name: "Wedding Dinner",
    dayOfWeek: "Wednesday",
    date: "2026-11-11",
    displayDate: "Wednesday, 11 November 2026",
    time: "8:00 PM onwards",
    startDateTime: "2026-11-11T20:00:00+05:30",
    endDateTime: "2026-11-11T23:30:00+05:30",
    venueName: "The Railway Club",
    venueAddress: "2-A, Vivekanand Marg, Bandariya Bagh",
    city: "Lucknow – 226001",
    state: "Uttar Pradesh, India",
    description:
      "An elegant banquet dinner celebration with heartfelt toasts, classical music, and fine dining with the newly wedded couple.",
    celebrationsDetail: "Held at The Railway Club following the Holy Matrimony and cake cutting.",
    image: "/images/dinner.jpg",
    themeColor: "#203D32",
    themeAccent: "#E5ECE7",
    badge: "Banquet Dinner",
    googleMapsUrl: "https://maps.app.goo.gl/fs1VmWxaAyMfR3Fg9?g_st=ac",
    qrCodeImage: "/images/railway_club_qr.png",
    mapQuery: "The Railway Club, 2-A, Vivekanand Marg, Bandariya Bagh, Lucknow 226001, Uttar Pradesh, India",
    calendarSummary: "Arpan & Arpita — Wedding Dinner",
    calendarDescription:
      "Wedding Dinner Banquet for Arpan Kamal & Arpita Simon\\nVenue: The Railway Club, 2-A, Vivekanand Marg, Bandariya Bagh, Lucknow – 226001\\nTime: 8:00 PM onwards IST",
  },
  {
    id: "event-wedding-reception",
    name: "Wedding Reception",
    dayOfWeek: "Saturday",
    date: "2026-11-14",
    displayDate: "Saturday, 14 November 2026",
    time: "7:00 PM",
    startDateTime: "2026-11-14T19:00:00+05:30",
    endDateTime: "2026-11-14T23:30:00+05:30",
    venueName: "Devansh Greens",
    venueAddress: "45, Mile Stone, Delhi Mathura Road, Ballabgarh",
    city: "Faridabad",
    state: "Haryana, India",
    scripture: {
      verse: "Above all, love each other deeply.",
      reference: "1 Peter 4:8",
    },
    invitationText:
      "We request the pleasure of your company to bless the newlyweds as they begin their beautiful journey together, united in love and blessed by God.",
    benediction:
      "With grateful hearts, we look forward to celebrating this blessed new beginning with you. Your presence, prayers and blessings will make the occasion truly special.",
    description:
      "Grand wedding reception celebrating the couple, followed by cake cutting and dinner in the lush, lantern-lit lawns of Devansh Greens.",
    celebrationsDetail: "Celebrations include Reception, followed by cake cutting and dinner.",
    image: "/images/reception.jpg",
    themeColor: "#203D32",
    themeAccent: "#C5A46D",
    badge: "Grand Reception",
    mapQuery: "Devansh Greens, 45 Mile Stone, Delhi Mathura Road, Ballabgarh, Faridabad, Haryana, India",
    googleMapsUrl: "https://maps.app.goo.gl/neB2MUKSQgieRiJy6",
    qrCodeImage: "/images/devansh_greens_qr.png",
    calendarSummary: "Arpan & Arpita — Wedding Reception",
    calendarDescription:
      "Wedding Reception for Arpan Kamal & Arpita Simon\\nCelebrations: Reception, followed by cake cutting and dinner\\nVenue: Devansh Greens, 45, Mile Stone, Delhi Mathura Road, Ballabgarh, Faridabad, Haryana, India\\nTime: 7:00 PM IST",
  },
];

export const VENUES: VenueInfo[] = [
  {
    id: "venue-epiphany-church",
    name: "The Epiphany Church Zahur Bux",
    eventsHeld: ["Wedding Ceremony (11 Nov, 04:30 PM)"],
    fullAddress: "Capper Road",
    cityState: "Lucknow, Uttar Pradesh, India",
    landmarkNotice:
      "Historic sanctuary on Capper Road, Lalbagh / Hazratganj area. Guests are kindly requested to be seated by 04:15 PM.",
    isAddressVerified: true,
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/USPANMpoeiHrCnsA9?g_st=ac",
    googleMapsEmbedQuery: "The+Epiphany+Church+Zahur+Bux+Capper+Road+Lucknow",
    qrCodeImage: "/images/epiphany_church_qr.png",
    recommendedTravelNote:
      "Centrally situated on Capper Road near Hazratganj. Approximately 15 minutes drive from Lucknow Charbagh Railway Station.",
  },
  {
    id: "venue-railway-club",
    name: "The Railway Club",
    eventsHeld: ["Wedding Cake Cutting (11 Nov, 6:30 PM)", "Wedding Dinner (11 Nov, 8:00 PM onwards)"],
    fullAddress: "2-A, Vivekanand Marg, Bandariya Bagh",
    cityState: "Lucknow – 226001, Uttar Pradesh, India",
    landmarkNotice:
      "Heritage Railway Club lawns and banquet hall, 2-A Vivekanand Marg. Dedicated secure guest parking on premises.",
    isAddressVerified: true,
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/fs1VmWxaAyMfR3Fg9?g_st=ac",
    googleMapsEmbedQuery: "Railway+Club+Vivekanand+Marg+Bandariya+Bagh+Lucknow",
    qrCodeImage: "/images/railway_club_qr.png",
    recommendedTravelNote:
      "Located in Bandariya Bagh within convenient driving distance from The Epiphany Church for dinner following the ceremony.",
  },
  {
    id: "venue-green-fields",
    name: "Green Fields Colony Residence",
    eventsHeld: ["Haldi Ceremony (9 Nov, 1:00 PM)", "Mehendi Ceremony (9 Nov, 7:00 PM)"],
    fullAddress: "A-1702, Second Floor, Green Fields Colony",
    cityState: "Faridabad, Haryana, India",
    landmarkNotice: "Residential address — visitor parking assistance provided at gate entrance.",
    isAddressVerified: true,
    googleMapsDirectionsUrl: "https://goo.gl/maps/uHTUEqBD7KXkgL817?g_st=ac",
    googleMapsEmbedQuery: "Green+Fields+Colony+Faridabad+Haryana",
    qrCodeImage: "/images/green_fields_qr.png",
    recommendedTravelNote: "Easily accessible via Mathura Road and Delhi-Faridabad Skyway.",
  },
  {
    id: "venue-devansh-greens",
    name: "Devansh Greens",
    eventsHeld: ["Wedding Reception, Cake Cutting & Dinner (14 Nov, 7:00 PM)"],
    fullAddress: "45, Mile Stone, Delhi Mathura Road, Ballabgarh",
    cityState: "Faridabad, Haryana, India",
    landmarkNotice:
      "Lush outdoor lawn venue on 45 Mile Stone, Delhi Mathura Road. Valet and expansive on-site parking available.",
    isAddressVerified: true,
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/neB2MUKSQgieRiJy6",
    googleMapsEmbedQuery: "Devansh+Greens+Ballabgarh+Faridabad",
    qrCodeImage: "/images/devansh_greens_qr.png",
    recommendedTravelNote:
      "Located at 45 Mile Stone on Delhi-Mathura Road (NH-19), conveniently accessible via Raja Nahar Singh (Ballabhgarh) Metro Station.",
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-hero",
    title: "Cathedral Sanctuary",
    caption: "The majestic vaulted arches and golden sunlight evoking sacred solemnity.",
    src: "/images/hero.jpg",
    category: "Ceremony",
    creditNotice: "Curated aesthetic inspiration — will be updated with couple's wedding photographs.",
  },
  {
    id: "gal-church",
    title: "The Epiphany Church",
    caption: "Ivory floral garlands framing the entrance on Capper Road, Lucknow.",
    src: "/images/church.jpg",
    category: "Ceremony",
    creditNotice: "Editorial visual inspiration.",
  },
  {
    id: "gal-blessing",
    title: "Sacred Covenant",
    caption: "Holy Scripture and gold wedding bands resting in prayerful devotion.",
    src: "/images/blessing.jpg",
    category: "Moments",
    creditNotice: "Editorial visual inspiration.",
  },
  {
    id: "gal-couple-walk",
    title: "Walking in Grace",
    caption: "Two hearts stepping forward together under cathedral cloister colonnades.",
    src: "/images/gallery_walk.jpg",
    category: "Editorial",
    creditNotice: "Editorial visual inspiration.",
  },
  {
    id: "gal-haldi",
    title: "Golden Blessings",
    caption: "Sunlit marigolds and brass urli for the joyful Haldi ceremony.",
    src: "/images/haldi.jpg",
    category: "Celebrations",
    creditNotice: "Pre-wedding celebration visual inspiration.",
  },
  {
    id: "gal-mehendi",
    title: "Sage & Henna",
    caption: "Delicate bridal henna patterns framed by eucalyptus and jasmine.",
    src: "/images/mehendi.jpg",
    category: "Celebrations",
    creditNotice: "Pre-wedding celebration visual inspiration.",
  },
  {
    id: "gal-cake",
    title: "The Wedding Cake",
    caption: "Handcrafted tiers adorned with edible gold leaf and ivory florals.",
    src: "/images/cake.jpg",
    category: "Celebrations",
    creditNotice: "Editorial wedding cake visual inspiration.",
  },
  {
    id: "gal-dinner",
    title: "Candlelit Banquet",
    caption: "Warm candlelight, deep forest green accents, and celebratory fellowship at The Railway Club.",
    src: "/images/dinner.jpg",
    category: "Celebrations",
    creditNotice: "Editorial wedding dinner visual inspiration.",
  },
  {
    id: "gal-reception",
    title: "Devansh Greens Twilight",
    caption: "Canopy of warm fairy lights across the green lawns for the grand reception.",
    src: "/images/reception.jpg",
    category: "Celebrations",
    creditNotice: "Reception visual inspiration.",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "When and where is the Holy Matrimony service taking place?",
    answer:
      "The Wedding Ceremony (Holy Matrimony) will be held on Wednesday, 11 November 2026 at 04:30 PM at The Epiphany Church Zahur Bux, Capper Road, Lucknow. Please arrive 15–20 minutes early so all guests are comfortably seated before the sacred procession commences.",
    category: "Schedule",
    isConfirmed: true,
  },
  {
    question: "Where is the wedding dinner hosted following the church service?",
    answer:
      "Following the Holy Matrimony service, all guests are cordially invited for the Wedding Cake Cutting (6:30 PM) and Wedding Dinner (8:00 PM onwards) at The Railway Club, located at 2-A, Vivekanand Marg, Bandariya Bagh, Lucknow – 226001.",
    category: "Locations",
    isConfirmed: true,
  },
  {
    question: "How do the events span across Faridabad and Lucknow?",
    answer:
      "Our celebrations begin with the pre-wedding Haldi (1:00 PM) and Mehendi (7:00 PM) on Monday, 9 November 2026 in Green Fields Colony, Faridabad. The solemn Wedding Ceremony and Dinner take place on Wednesday, 11 November 2026 in Lucknow. Finally, the Grand Wedding Reception is hosted at Devansh Greens, 45 Mile Stone, Delhi-Mathura Road, Ballabgarh, Faridabad on Saturday, 14 November 2026 at 7:00 PM.",
    category: "Travel",
    isConfirmed: true,
  },
  {
    question: "What is the recommended travel plan between Lucknow and Faridabad?",
    answer:
      "Guests attending both the Lucknow ceremony and the Faridabad reception have a comfortable 2-day gap (Thursday, 12 November & Friday, 13 November). Frequent express trains (such as the Vande Bharat and Tejas Express) and direct flights operate between Lucknow (LKO) and Delhi NCR (DEL).",
    category: "Travel",
    isConfirmed: true,
  },
  {
    question: "Is there guidance on dress code or ceremony etiquette?",
    answer:
      "For the Wedding Ceremony at The Epiphany Church, formal church attire (suits, blazers, elegant sarees, or modest formal gowns) is warmly welcomed. For the Haldi and Mehendi, festive Indian attire in shades of yellow and green is lovely. For the Reception, formal evening wear is encouraged.",
    category: "Attire",
    isConfirmed: false,
  },
  {
    question: "How and by when should I RSVP?",
    answer:
      "Please submit your RSVP using the online form on this page or via WhatsApp by 15 October 2026. This helps us ensure thoughtful seating, catering, and personal care for each beloved guest.",
    category: "RSVP",
    isConfirmed: true,
  },
  {
    question: "Where can I find driving directions and parking information?",
    answer:
      "Each venue card in the Venues section features a direct 'Get Directions' button opening Google Maps. All our event locations feature designated guest parking or valet assistance.",
    category: "Locations",
    isConfirmed: true,
  },
];
