import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";
import { MARK_DATA_URI } from "@/lib/brand";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(1000px 500px at 100% 0%, #DDEEFF, transparent 60%), radial-gradient(900px 500px at 0% 100%, #FFE4EF, transparent 60%), #FFF8EF",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src={MARK_DATA_URI}
            alt=""
            width={64}
            height={64}
            style={{ width: 64, height: 64 }}
          />
          <div style={{ display: "flex", fontSize: 32, fontWeight: 800, color: "#0F2A4A" }}>
            Early<span style={{ color: "#FF7A59" }}>Days</span>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              padding: "10px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.7)",
              border: "1px solid #E8DECF",
              fontSize: 20,
              fontWeight: 700,
              color: "#0F2A4A",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {SITE.domain}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            fontSize: 88,
            lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: -1.5,
            color: "#0F2A4A",
          }}
        >
          <span style={{ color: "#1F7AD6" }}>Find your child</span>
          <span style={{ color: "#FF7A59" }}>a place</span>
          <span style={{ color: "#2F7C25" }}>to grow,</span>
          <span style={{ color: "#EC1E7A" }}>play</span>
          <span style={{ color: "#0F2A4A" }}>and</span>
          <span style={{ color: "#E5A800" }}>learn.</span>
        </div>

        {/* Foot line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#5A6B82",
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex" }}>
            Creches · Preschools · KG · Primary · Learning centres · Ghana
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
