import type { FieldId, GeoPoint } from "@/types/domain";

/**
 * SAMPLE DATA for the public explore screens: fictional circles, businesses,
 * events and posts. Shown with "Sample" labels until real ones exist.
 */

export interface CircleSample { id: string; title: string; field: FieldId; members: number; point: GeoPoint; when: string }
export interface PlaceSample { id: string; title: string; desc: string; point: GeoPoint; scene: SceneType; wellness?: boolean }
export interface EventSample { id: string; title: string; desc: string; point: GeoPoint; scene: SceneType; when: string; going: number; reset?: boolean }
export interface PostSample { id: string; kind: "Reset event" | "Milestone" | "Career event" | "New in the neighborhood" | "Volunteer" | "Community win"; title: string; body: string; when: string }

export type SceneType =
  | "hospital" | "clinic" | "tower" | "lowoffice" | "loft" | "hotel" | "site" | "store" | "warehouse"
  | "cafe" | "restaurant" | "yoga" | "cowork" | "park" | "community" | "group";

const p = (lat: number, lng: number): GeoPoint => ({ lat, lng });

export const CIRCLES: CircleSample[] = [
  { id: "c0", title: "NCLEX study circle", field: "health", members: 22, point: p(35.208, -80.829), when: "Tuesdays, 6:30 PM" },
  { id: "c1", title: "CPA exam circle", field: "acct", members: 9, point: p(35.149, -80.831), when: "Sundays, 2 PM" },
  { id: "c2", title: "ARE 5.0 study circle", field: "design", members: 14, point: p(35.246, -80.809), when: "Wednesdays, 7 PM" },
  { id: "c3", title: "PMP prep circle", field: "cons", members: 17, point: p(35.227, -80.844), when: "Mondays, 6 PM" },
  { id: "c4", title: "SHRM-CP study circle", field: "hr", members: 8, point: p(35.057, -80.849), when: "Thursdays, 7 PM" },
  { id: "c5", title: "New grad nurses", field: "health", members: 31, point: p(35.307, -80.738), when: "Every other Friday" },
  { id: "c6", title: "Charlotte data and analytics", field: "stem", members: 26, point: p(35.213, -80.856), when: "Monthly meetup" },
  { id: "c7", title: "Women in finance", field: "fin", members: 19, point: p(35.226, -80.84), when: "First Thursday, 6 PM" },
];

export const LOCAL: PlaceSample[] = [
  { id: "l0", title: "Common Thread Coffee", desc: "Study-friendly coffee shop with group tables", point: p(35.21, -80.857), scene: "cafe" },
  { id: "l1", title: "Ridgeline Kitchen", desc: "Restaurant with a private room open for study groups", point: p(35.248, -80.803), scene: "restaurant" },
  { id: "l2", title: "Greenway Yoga Studio", desc: "Open spots in Saturday morning classes", point: p(35.22, -80.81), scene: "yoga", wellness: true },
  { id: "l3", title: "Loft 12 Coworking", desc: "Remote-work-friendly day passes", point: p(35.23, -80.841), scene: "cowork" },
  { id: "l4", title: "Freedom Park trails", desc: "Paved loop, lake views and shade", point: p(35.194, -80.843), scene: "park", wellness: true },
  { id: "l5", title: "Stillwater Spa", desc: "Weekday recovery sessions", point: p(35.155, -80.83), scene: "yoga", wellness: true },
];

export const EVENTS: EventSample[] = [
  { id: "e0", title: "Saturday Reset walk", desc: "3 miles on Little Sugar Creek Greenway, easy pace", point: p(35.197, -80.833), scene: "park", when: "Saturday, 10 AM", going: 12, reset: true },
  { id: "e1", title: "Resume review night", desc: "Volunteer recruiters for nursing, tech and finance", point: p(35.244, -80.811), scene: "community", when: "Thursday, 6 PM", going: 34 },
  { id: "e2", title: "Healthcare career fair", desc: "Nursing and allied health employers", point: p(35.408, -80.588), scene: "community", when: "Next Wednesday, 10 AM", going: 88 },
  { id: "e3", title: "Neighborhood cleanup", desc: "Gloves and coffee provided", point: p(35.219, -80.802), scene: "park", when: "Sunday, 9 AM", going: 21, reset: true },
  { id: "e4", title: "Sunrise run club", desc: "5K social run, all paces", point: p(35.212, -80.86), scene: "park", when: "Wednesday, 6:15 AM", going: 17, reset: true },
];

