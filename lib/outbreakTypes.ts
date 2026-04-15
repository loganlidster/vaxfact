// Outbreak data types for WHO + CDC integration

export interface WHOOutbreakItem {
  id: string;
  title: string;
  publicationDate: string;
  country: string;
  region: string;
  summary: string;
  url: string;
  diseaseKey: string | null; // mapped to VaxFact vaccine id if applicable
  lat?: number;
  lng?: number;
}

export interface CDCStateData {
  state: string;
  stateCode: string;
  lat: number;
  lng: number;
  diseases: {
    [diseaseKey: string]: {
      label: string;
      casesThisYear: number;
      casesPriorYear: number;
      trend: "rising" | "falling" | "stable";
      weeklyData: { week: number; cases: number }[];
    };
  };
}

export interface TravelLocation {
  label: string; // "Home", "Family", "Destination"
  query: string; // user-entered search text
  displayName: string; // resolved place name
  country: string;
  countryCode: string;
  stateOrRegion: string;
  lat: number;
  lng: number;
  isUS: boolean;
}

export interface LocationRisk {
  location: TravelLocation;
  risksByVaccine: {
    [vaccineId: string]: {
      vaccineName: string;
      riskLevel: "very-low" | "low" | "moderate" | "high" | "very-high";
      riskScore: number; // 0-100
      activeOutbreak: boolean;
      outbreakTitle?: string;
      casesNearby?: number;
      multiplierApplied: number; // how much this changes base exposure risk
    };
  };
  overallRiskLevel: "very-low" | "low" | "moderate" | "high" | "very-high";
}

export interface OutbreakMapData {
  whoOutbreaks: WHOOutbreakItem[];
  cdcStateData: CDCStateData[];
  lastUpdated: string;
}

// Maps WHO outbreak titles to VaxFact vaccine IDs
export const DISEASE_VACCINE_MAP: { [keyword: string]: string } = {
  measles: "mmr",
  "rubella": "mmr",
  "mumps": "mmr",
  pertussis: "dtap",
  "whooping cough": "dtap",
  diphtheria: "dtap",
  tetanus: "dtap",
  "hepatitis b": "hepb",
  "hepatitis a": "hepa",
  meningococ: "menacwy",
  polio: "ipv",
  "h. influenzae": "hib",
  "haemophilus": "hib",
  rotavirus: "rotavirus",
  varicella: "varicella",
  chickenpox: "varicella",
  influenza: "flu",
  mpox: "mpox",
  "yellow fever": "yellowfever",
  dengue: "dengue",
  typhoid: "typhoid",
};

// US State coordinates
export const US_STATE_COORDS: { [state: string]: { lat: number; lng: number; code: string } } = {
  "ALABAMA": { lat: 32.806671, lng: -86.791130, code: "AL" },
  "ALASKA": { lat: 61.370716, lng: -152.404419, code: "AK" },
  "ARIZONA": { lat: 33.729759, lng: -111.431221, code: "AZ" },
  "ARKANSAS": { lat: 34.969704, lng: -92.373123, code: "AR" },
  "CALIFORNIA": { lat: 36.116203, lng: -119.681564, code: "CA" },
  "COLORADO": { lat: 39.059811, lng: -105.311104, code: "CO" },
  "CONNECTICUT": { lat: 41.597782, lng: -72.755371, code: "CT" },
  "DELAWARE": { lat: 39.318523, lng: -75.507141, code: "DE" },
  "FLORIDA": { lat: 27.766279, lng: -81.686783, code: "FL" },
  "GEORGIA": { lat: 33.040619, lng: -83.643074, code: "GA" },
  "HAWAII": { lat: 21.094318, lng: -157.498337, code: "HI" },
  "IDAHO": { lat: 44.240459, lng: -114.478828, code: "ID" },
  "ILLINOIS": { lat: 40.349457, lng: -88.986137, code: "IL" },
  "INDIANA": { lat: 39.849426, lng: -86.258278, code: "IN" },
  "IOWA": { lat: 42.011539, lng: -93.210526, code: "IA" },
  "KANSAS": { lat: 38.526600, lng: -96.726486, code: "KS" },
  "KENTUCKY": { lat: 37.668140, lng: -84.670067, code: "KY" },
  "LOUISIANA": { lat: 31.169960, lng: -91.867805, code: "LA" },
  "MAINE": { lat: 44.693947, lng: -69.381927, code: "ME" },
  "MARYLAND": { lat: 39.063946, lng: -76.802101, code: "MD" },
  "MASSACHUSETTS": { lat: 42.230171, lng: -71.530106, code: "MA" },
  "MICHIGAN": { lat: 43.326618, lng: -84.536095, code: "MI" },
  "MINNESOTA": { lat: 45.694454, lng: -93.900192, code: "MN" },
  "MISSISSIPPI": { lat: 32.741646, lng: -89.678696, code: "MS" },
  "MISSOURI": { lat: 38.456085, lng: -92.288368, code: "MO" },
  "MONTANA": { lat: 46.921925, lng: -110.454353, code: "MT" },
  "NEBRASKA": { lat: 41.125370, lng: -98.268082, code: "NE" },
  "NEVADA": { lat: 38.313515, lng: -117.055374, code: "NV" },
  "NEW HAMPSHIRE": { lat: 43.452492, lng: -71.563896, code: "NH" },
  "NEW JERSEY": { lat: 40.298904, lng: -74.521011, code: "NJ" },
  "NEW MEXICO": { lat: 34.840515, lng: -106.248482, code: "NM" },
  "NEW YORK": { lat: 42.165726, lng: -74.948051, code: "NY" },
  "NORTH CAROLINA": { lat: 35.630066, lng: -79.806419, code: "NC" },
  "NORTH DAKOTA": { lat: 47.528912, lng: -99.784012, code: "ND" },
  "OHIO": { lat: 40.388783, lng: -82.764915, code: "OH" },
  "OKLAHOMA": { lat: 35.565342, lng: -96.928917, code: "OK" },
  "OREGON": { lat: 44.572021, lng: -122.070938, code: "OR" },
  "PENNSYLVANIA": { lat: 40.590752, lng: -77.209755, code: "PA" },
  "RHODE ISLAND": { lat: 41.680893, lng: -71.511780, code: "RI" },
  "SOUTH CAROLINA": { lat: 33.856892, lng: -80.945007, code: "SC" },
  "SOUTH DAKOTA": { lat: 44.299782, lng: -99.438828, code: "SD" },
  "TENNESSEE": { lat: 35.747845, lng: -86.692345, code: "TN" },
  "TEXAS": { lat: 31.054487, lng: -97.563461, code: "TX" },
  "UTAH": { lat: 40.150032, lng: -111.862434, code: "UT" },
  "VERMONT": { lat: 44.045876, lng: -72.710686, code: "VT" },
  "VIRGINIA": { lat: 37.769337, lng: -78.169968, code: "VA" },
  "WASHINGTON": { lat: 47.400902, lng: -121.490494, code: "WA" },
  "WEST VIRGINIA": { lat: 38.491226, lng: -80.954453, code: "WV" },
  "WISCONSIN": { lat: 44.268543, lng: -89.616508, code: "WI" },
  "WYOMING": { lat: 42.755966, lng: -107.302490, code: "WY" },
  "DISTRICT OF COLUMBIA": { lat: 38.897438, lng: -77.026817, code: "DC" },
};

