import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "VaxFact.net/1.0 (vaccine risk tool; contact@vaxfact.net)",
        "Accept-Language": "en",
      },
    });

    if (!res.ok) throw new Error(`Nominatim returned ${res.status}`);

    const results = await res.json();

    const locations = results.map((r: Record<string, unknown>) => {
      const addr = (r.address || {}) as Record<string, string>;
      const country = addr.country || "";
      const countryCode = (addr.country_code || "").toUpperCase();
      const stateOrRegion =
        addr.state ||
        addr.province ||
        addr.region ||
        addr.county ||
        "";

      return {
        displayName: r.display_name,
        country,
        countryCode,
        stateOrRegion: stateOrRegion.toUpperCase(),
        lat: parseFloat(r.lat as string),
        lng: parseFloat(r.lon as string),
        isUS: countryCode === "US",
        placeType: r.type,
        importance: r.importance,
      };
    });

    return NextResponse.json({ locations });
  } catch (err) {
    console.error("Geocode error:", err);
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}