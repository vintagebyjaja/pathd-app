import type { GeoPoint } from "@/types/domain";
import { milesBetween } from "@/lib/geo/distance";

/**
 * PATHD is live nationwide. Each state lists its major and secondary cities
 * (city-center coordinates, approximate) so people can explore where they
 * live now or where they're moving next.
 */

export interface City extends GeoPoint { id: string; name: string; state: string; stateName: string }

type Row = [string, number, number];
const S: Record<string, [string, Row[]]> = {
  AL: ["Alabama", [["Birmingham", 33.52, -86.8], ["Huntsville", 34.73, -86.59], ["Montgomery", 32.37, -86.3], ["Mobile", 30.69, -88.04], ["Tuscaloosa", 33.21, -87.57]]],
  AK: ["Alaska", [["Anchorage", 61.22, -149.9], ["Fairbanks", 64.84, -147.72], ["Juneau", 58.3, -134.42], ["Wasilla", 61.58, -149.44]]],
  AZ: ["Arizona", [["Phoenix", 33.45, -112.07], ["Tucson", 32.22, -110.97], ["Mesa", 33.42, -111.83], ["Scottsdale", 33.49, -111.93], ["Tempe", 33.43, -111.94]]],
  AR: ["Arkansas", [["Little Rock", 34.75, -92.29], ["Fayetteville", 36.06, -94.16], ["Fort Smith", 35.39, -94.4], ["Springdale", 36.19, -94.13], ["Jonesboro", 35.84, -90.7]]],
  CA: ["California", [["Los Angeles", 34.05, -118.24], ["San Francisco", 37.77, -122.42], ["San Diego", 32.72, -117.16], ["San Jose", 37.34, -121.89], ["Sacramento", 38.58, -121.49], ["Oakland", 37.8, -122.27]]],
  CO: ["Colorado", [["Denver", 39.74, -104.99], ["Colorado Springs", 38.83, -104.82], ["Aurora", 39.73, -104.83], ["Fort Collins", 40.59, -105.08], ["Boulder", 40.01, -105.27]]],
  CT: ["Connecticut", [["Hartford", 41.76, -72.69], ["New Haven", 41.31, -72.92], ["Stamford", 41.05, -73.54], ["Bridgeport", 41.19, -73.2], ["Waterbury", 41.56, -73.05]]],
  DE: ["Delaware", [["Wilmington", 39.74, -75.55], ["Dover", 39.16, -75.52], ["Newark", 39.68, -75.75], ["Middletown", 39.45, -75.72]]],
  DC: ["District of Columbia", [["Washington", 38.91, -77.04]]],
  FL: ["Florida", [["Miami", 25.76, -80.19], ["Orlando", 28.54, -81.38], ["Tampa", 27.95, -82.46], ["Jacksonville", 30.33, -81.66], ["Fort Lauderdale", 26.12, -80.14]]],
  GA: ["Georgia", [["Atlanta", 33.75, -84.39], ["Savannah", 32.08, -81.09], ["Augusta", 33.47, -81.97], ["Columbus", 32.46, -84.99], ["Athens", 33.96, -83.38]]],
  HI: ["Hawaii", [["Honolulu", 21.31, -157.86], ["Hilo", 19.71, -155.09], ["Kailua", 21.4, -157.74], ["Kahului", 20.89, -156.47]]],
  ID: ["Idaho", [["Boise", 43.62, -116.2], ["Meridian", 43.61, -116.39], ["Nampa", 43.54, -116.56], ["Idaho Falls", 43.49, -112.03], ["Coeur d'Alene", 47.68, -116.78]]],
  IL: ["Illinois", [["Chicago", 41.88, -87.63], ["Aurora", 41.76, -88.32], ["Naperville", 41.75, -88.15], ["Springfield", 39.78, -89.65], ["Peoria", 40.69, -89.59]]],
  IN: ["Indiana", [["Indianapolis", 39.77, -86.16], ["Fort Wayne", 41.08, -85.14], ["Evansville", 37.97, -87.57], ["South Bend", 41.68, -86.25], ["Bloomington", 39.17, -86.53]]],
  IA: ["Iowa", [["Des Moines", 41.59, -93.62], ["Cedar Rapids", 41.98, -91.67], ["Davenport", 41.52, -90.58], ["Iowa City", 41.66, -91.53], ["Sioux City", 42.5, -96.4]]],
  KS: ["Kansas", [["Wichita", 37.69, -97.34], ["Overland Park", 38.98, -94.67], ["Kansas City", 39.11, -94.63], ["Topeka", 39.05, -95.68], ["Lawrence", 38.97, -95.24]]],
  KY: ["Kentucky", [["Louisville", 38.25, -85.76], ["Lexington", 38.04, -84.5], ["Bowling Green", 36.99, -86.44], ["Owensboro", 37.77, -87.11], ["Covington", 39.08, -84.51]]],
  LA: ["Louisiana", [["New Orleans", 29.95, -90.07], ["Baton Rouge", 30.45, -91.19], ["Shreveport", 32.53, -93.75], ["Lafayette", 30.22, -92.02], ["Lake Charles", 30.23, -93.22]]],
  ME: ["Maine", [["Portland", 43.66, -70.26], ["Lewiston", 44.1, -70.21], ["Bangor", 44.8, -68.77], ["South Portland", 43.64, -70.24], ["Augusta", 44.31, -69.78]]],
  MD: ["Maryland", [["Baltimore", 39.29, -76.61], ["Columbia", 39.2, -76.86], ["Silver Spring", 38.99, -77.03], ["Annapolis", 38.98, -76.49], ["Frederick", 39.41, -77.41]]],
  MA: ["Massachusetts", [["Boston", 42.36, -71.06], ["Worcester", 42.26, -71.8], ["Springfield", 42.1, -72.59], ["Cambridge", 42.37, -71.11], ["Lowell", 42.63, -71.32]]],
  MI: ["Michigan", [["Detroit", 42.33, -83.05], ["Grand Rapids", 42.96, -85.67], ["Ann Arbor", 42.28, -83.74], ["Lansing", 42.73, -84.56], ["Kalamazoo", 42.29, -85.59]]],
  MN: ["Minnesota", [["Minneapolis", 44.98, -93.27], ["St. Paul", 44.95, -93.09], ["Rochester", 44.02, -92.47], ["Duluth", 46.79, -92.1], ["Bloomington", 44.84, -93.3]]],
  MS: ["Mississippi", [["Jackson", 32.3, -90.18], ["Gulfport", 30.37, -89.09], ["Hattiesburg", 31.33, -89.29], ["Southaven", 34.99, -90.01], ["Biloxi", 30.4, -88.89]]],
  MO: ["Missouri", [["Kansas City", 39.1, -94.58], ["St. Louis", 38.63, -90.2], ["Springfield", 37.21, -93.29], ["Columbia", 38.95, -92.33], ["Independence", 39.09, -94.42]]],
  MT: ["Montana", [["Billings", 45.78, -108.5], ["Missoula", 46.87, -113.99], ["Bozeman", 45.68, -111.04], ["Great Falls", 47.5, -111.3], ["Helena", 46.59, -112.04]]],
  NE: ["Nebraska", [["Omaha", 41.26, -95.93], ["Lincoln", 40.81, -96.7], ["Bellevue", 41.14, -95.91], ["Grand Island", 40.92, -98.34], ["Kearney", 40.7, -99.08]]],
  NV: ["Nevada", [["Las Vegas", 36.17, -115.14], ["Henderson", 36.04, -114.98], ["Reno", 39.53, -119.81], ["North Las Vegas", 36.2, -115.12], ["Sparks", 39.53, -119.75]]],
  NH: ["New Hampshire", [["Manchester", 42.99, -71.46], ["Nashua", 42.77, -71.47], ["Concord", 43.21, -71.54], ["Portsmouth", 43.07, -70.76], ["Dover", 43.2, -70.87]]],
  NJ: ["New Jersey", [["Newark", 40.74, -74.17], ["Jersey City", 40.73, -74.08], ["Paterson", 40.92, -74.17], ["Trenton", 40.22, -74.76], ["New Brunswick", 40.49, -74.45]]],
  NM: ["New Mexico", [["Albuquerque", 35.08, -106.65], ["Santa Fe", 35.69, -105.94], ["Las Cruces", 32.32, -106.76], ["Rio Rancho", 35.23, -106.66], ["Roswell", 33.39, -104.52]]],
  NY: ["New York", [["New York City", 40.71, -74.01], ["Brooklyn", 40.68, -73.94], ["Buffalo", 42.89, -78.88], ["Rochester", 43.16, -77.61], ["Albany", 42.65, -73.76], ["Syracuse", 43.05, -76.15]]],
  NC: ["North Carolina", [["Charlotte", 35.227, -80.843], ["Raleigh", 35.78, -78.64], ["Durham", 35.99, -78.9], ["Greensboro", 36.07, -79.79], ["Fayetteville", 35.05, -78.88]]],
  ND: ["North Dakota", [["Fargo", 46.88, -96.79], ["Bismarck", 46.81, -100.78], ["Grand Forks", 47.93, -97.03], ["Minot", 48.23, -101.3]]],
  OH: ["Ohio", [["Columbus", 39.96, -83.0], ["Cleveland", 41.5, -81.69], ["Cincinnati", 39.1, -84.51], ["Toledo", 41.65, -83.54], ["Akron", 41.08, -81.52]]],
  OK: ["Oklahoma", [["Oklahoma City", 35.47, -97.52], ["Tulsa", 36.15, -95.99], ["Norman", 35.22, -97.44], ["Broken Arrow", 36.05, -95.79], ["Edmond", 35.65, -97.48]]],
  OR: ["Oregon", [["Portland", 45.52, -122.68], ["Eugene", 44.05, -123.09], ["Salem", 44.94, -123.04], ["Bend", 44.06, -121.32], ["Beaverton", 45.49, -122.8]]],
  PA: ["Pennsylvania", [["Philadelphia", 39.95, -75.17], ["Pittsburgh", 40.44, -80.0], ["Allentown", 40.61, -75.49], ["Harrisburg", 40.27, -76.88], ["Erie", 42.13, -80.09]]],
  RI: ["Rhode Island", [["Providence", 41.82, -71.41], ["Warwick", 41.7, -71.42], ["Cranston", 41.78, -71.44], ["Pawtucket", 41.88, -71.38], ["Newport", 41.49, -71.31]]],
  SC: ["South Carolina", [["Columbia", 34.0, -81.03], ["Charleston", 32.78, -79.93], ["Greenville", 34.85, -82.4], ["Rock Hill", 34.92, -81.03], ["Myrtle Beach", 33.69, -78.89]]],
  SD: ["South Dakota", [["Sioux Falls", 43.54, -96.73], ["Rapid City", 44.08, -103.23], ["Aberdeen", 45.46, -98.49], ["Brookings", 44.31, -96.8]]],
  TN: ["Tennessee", [["Nashville", 36.16, -86.78], ["Memphis", 35.15, -90.05], ["Knoxville", 35.96, -83.92], ["Chattanooga", 35.05, -85.31], ["Murfreesboro", 35.85, -86.39]]],
  TX: ["Texas", [["Houston", 29.76, -95.37], ["Dallas", 32.78, -96.8], ["Austin", 30.27, -97.74], ["San Antonio", 29.42, -98.49], ["Fort Worth", 32.76, -97.33]]],
  UT: ["Utah", [["Salt Lake City", 40.76, -111.89], ["Provo", 40.23, -111.66], ["Ogden", 41.22, -111.97], ["St. George", 37.1, -113.58], ["Sandy", 40.57, -111.86]]],
  VT: ["Vermont", [["Burlington", 44.48, -73.21], ["South Burlington", 44.47, -73.17], ["Rutland", 43.61, -72.97], ["Montpelier", 44.26, -72.58]]],
  VA: ["Virginia", [["Alexandria", 38.8, -77.05], ["Hampton", 37.03, -76.35], ["Norfolk", 36.85, -76.29], ["Richmond", 37.54, -77.44], ["Virginia Beach", 36.85, -75.98]]],
  WA: ["Washington", [["Seattle", 47.61, -122.33], ["Spokane", 47.66, -117.43], ["Tacoma", 47.25, -122.44], ["Bellevue", 47.61, -122.2], ["Vancouver", 45.64, -122.66]]],
  WV: ["West Virginia", [["Charleston", 38.35, -81.63], ["Huntington", 38.42, -82.45], ["Morgantown", 39.63, -79.96], ["Parkersburg", 39.27, -81.56], ["Wheeling", 40.06, -80.72]]],
  WI: ["Wisconsin", [["Milwaukee", 43.04, -87.91], ["Madison", 43.07, -89.4], ["Green Bay", 44.51, -88.01], ["Kenosha", 42.58, -87.82], ["Appleton", 44.26, -88.42]]],
  WY: ["Wyoming", [["Cheyenne", 41.14, -104.82], ["Casper", 42.87, -106.31], ["Laramie", 41.31, -105.59], ["Gillette", 44.29, -105.5], ["Rock Springs", 41.59, -109.2]]],
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const STATES: { code: string; name: string; cities: City[] }[] = Object.entries(S)
  .map(([code, [stateName, rows]]) => ({
    code,
    name: stateName,
    cities: rows.map(([name, lat, lng]) => ({ id: `${slug(name)}-${code.toLowerCase()}`, name, state: code, stateName, lat, lng })),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const ALL_CITIES: City[] = STATES.flatMap((s) => s.cities);
export const CHARLOTTE: City = ALL_CITIES.find((c) => c.id === "charlotte-nc")!;

export const cityLabel = (c: City) => (c.state === "DC" ? "Washington, DC" : `${c.name}, ${c.state}`);
export const findCity = (id: string | null | undefined): City | undefined => ALL_CITIES.find((c) => c.id === id);

/** Other listed cities within reach, closest first (crosses state lines). */
export function nearbyCities(city: City, max = 5, withinMiles = 150): { city: City; miles: number }[] {
  return ALL_CITIES.filter((c) => c.id !== city.id)
    .map((c) => ({ city: c, miles: milesBetween(city, c) }))
    .filter((x) => x.miles <= withinMiles)
    .sort((a, b) => a.miles - b.miles)
    .slice(0, max);
}

export function nearestCity(p: GeoPoint): City {
  return ALL_CITIES.reduce((best, c) => (milesBetween(p, c) < milesBetween(p, best) ? c : best), CHARLOTTE);
}

/** Sample listings and posts exist around Charlotte only, for now. */
export const SAMPLE_RADIUS_MILES = 45;
export const hasSampleData = (c: GeoPoint) => milesBetween(c, CHARLOTTE) <= SAMPLE_RADIUS_MILES;
