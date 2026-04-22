/**
 * Binderbyte API Service Layer
 * Centralized helper for all Binderbyte shipping API interactions.
 */

const BINDERBYTE_API_KEY = process.env.BINDERBYTE_API_KEY || "";
const BASE_URL = "https://api.binderbyte.com";

export const COURIERS = [
  { id: "jne", name: "JNE" },
  { id: "jnt", name: "J&T" },
];

// --- Types ---

export interface Province {
  id: string;
  name: string;
}

export interface City {
  id: string;
  id_provinsi: string;
  name: string;
}

export interface Kecamatan {
  id: string;
  id_kabupaten: string;
  name: string;
}

export interface Courier {
  code: string;
  description: string;
}

export interface ShippingCostService {
  service: string;
  description: string;
  cost: number;
  etd: string; // estimated days
}

export interface ShippingCostResult {
  origin: string;
  destination: string;
  courier: string;
  services: ShippingCostService[];
}

export interface TrackingHistory {
  date: string;
  desc: string;
  location: string;
}

export interface TrackingResult {
  summary: {
    awb: string;
    courier: string;
    service: string;
    status: string;
    date: string;
    desc: string;
    amount: string;
    weight: string;
  };
  detail: {
    origin: string;
    destination: string;
    shipper: string;
    receiver: string;
  };
  history: TrackingHistory[];
}

// --- API Functions ---

/**
 * Get list of all provinces
 */
export async function getProvinces(): Promise<Province[]> {
  const res = await fetch(
    `${BASE_URL}/wilayah/provinsi?api_key=${BINDERBYTE_API_KEY}`,
    { next: { revalidate: 86400 } } // cache for 24 hours
  );
  const data = await res.json();
  if (data.code !== "200") throw new Error(data.messages || "Failed to fetch provinces");
  return data.value;
}

/**
 * Get list of cities/kabupaten by province ID
 */
export async function getCities(provinceId: string): Promise<City[]> {
  const res = await fetch(
    `${BASE_URL}/wilayah/kabupaten?api_key=${BINDERBYTE_API_KEY}&id_provinsi=${provinceId}`,
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();
  if (data.code !== "200") throw new Error(data.messages || "Failed to fetch cities");
  return data.value;
}

/**
 * Get list of kecamatan by kabupaten ID
 */
export async function getKecamatan(kabupatenId: string): Promise<Kecamatan[]> {
  const res = await fetch(
    `${BASE_URL}/wilayah/kecamatan?api_key=${BINDERBYTE_API_KEY}&id_kabupaten=${kabupatenId}`,
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();
  if (data.code !== "200") throw new Error(data.messages || "Failed to fetch kecamatan");
  return data.value;
}

/**
 * Get list of supported couriers
 */
export async function getCouriers(): Promise<Courier[]> {
  const res = await fetch(
    `${BASE_URL}/v1/list_courier?api_key=${BINDERBYTE_API_KEY}`,
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();
  // list_courier returns array directly
  if (Array.isArray(data)) return data;
  throw new Error("Failed to fetch courier list");
}

/**
 * Calculate shipping cost
 */
export async function getShippingCost(
  origin: string,
  destination: string,
  weight: number,
  courier: string
): Promise<any> {
  const params = new URLSearchParams({
    api_key: BINDERBYTE_API_KEY,
    courier,
    origin,
    destination,
    weight: String(weight),
    volume: "",
  });

  const res = await fetch(`${BASE_URL}/v1/cost`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await res.json();
  return data;
}

/**
 * Track a package by AWB number
 */
export async function trackPackage(
  awb: string,
  courier: string
): Promise<TrackingResult> {
  const res = await fetch(
    `${BASE_URL}/v1/track?api_key=${BINDERBYTE_API_KEY}&courier=${courier}&awb=${awb}`
  );
  const data = await res.json();

  if (data.status !== 200) {
    throw new Error(data.message || "Failed to track package");
  }

  return data.data;
}
