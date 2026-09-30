"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { GeoPoint } from "@/types/domain";
import { CHARLOTTE, findCity, type City } from "@/lib/explore/cities";

/**
 * Visitor state for the explore screens: where they start, one place that
 * matters (a child's school, daycare...), saved (hearted) jobs and the commute
 * radius. Kept only on this device (localStorage). Nothing here is sent to
 * PATHD's servers; members' saved jobs move to their account once signed in.
 */

export interface Anchor extends GeoPoint { label: string }
export interface PlaceAnchor extends GeoPoint { type: string }

interface ExploreState {
  city: City;
  setCity: (c: City) => void;
  home: Anchor;
  place: PlaceAnchor | null;
  saved: string[];
  radius: number;
  setHome: (a: Anchor) => void;
  setPlace: (p: PlaceAnchor | null) => void;
  toggleSaved: (jobId: string) => void;
  isSaved: (jobId: string) => boolean;
  setRadius: (miles: number) => void;
}

const DEFAULT_HOME: Anchor = { lat: 35.212, lng: -80.859, label: "South End" };
const KEY = "pathd:explore:v1";

const ExploreContext = createContext<ExploreState | null>(null);

interface Stored { city?: string; home?: Anchor; place?: PlaceAnchor | null; saved?: string[]; radius?: number }

function readStored(): Stored {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
}

export function ExploreProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<City>(CHARLOTTE);
  const [home, setHomeState] = useState<Anchor>(DEFAULT_HOME);
  const [place, setPlaceState] = useState<PlaceAnchor | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [radius, setRadiusState] = useState<number>(25);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Load after mount so server and client render the same first frame.
  useEffect(() => {
    const s = readStored();
    const c = findCity(s.city);
    if (c) setCityState(c);
    if (s.home) setHomeState(s.home);
    if (s.place !== undefined) setPlaceState(s.place);
    if (Array.isArray(s.saved)) setSaved(s.saved.filter((x): x is string => typeof x === "string"));
    if (typeof s.radius === "number") setRadiusState(s.radius);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ city: city.id, home, place, saved, radius }));
    } catch {
      /* storage unavailable: keep in memory */
    }
  }, [city, home, place, saved, radius, loaded]);

  const toggleSaved = useCallback((jobId: string) => {
    setSaved((cur: string[]) => (cur.includes(jobId) ? cur.filter((id: string) => id !== jobId) : [...cur, jobId]));
  }, []);
  const isSaved = useCallback((jobId: string) => saved.includes(jobId), [saved]);

  const value = useMemo<ExploreState>(
    () => ({
      city,
      // Switching cities re-centers home on that city's downtown.
      setCity: (c: City) => { setCityState(c); setHomeState({ lat: c.lat, lng: c.lng, label: `downtown ${c.name}` }); },
      home,
      place,
      saved,
      radius,
      setHome: (a: Anchor) => setHomeState(a),
      setPlace: (p: PlaceAnchor | null) => setPlaceState(p),
      toggleSaved,
      isSaved,
      setRadius: (m: number) => setRadiusState(m),
    }),
    [city, home, place, saved, radius, toggleSaved, isSaved],
  );

  return <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>;
}

export function useExplore(): ExploreState {
  const ctx = useContext(ExploreContext);
  if (!ctx) throw new Error("useExplore must be used inside <ExploreProvider>");
  return ctx;
}