export const POSTS: PostSample[] = [
  { id: "n0", kind: "Reset event", title: "Saturday Reset: 3-mile walk on Little Sugar Creek Greenway", body: "An easy-paced morning walk. All fields, all paces.", when: "Saturday, 10 AM. 12 members going." },
  { id: "n1", kind: "Milestone", title: "Every member of a local NCLEX circle passed this spring", body: "Eighteen new RNs, most starting on units across the region this summer.", when: "Posted by the circle organizer" },
  { id: "n2", kind: "Career event", title: "Free resume review night with volunteer recruiters", body: "Bring a printed or digital resume. Nursing, tech and finance reviewers on site.", when: "Thursday, 6 PM, NoDa" },
  { id: "n3", kind: "New in the neighborhood", title: "A study-friendly coffee shop opens in South End", body: "Group tables, outlets at every seat, and quiet hours on weekday mornings.", when: "Posted by the business" },
  { id: "n4", kind: "Volunteer", title: "Neighborhood cleanup and tree planting", body: "Gloves and coffee provided. Great for meeting neighbors.", when: "Sunday, 9 AM, Plaza Midwood" },
  { id: "n5", kind: "Community win", title: "Local students launch free coding workshops for teens", body: "University computer science students teach Saturday sessions at a community center.", when: "Saturdays through May" },
];

export const HOODS: { name: string; point: GeoPoint }[] = [
  ["Uptown", 35.227, -80.843], ["South End", 35.212, -80.859], ["Dilworth", 35.205, -80.851], ["Plaza Midwood", 35.221, -80.806],
  ["NoDa", 35.247, -80.806], ["Elizabeth", 35.208, -80.826], ["SouthPark", 35.152, -80.829], ["Ballantyne", 35.053, -80.849],
  ["University City", 35.307, -80.735], ["Steele Creek", 35.11, -80.96], ["Matthews", 35.117, -80.723], ["Mint Hill", 35.18, -80.647],
  ["Pineville", 35.083, -80.887], ["Huntersville", 35.41, -80.843], ["Concord", 35.409, -80.58], ["Fort Mill, SC", 35.007, -80.945],
  ["Gastonia", 35.262, -81.187],
].map(([name, lat, lng]) => ({ name: name as string, point: { lat: lat as number, lng: lng as number } }));

/* ───────── Community feed for "What's hot" ───────── */

export type FeedKind = "Event" | "Good news" | "Congrats" | "New in town" | "Celebration" | "Game day";

export interface FeedPost {
  id: string;
  kind: FeedKind;
  title: string;
  body: string;
  by: string;
  where: string;
  when: string;
  cheers: number;
  going?: number;
}

/**
 * SAMPLE posts. In the live app these come from members and verified
 * businesses. People only appear in posts they share or approve themselves.
 */
