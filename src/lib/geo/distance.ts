import type { GeoPoint } from "@/types/domain";

const EARTH_RADIUS_MILES = 3958.8;

export function milesBetween(a: GeoPoint, b: GeoPoint): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}

/**
 * Coarsen a point to a ~1.1 km grid before it is shown or shared.
 * Residential precision never leaves the owner-only table.
 */
export function coarsen(p: GeoPoint, decimals = 2): GeoPoint {
  const f = 10 ** decimals;
  return { lat: Math.round(p.lat * f) / f, lng: Math.round(p.lng * f) / f };
}

export function formatMiles(m: number): string {
  return m < 10 ? `${m.toFixed(1)} miles away` : `${Math.round(m)} miles away`;
}
