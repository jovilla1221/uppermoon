/**
 * Binderbyte API Service Layer
 * Centralized helper for all Binderbyte shipping API interactions.
 */

const BINDERBYTE_API_KEY = process.env.BINDERBYTE_API_KEY || "";
const BASE_URL = "https://api.binderbyte.com";

export const COURIERS = [
  { id: "jne", name: "JNE" },
  { id: "sicepat", name: "SiCepat" },
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
  const normalizedCourier = normalizeCourierCode(courier);
  const params = new URLSearchParams({
    api_key: BINDERBYTE_API_KEY,
    courier: normalizedCourier,
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
 * Normalizes a courier name to the slug expected by Binderbyte
 */
export function normalizeCourierCode(name: string): string {
  if (!name) return "sicepat";
  const n = name.toLowerCase().trim();
  
  if (n.includes("sicepat") || n.includes("si cepat")) return "sicepat";
  if (n.includes("jne")) return "jne";
  if (n.includes("j&t") || n.includes("jnt")) return "jnt";
  if (n.includes("pos")) return "pos";
  if (n.includes("tiki")) return "tiki";
  if (n.includes("wahana")) return "wahana";
  if (n.includes("anteraja")) return "anteraja";
  if (n.includes("ninja")) return "ninja";
  if (n.includes("lion")) return "lion";
  if (n.includes("sap")) return "sap";
  if (n.includes("ncs")) return "ncs";
  if (n.includes("sentral")) return "sentral";
  if (n.includes("rex")) return "rex";
  if (n.includes("rpx")) return "rpx";
  if (n.includes("ide")) return "ide";

  return n; // fallback to lowercase string
}

export const UPPERMOON_DEMO_AWB = "UPPERMOON-DEMO";

const MOCK_TRACKING_DATA: TrackingResult = {
  summary: {
    awb: UPPERMOON_DEMO_AWB,
    courier: "SiCepat",
    service: "SIUNT",
    status: "DELIVERED",
    date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
    desc: "Paket telah diterima oleh [Jimmy]",
    amount: "Rp 15.000",
    weight: "1 Kg",
  },
  detail: {
    origin: "BLITAR",
    destination: "JAKARTA",
    shipper: "UPPERMOON OFFICIAL",
    receiver: "CUSTOMER",
  },
  history: [
    {
      date: new Date().toISOString().split('T')[0] + " 14:20",
      desc: "PAKET DITERIMA OLEH [JIMMY (YBS)]",
      location: "JAKARTA SELATAN"
    },
    {
      date: new Date().toISOString().split('T')[0] + " 09:15",
      desc: "PAKET DIBAWA OLEH SIGESIT (COURIER ON DELIVERY)",
      location: "JAKARTA SELATAN"
    },
    {
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0] + " 21:30",
      desc: "PAKET TELAH SAMPAI DI HUB JAKARTA SELATAN",
      location: "JAKARTA SELATAN"
    },
    {
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0] + " 08:00",
      desc: "PAKET KELUAR DARI HUB SURABAYA",
      location: "SURABAYA"
    },
    {
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0] + " 16:45",
      desc: "PAKET TELAH DI-PICKUP OLEH KURIR",
      location: "BLITAR"
    }
  ]
};

/**
 * Track a package by AWB number
 */
export async function trackPackage(
  awb: string,
  courier: string
): Promise<TrackingResult> {
  // SEPARATION LOGIC: Check for Demo Code first
  if (awb === UPPERMOON_DEMO_AWB) {
    console.log("[LOGISTICS] Demo Tracking Mode Activated for", awb);
    return MOCK_TRACKING_DATA;
  }

  const normalizedCourier = normalizeCourierCode(courier);
  const res = await fetch(
    `${BASE_URL}/v1/track?api_key=${BINDERBYTE_API_KEY}&courier=${normalizedCourier}&awb=${awb}`
  );
  
  // Handle empty or error responses from fetch
  if (!res.ok) {
    throw new Error(`Tracking service returned error status: ${res.status}`);
  }

  const data = await res.json();

  if (data.status !== 200) {
    // If Binderbyte specifically says not found, provide a better error
    if (data.status === 400 && data.message?.toLowerCase().includes("not match")) {
      throw new Error(`Package not found for courier ${normalizedCourier.toUpperCase()}. Please check your receipt number.`);
    }
    throw new Error(data.message || "Failed to track package");
  }

  return data.data;
}