export const FEED: FeedPost[] = [
  { id: "f1", kind: "Event", title: "Saturday Reset: 3-mile walk on Little Sugar Creek Greenway", body: "Easy pace, all fields welcome. Meet at the Morehead entrance.", by: "Reset organizers", where: "Midtown", when: "Saturday, 10 AM", cheers: 18, going: 12 },
  { id: "f2", kind: "Celebration", title: "Alex and Rina got married this weekend", body: "We met in a PATHD study circle two years ago. Thank you, neighbors, for all the love!", by: "Shared by the couple", where: "Dilworth", when: "2 hours ago", cheers: 214 },
  { id: "f3", kind: "Game day", title: "Hometown win! Our city's team takes Sunday's home game", body: "Watch party regulars at Ridgeline Kitchen say it was the loudest room in NoDa.", by: "Posted by a local fan", where: "Uptown", when: "Yesterday", cheers: 96 },
  { id: "f4", kind: "Congrats", title: "Priya S. passed all four parts of the CPA exam", body: "Eighteen months of Sunday study sessions with the CPA circle paid off.", by: "Shared by Priya", where: "SouthPark", when: "4 hours ago", cheers: 73 },
  { id: "f5", kind: "New in town", title: "Welcome Jordan and Sam, just moved here from Chicago", body: "New to the city and looking for a run club, a good taco spot and people to meet.", by: "Shared by Jordan", where: "NoDa", when: "6 hours ago", cheers: 41 },
  { id: "f6", kind: "Good news", title: "Every member of a local NCLEX circle passed this spring", body: "Eighteen new RNs, most starting on units across the region this summer.", by: "Posted by the circle organizer", where: "Elizabeth", when: "1 day ago", cheers: 128 },
  { id: "f7", kind: "Event", title: "Plaza Midwood block party", body: "Live music, food trucks and a kids' zone. Local businesses have tables all afternoon.", by: "Plaza Midwood neighbors", where: "Plaza Midwood", when: "Saturday, 4 PM", cheers: 52, going: 140 },
  { id: "f8", kind: "Congrats", title: "Deon K. earned his CEN certification", body: "Emergency nursing certified. Coffee is on me at the next study session.", by: "Shared by Deon", where: "Concord", when: "1 day ago", cheers: 64 },
  { id: "f9", kind: "Game day", title: "South End Strikers win the rec league championship", body: "Adult co-ed soccer, undefeated season. Sign-ups for the fall league open Monday.", by: "Posted by the league", where: "South End", when: "2 days ago", cheers: 37 },
  { id: "f10", kind: "New in town", title: "Keisha just relocated for a nursing job", body: "Starting on the med-surg floor next week. Would love a walking buddy and church recommendations.", by: "Shared by Keisha", where: "University City", when: "2 days ago", cheers: 29 },
  { id: "f11", kind: "Good news", title: "Neighborhood cleanup planted 40 new trees", body: "Sixty volunteers showed up Sunday morning. Next one is in October.", by: "Posted by the organizers", where: "Plaza Midwood", when: "3 days ago", cheers: 88 },
  { id: "f12", kind: "Congrats", title: "Andrea R. started as Nurse Manager at Piedmont Regional", body: "From new grad to nurse manager in eight years. Thank you to every mentor along the way.", by: "Shared by Andrea", where: "Ballantyne", when: "3 days ago", cheers: 102 },
  { id: "f13", kind: "Event", title: "Free resume review night", body: "Volunteer recruiters for nursing, tech and finance. Bring a printed or digital resume.", by: "Career event", where: "NoDa", when: "Thursday, 6 PM", cheers: 24, going: 34 },
  { id: "f14", kind: "Celebration", title: "Common Thread Coffee turns one", body: "Free drip coffee all morning for anyone who's ever studied here.", by: "Posted by the business", where: "South End", when: "4 days ago", cheers: 45 },
];

/* ───────── VYBR8-inspired features, career-focused (all SAMPLE data) ───────── */

/** Member ratings of employers, 1–5 per category. Ranked by confidence, never by payment. */
export interface EmployerRating {
  company: string;
  field: FieldId;
  ratings: number; // how many verified employees rated
  scores: { pay: number; management: number; growth: number; flexibility: number; culture: number };
}
export const EMPLOYER_RATINGS: EmployerRating[] = [
  { company: "Tidewell Health", field: "health", ratings: 48, scores: { pay: 4.0, management: 3.8, growth: 4.3, flexibility: 3.4, culture: 4.2 } },
  { company: "Quarry Labs", field: "stem", ratings: 31, scores: { pay: 4.4, management: 4.1, growth: 4.5, flexibility: 4.7, culture: 4.4 } },
  { company: "Brightledger Financial", field: "fin", ratings: 57, scores: { pay: 4.2, management: 3.6, growth: 3.9, flexibility: 3.8, culture: 3.7 } },
  { company: "Harrow & Pine CPAs", field: "acct", ratings: 12, scores: { pay: 3.9, management: 4.4, growth: 4.2, flexibility: 4.0, culture: 4.5 } },
  { company: "Hollis Build Group", field: "cons", ratings: 22, scores: { pay: 4.3, management: 3.9, growth: 4.0, flexibility: 2.9, culture: 3.8 } },
  { company: "Ferncourt Studio", field: "design", ratings: 9, scores: { pay: 3.7, management: 4.6, growth: 4.4, flexibility: 4.3, culture: 4.8 } },
  { company: "Saltbox Hotels", field: "hosp", ratings: 26, scores: { pay: 3.4, management: 3.9, growth: 3.7, flexibility: 3.1, culture: 4.1 } },
  { company: "Cabarrus Valley Medical", field: "health", ratings: 35, scores: { pay: 4.1, management: 3.5, growth: 4.0, flexibility: 3.2, culture: 3.8 } },
  { company: "Halden & Rye", field: "fashion", ratings: 14, scores: { pay: 3.5, management: 4.0, growth: 3.8, flexibility: 3.6, culture: 4.3 } },
  { company: "Carolina Crest Bank", field: "fin", ratings: 3, scores: { pay: 5.0, management: 5.0, growth: 5.0, flexibility: 5.0, culture: 5.0 } },
];

