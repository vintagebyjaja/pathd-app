# PATHD Product Specification (canonical)

> **Maintainer note:** paste the full original PATHD specification (sections 1–40) into this file. What follows is a
> faithful condensed version so the repo always carries the rules that must never drift.

**Name:** PATHD. **Tagline:** Find Your Path.
PATHD maps a person's entire professional journey: job discovery, career navigation, networking, resume intelligence,
salary transparency, geographic and remote discovery, swipe discovery, career progression, licensure pathways, study
groups, student communities, wellness cohorts, local business discovery, and employer/recruiter tools.
**PATHD is not a job board and not an Indeed clone.**

Lifecycle: Student → Study → Certify → Connect → Find → Apply → Work → Advance → Reset → Repeat.

## Brand language
PATHD Map, Cloud (remote jobs), Radar (alerts), Routes (career GPS), Match, Network, Circles (goal-based communities),
Reset (wellness, not therapy), Local (businesses), Profile. A career milestone is a **Waypoint**.

## Visual system
Purple `#49355F` + Cream `#F7F0E3` = identity. Peach `#F2A889` = jobs/actions/Apply. Lavender `#C9B8E4` = community,
Circles, education. Olive `#747A4C` = wellness/Reset. Gold `#C6A15B` = achievements, verified credentials, premium.
Premium, youthful, warm, mobile-first. Minimal gradients. Accessible throughout. Original interface; copy no one.
Logo: Tree of Life of connected people rooted in paths; wealth symbolism stays subtle (no dollar signs in UI).

## Non-negotiable rules
1. **No hidden pay.** Salary is prominent on every job. "Employer listed" and "PATHD estimate" are visually distinct.
   An estimate is never shown as employer pay. With no reliable data: "Pay not provided". Never invent salaries.
2. **Explainable matching.** PATHD Match is computed from structured criteria (skills, experience, education,
   certifications, licenses, location, salary, work preference, industry) and shows ✓ / △ / ✕ reasons.
   Protected characteristics (race, religion, sex, sexual orientation, disability, age, etc.) are never used.
3. **Never fabricate** jobs, salaries, connections, licenses, businesses, discounts or offers.
4. **Privacy.** Users control visibility of profile, employer, job-seeking status, salary preferences, location
   precision, Circles, connections and activity. Exact residential location is never exposed.
5. **User review.** AI-parsed resume data is a draft the user reviews and corrects. Applications are shown in full and
   authorized by the user before submission.
6. **Deterministic core.** Filters, distances, access, application state, salary labels, match components, progress,
   geo queries, permissions and billing are code, not AI. AI handles parsing, natural-language search translation,
   skill extraction, explanations and drafting.
7. **Honest monetization.** Core job discovery stays free. No pay-to-win ranking. Sponsored content is labeled.
   Don't aggressively monetize unemployment. People create the network; businesses monetize it.
8. **Licensure.** PATHD never implies it grants licenses.
9. **Legal data only.** Job ingestion uses authorized APIs, employer feeds, direct posting, ATS integrations. No illegal
   scraping. Track source, source_job_id, canonical URL, salary source, posting/expiry dates; deduplicate.
10. **Demo data** is fictional, diverse across industries, and always labeled.

## Your pay is yours
- PATHD never asks for, stores or displays anyone's current pay, pay history, income or net worth.
- Members may set a **minimum pay for their next job**. Only the member can see it. It filters and ranks jobs for them.
- Employers and recruiters never see the number. They see only a fit signal against their own posted range
  ("Fits your range" / outside range / not set). A job's posted range is always visible to members.
- Negotiation happens between the member and the employer, off PATHD. PATHD doesn't negotiate and takes no cut of pay.

## Staff access
Mission Control and all build, health and admin information are visible only to founders and the PATHD Team
(`staff_members`). Members never see site health. Non-staff see a PATHD-themed "Road closed ahead, rerouting" screen and are returned to their dashboard (signed in) or the home page (signed out) without receiving any staff data. Staff pages are not indexed, and
members cannot grant themselves staff or admin status.

## Account types
Individual, Student, Employer, Recruiter, Local Business, Administrator.

## Onboarding
1 Create account → 2 Choose purposes (multi-select: find a job, advance career, explore careers, build network, pursue
licensure, find a study group, connect with my major, find wellness/activity groups, hire talent) → 3 Resume upload
(PDF/DOCX, parsed, user-reviewed) → 4 Career preferences (roles, salary target, industries, remote/hybrid/in-person,
commute radius, locations, relocation) → 5 Build PATHD Profile.

## Key surfaces
Home ("Where will your path take you?", path card, next waypoint readiness, new matches, quick buttons: Explore Map,
Swipe Jobs, View Route, Radar, Circles). Map (layers: Jobs, People, Study, Wellness, Places; salary pins). Cloud
(remote filters). Swipe (salary first; left pass, right apply/interested, up save; button alternatives). Applications
(Interested, Saved, Applied, Interview, Offer, Accepted, Rejected, Withdrawn). Routes/Waypoints (readiness, remaining
requirements, Start Route). Radar (role, min salary, distance, remote, industry, level; notification prefs). Network
(connect, follow, message, mutuals, Ask About Job with drafted intro). Circles (Licensure, Study, Major, Industry,
Career, Alumni, Cohort, Wellness, Activity; posts, chat, events, sessions, resources, polls, milestones, calendar).
Licensure pathways. Student experience (university, major, class year). Reset (olive; walking/running groups, trails,
parks, fitness). Local (claimable business profiles; offers only when businesses create them). Universal natural-
language search over stored data. Feed only for useful professional/community updates, no engagement bait.

