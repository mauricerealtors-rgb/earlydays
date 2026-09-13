import { ImageResponse } from "next/og";
import { findListing } from "@/lib/query";
import { findLocation } from "@/data/locations";
import { findCategoryByType } from "@/data/categories";

export const alt = "EarlyDays school listing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const l = findListing(slug);
  if (!l) return fallback();

  const loc = findLocation(l.neighbourhood);
  const cat = findCategoryByType(l.listingTypes[0]);
  const verified =
    l.verification === "verified" || l.verification === "info-confirmed";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "radial-gradient(900px 500px at 100% 0%, #DDEEFF, transparent 65%), radial-gradient(700px 400px at 0% 100%, #FFE4EF, transparent 65%), #FFF8EF",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, #FFC845 0%, #FF7A59 55%, #FF9FC0 100%)",
                display: "flex",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 800,
                color: "#0F2A4A",
              }}
            >
              Early<span style={{ color: "#FF7A59" }}>Days</span>
            </div>
          </div>
          {verified && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 18px",
                borderRadius: 999,
                background: "#E4F5DF",
                color: "#2F7C25",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              ✓ Info confirmed
            </div>
          )}
        </div>

        {/* Category chip */}
        <div
          style={{
            display: "flex",
            padding: "10px 18px",
            borderRadius: 999,
            background: "#DDEEFF",
            color: "#1F7AD6",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            alignSelf: "flex-start",
            marginTop: 40,
          }}
        >
          {cat?.singular ?? "School"}
          {loc?.name ? ` · ${loc.name}` : ""}
        </div>

        {/* Name */}
        <div
          style={{
            display: "flex",
            fontSize: 76,
            lineHeight: 1.02,
            fontWeight: 800,
            color: "#0F2A4A",
            letterSpacing: -1.5,
            marginTop: 12,
            maxWidth: "88%",
          }}
        >
          {l.name}
        </div>

        {/* Age blurb */}
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 600,
            color: "#5A6B82",
            marginTop: 8,
          }}
        >
          {l.ageBlurb}
          {l.curriculum.length ? ` · ${l.curriculum.join(", ")}` : ""}
        </div>

        {/* Foot bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            background: "#0F2A4A",
            color: "white",
            borderRadius: 16,
            fontSize: 22,
            fontWeight: 700,
            marginTop: 20,
          }}
        >
          <div style={{ display: "flex" }}>
            See photos, fees and enquire
          </div>
          <div style={{ display: "flex", letterSpacing: 2 }}>
            EARLYDAYS.CC
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

function fallback() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFF8EF",
          fontSize: 64,
          fontWeight: 800,
          color: "#0F2A4A",
          fontFamily: "sans-serif",
        }}
      >
        EarlyDays
      </div>
    ),
    { ...size },
  );
}
