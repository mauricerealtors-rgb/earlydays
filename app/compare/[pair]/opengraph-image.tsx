import { ImageResponse } from "next/og";
import { findPair } from "@/lib/comparisons";
import { findLocation } from "@/data/locations";

export const alt = "EarlyDays school vs school";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const p = findPair(pair);
  const a = p?.a;
  const b = p?.b;
  const locA = a ? findLocation(a.neighbourhood)?.name ?? "" : "";
  const locB = b ? findLocation(b.neighbourhood)?.name ?? "" : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "sans-serif",
          background: "#FFF8EF",
        }}
      >
        {/* Left half */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 48px",
            background:
              "linear-gradient(180deg, #DDEEFF 0%, #FFF8EF 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px 16px",
              borderRadius: 999,
              background: "#1F7AD6",
              color: "white",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              alignSelf: "flex-start",
            }}
          >
            {locA || "School A"}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 60,
              lineHeight: 1.05,
              fontWeight: 800,
              color: "#0F2A4A",
              letterSpacing: -1,
            }}
          >
            {a?.name ?? "School A"}
          </div>
        </div>

        {/* Center "vs" pill */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            width: 140,
            height: 140,
            borderRadius: 999,
            background: "#0F2A4A",
            color: "white",
            fontSize: 54,
            fontWeight: 800,
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 60px rgba(15,42,74,0.3)",
            letterSpacing: -1,
          }}
        >
          VS
        </div>

        {/* Right half */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 48px",
            background:
              "linear-gradient(180deg, #FFDED2 0%, #FFF8EF 100%)",
            textAlign: "right",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px 16px",
              borderRadius: 999,
              background: "#FF7A59",
              color: "white",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              alignSelf: "flex-end",
            }}
          >
            {locB || "School B"}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontSize: 60,
              lineHeight: 1.05,
              fontWeight: 800,
              color: "#0F2A4A",
              letterSpacing: -1,
            }}
          >
            {b?.name ?? "School B"}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 48px",
            background: "#0F2A4A",
            color: "white",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex" }}>
            Which would you choose?
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