## Navigation
Desktop: Logo, Home, Map, Swipe, Routes, Circles, Network, Applications, Search, Radar, Messages, Notifications, Profile.
Mobile bottom nav: Home, Map, Swipe, Circles, Profile.

## Pricing
**Circles access (updated):** Free members can browse all Circles and study groups (name, member count, distance, schedule)
and keep Connections (add friends, view profiles). Joining Circles/study groups and connecting inside them requires PATHD+.

**Fields (updated):** PATHD focuses on professional, technical and credentialed careers: STEM & Tech, MBA & Strategy,
Accounting, Finance, Business, Healthcare & Nursing, HR, Recruiting, Hospitality (management, sales, guest operations),
Construction, Design, Fashion. Line-level kitchen roles (line cook, chef) are out of scope.

**Map (updated):** Members set a starting point (device location, neighborhood, or tapping the map) and can add places
that matter (child's school, daycare, gym). Every job shows straight-line distance from each. Locations stay on-device or
owner-only and are coarsened.

**Map previews (new):** Tapping a pin opens a Zillow-style card: a photo of the workplace, the company logo, pay first,
title, distances from home and the member's added place, and View/Save actions. On phones it opens as a bottom sheet.
Photos and logos come only from the employer or business (uploaded on their company or business page) or a properly
licensed imagery provider. Never scraped. Until one exists, show a clearly labeled illustration of the workplace type.

**What's hot (updated):** A community feed, not job stats: events, good news, congrats (promotions, licenses, graduations),
new in town, celebrations (weddings, anniversaries) and game day. People only appear in posts they share or approve.
Moderated; cheers and RSVPs, no follower counts. Sports results come from a licensed feed or local posts.

**VYBR8-inspired features (new, career focus):**
- PATHD Charts: employers ranked by verified-employee ratings (pay fairness, management, growth, flexibility, culture)
  using confidence ranking (5+ ratings to chart); top pay by field from employer-listed pay; biggest circles; by city.
  Payment never changes a score or rank; paid placements are labeled Sponsored.
- Milestone Perks: business-set deals for interview day, new job, graduation, license passed and birthday. Badges show
  the milestone only, never offer letters or pay. Perks come from businesses or reviewed community tips.
- Link Up: pick a meeting spot with the fairest commute for 2–6 people (smallest longest trip, then smallest average),
  using neighborhoods, never home addresses.
- Pros and mentors: verified professionals share tips and offer resume reviews and mock interviews.
- Hiring pop-ups: employer-posted walk-in interviews and hiring events, today and this week.
- Add a workplace: community submissions, reviewed before publishing; owners can claim pages.
- Home-screen app: PATHD installs as an app with the tree-and-path icon.
- Nationwide from day one: every state plus DC, with 4–6 major and secondary cities each (e.g. NC: Charlotte, Raleigh,
  Durham, Greensboro, Fayetteville; VA: Alexandria, Hampton, Norfolk, Richmond, Virginia Beach). Charlotte is the default
  focus. A city picker on every explore screen re-centers the map and distances on that city's downtown and suggests
  nearby cities (across state lines) for people relocating. Cities without listings yet say so honestly.
- Work spots: featured coffee shops, coworking spaces and libraries that welcome laptops (laptop policy, hours, amenities).
  "Featured" means reviewed by PATHD, never paid. Anyone can submit a work spot or a workplace for review.

**Portfolio portal (new):** Members upload PDF portfolios (25 MB max, up to 10 files) on their profile and choose who
sees each: Only me (default), Anyone with the link (private share links for firms, clients and peers, revocable anytime),
My connections, or Employers I apply to. Files are stored privately and opened through short-lived signed links. The
server verifies every file is a real PDF under 25 MB. Shared pages are never indexed.

**Neighborhood board (new):** Moderated local events, milestones and positive news from members and verified businesses.
Restaurants and local businesses can post open spots (tables, rooms, classes) and invite the community.

Free $0 · PATHD+ $5.99/mo or $49/yr · PATHD Pro $11.99/mo or $99/yr · Local $29/mo · Employer $79/mo (one basic free
post) · Recruiter $199/mo · Enterprise custom. Future add-ons: Job Boost ($19/7 days), local/event promotions,
booking/referral fees — all labeled.

## Stack
Next.js, TypeScript, React, Tailwind, PostgreSQL (Supabase auth/storage/realtime), Mapbox, Stripe, provider-agnostic
AI (Claude first). Secrets server-side only.

## Phases
1 Brand/design system, landing, auth, onboarding, resume upload, profile, job database, search, salary-first cards,
filters, basic Match · 2 Map, Cloud, Swipe, Save/Pass/Apply, applications dashboard · 3 Routes, Waypoints, Career GPS,
Radar, skill gaps · 4 Network, messaging, Circles, study groups, licensure, students · 5 Reset, trails, parks, activity
groups, Local · 6 Employer & recruiter portals, native posting, candidate matching, paid plans, Stripe, analytics.