export type PerkMoment = "Interview day" | "New job" | "Graduation" | "License passed" | "Birthday";
export interface Perk { id: string; moment: PerkMoment; title: string; business: string; where: string; detail: string; needs: string; window: string; source: "From the business" | "Community tip, reviewed by PATHD"; confirmed: string }
export const PERKS: Perk[] = [
  { id: "p1", moment: "Interview day", title: "Free line-up before your interview", business: "Crown & Comb Barbers", where: "NoDa", detail: "Quick shape-up so you walk in sharp.", needs: "Show your interview invite in the PATHD app", window: "Day of or day before", source: "From the business", confirmed: "Sep 22, 2026" },
  { id: "p2", moment: "Interview day", title: "20% off pressing and tailoring", business: "Pressed Garment Care", where: "SouthPark", detail: "Suits, blazers and dresses ready in 24 hours.", needs: "PATHD interview badge", window: "Week of your interview", source: "From the business", confirmed: "Sep 18, 2026" },
  { id: "p3", moment: "New job", title: "Free coffee your whole first week", business: "Common Thread Coffee", where: "South End", detail: "One drip coffee a day, Monday to Friday.", needs: "PATHD new-job badge", window: "First 7 days", source: "From the business", confirmed: "Sep 25, 2026" },
  { id: "p4", moment: "New job", title: "First month of coworking at half price", business: "Loft 12 Coworking", where: "Uptown", detail: "For remote and hybrid starters.", needs: "PATHD new-job badge", window: "First 30 days", source: "From the business", confirmed: "Sep 14, 2026" },
  { id: "p5", moment: "Graduation", title: "Free dessert for the graduate", business: "Ridgeline Kitchen", where: "NoDa", detail: "Celebrate with your table. Dessert's on them.", needs: "PATHD graduation badge", window: "Graduation month", source: "Community tip, reviewed by PATHD", confirmed: "Sep 10, 2026" },
  { id: "p6", moment: "License passed", title: "Free headshot mini-session", business: "Northlight Portraits", where: "Plaza Midwood", detail: "Three edited headshots for your new profile.", needs: "Verified license on PATHD", window: "Within 60 days", source: "From the business", confirmed: "Sep 20, 2026" },
  { id: "p7", moment: "Birthday", title: "Free class on your birthday week", business: "Greenway Yoga Studio", where: "Plaza Midwood", detail: "Any class, any level.", needs: "Show ID", window: "Birthday week", source: "From the business", confirmed: "Sep 12, 2026" },
];

export interface MeetSpot {
  id: string; name: string; kind: "Coffee shop" | "Coworking" | "Library" | "Restaurant"; neighborhood: string; point: GeoPoint;
  tags: string[]; laptop: string; hours: string; featured: boolean; dayPass?: string;
}
/** Work-friendly spots: also the candidates for Link Up. "Featured" means reviewed by PATHD, never paid. */
export const MEET_SPOTS: MeetSpot[] = [
  { id: "s1", name: "Common Thread Coffee", kind: "Coffee shop", neighborhood: "South End", point: { lat: 35.21, lng: -80.857 }, tags: ["Fast Wi-Fi", "Outlets at every seat", "Group tables"], laptop: "Laptops welcome all day", hours: "6 AM to 8 PM", featured: true },
  { id: "s2", name: "Loft 12 Coworking", kind: "Coworking", neighborhood: "Uptown", point: { lat: 35.23, lng: -80.841 }, tags: ["Meeting rooms", "Phone booths", "Printing"], laptop: "Members and day passes", hours: "24/7 for members", featured: true, dayPass: "Day pass available" },
  { id: "s3", name: "Ridgeline Kitchen", kind: "Restaurant", neighborhood: "NoDa", point: { lat: 35.248, lng: -80.803 }, tags: ["Private room", "Groups"], laptop: "Laptops until 4 PM", hours: "11 AM to 10 PM", featured: false },
  { id: "s4", name: "Main Library, Uptown", kind: "Library", neighborhood: "Uptown", point: { lat: 35.228, lng: -80.839 }, tags: ["Free", "Quiet rooms", "Study rooms to book"], laptop: "Free, all day", hours: "9 AM to 8 PM", featured: true },
  { id: "s5", name: "SouthPark Commons Café", kind: "Coffee shop", neighborhood: "SouthPark", point: { lat: 35.152, lng: -80.831 }, tags: ["Parking", "Outlets"], laptop: "Laptops weekdays until 5 PM", hours: "7 AM to 7 PM", featured: false },
  { id: "s6", name: "University Research Park Lounge", kind: "Coworking", neighborhood: "University City", point: { lat: 35.3, lng: -80.765 }, tags: ["Parking", "Quiet", "Monitors"], laptop: "Day passes", hours: "7 AM to 9 PM", featured: true, dayPass: "Day pass available" },
  { id: "s7", name: "Ballantyne Commons Coffee", kind: "Coffee shop", neighborhood: "Ballantyne", point: { lat: 35.056, lng: -80.852 }, tags: ["Parking", "Group tables"], laptop: "Laptops welcome all day", hours: "6:30 AM to 6 PM", featured: false },
  { id: "s8", name: "Matthews Station Café", kind: "Coffee shop", neighborhood: "Matthews", point: { lat: 35.117, lng: -80.721 }, tags: ["Small groups", "Patio"], laptop: "Laptops except weekend mornings", hours: "7 AM to 6 PM", featured: false },
];