// Country coordinates for WHO outbreak mapping
export const COUNTRY_COORDS: { [country: string]: { lat: number; lng: number } } = {
  "Bangladesh": { lat: 23.685, lng: 90.356 },
  "India": { lat: 20.594, lng: 78.963 },
  "Ethiopia": { lat: 9.145, lng: 40.490 },
  "Nigeria": { lat: 9.082, lng: 8.676 },
  "Congo": { lat: -4.038, lng: 21.759 },
  "Pakistan": { lat: 30.376, lng: 69.345 },
  "Afghanistan": { lat: 33.934, lng: 67.710 },
  "Egypt": { lat: 26.820, lng: 30.802 },
  "Brazil": { lat: -14.235, lng: -51.925 },
  "Mexico": { lat: 23.634, lng: -102.553 },
  "Indonesia": { lat: -0.789, lng: 113.922 },
  "China": { lat: 35.862, lng: 104.195 },
  "Philippines": { lat: 12.880, lng: 121.774 },
  "Vietnam": { lat: 14.058, lng: 108.278 },
  "Thailand": { lat: 15.870, lng: 100.993 },
  "Cambodia": { lat: 12.565, lng: 104.991 },
  "Myanmar": { lat: 21.914, lng: 95.956 },
  "Uganda": { lat: 1.373, lng: 32.291 },
  "Kenya": { lat: -0.023, lng: 37.906 },
  "Tanzania": { lat: -6.369, lng: 34.889 },
  "Mozambique": { lat: -18.665, lng: 35.530 },
  "Zimbabwe": { lat: -19.015, lng: 29.155 },
  "South Africa": { lat: -30.560, lng: 22.938 },
  "Ghana": { lat: 7.946, lng: -1.023 },
  "Senegal": { lat: 14.497, lng: -14.452 },
  "Sudan": { lat: 12.863, lng: 30.218 },
  "Somalia": { lat: 5.152, lng: 46.200 },
  "Yemen": { lat: 15.553, lng: 48.516 },
  "Iraq": { lat: 33.224, lng: 43.679 },
  "Syria": { lat: 34.802, lng: 38.997 },
  "Lebanon": { lat: 33.854, lng: 35.862 },
  "Jordan": { lat: 30.586, lng: 36.239 },
  "Saudi Arabia": { lat: 23.886, lng: 45.079 },
  "United States": { lat: 37.09, lng: -95.713 },
  "United Kingdom": { lat: 55.378, lng: -3.436 },
  "France": { lat: 46.228, lng: 2.214 },
  "Germany": { lat: 51.166, lng: 10.452 },
  "Italy": { lat: 41.872, lng: 12.568 },
  "Spain": { lat: 40.464, lng: -3.750 },
};