export interface Pro { id: string; name: string; role: string; field: FieldId; years: number; offers: string[]; verified: boolean; tip: string }
export const PROS: Pro[] = [
  { id: "m1", name: "Andrea R.", role: "Nurse Manager", field: "health", years: 8, offers: ["Mock interviews", "Charge nurse prep"], verified: true, tip: "Bring one patient story that shows judgment, not just tasks. Managers remember stories." },
  { id: "m2", name: "Marcus T.", role: "Senior Software Engineer", field: "stem", years: 9, offers: ["Resume reviews", "System design practice"], verified: true, tip: "Put the impact first on every bullet: what changed because you shipped it." },
  { id: "m3", name: "Priya S., CPA", role: "Tax Manager", field: "acct", years: 7, offers: ["CPA study plans", "Coffee chats"], verified: true, tip: "Schedule FAR first while school is fresh. Study four days on, one day off." },
  { id: "m4", name: "Denise W.", role: "HR Business Partner", field: "hr", years: 12, offers: ["Resume reviews", "Salary conversations"], verified: true, tip: "Negotiate on the whole offer: start date, title, remote days and training budget all count." },
  { id: "m5", name: "Luis G.", role: "Construction Superintendent", field: "cons", years: 15, offers: ["Career switch advice", "Site safety basics"], verified: true, tip: "OSHA 30 and a clean schedule update get you noticed faster than any cover letter." },
  { id: "m6", name: "Kendra J.", role: "Brand Director", field: "fashion", years: 10, offers: ["Portfolio reviews"], verified: false, tip: "Your portfolio should show three projects start to finish, not twenty thumbnails." },
];

export interface PopUp { id: string; employer: string; field: FieldId; title: string; where: string; when: string; today: boolean; detail: string }
export const POPUPS: PopUp[] = [
  { id: "u1", employer: "Tidewell Health", field: "health", title: "Walk-in interviews for RNs and CNAs", where: "Tidewell Main Campus, Elizabeth", when: "Today, 10 AM to 4 PM", today: true, detail: "Bring your license number and a resume. Same-day offers possible." },
  { id: "u2", employer: "Hollis Build Group", field: "cons", title: "Hiring truck: field engineers and APMs", where: "University City jobsite", when: "Today, 11 AM to 2 PM", today: true, detail: "Talk to superintendents on site. Hard hats provided." },
  { id: "u3", employer: "Saltbox Hotels", field: "hosp", title: "Front office and events hiring day", where: "Saltbox Uptown lobby", when: "Thursday, 9 AM to 1 PM", today: false, detail: "Managers interviewing on the spot." },
  { id: "u4", employer: "Brightledger Financial", field: "fin", title: "Analyst info session and coffee", where: "Loft 12 Coworking, Uptown", when: "Friday, 8 AM", today: false, detail: "Meet the analytics team before applications open." },
  { id: "u5", employer: "Quarry Labs", field: "stem", title: "Open office hours for engineers", where: "Quarry Labs, South End", when: "Saturday, 12 PM to 3 PM", today: false, detail: "Tour, pair with an engineer, ask anything." },
];
