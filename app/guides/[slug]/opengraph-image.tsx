import { ImageResponse } from "next/og";
import { findGuide } from "@/data/guides";

export const alt = "EarlyDays parent guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = findGuide(slug);
  const title = g?.title ?? "Parent guide";
  const tag = g?.tag ?? "Guide";
  const minutes = g?.readingMinutes ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 64px",
          background:
            "radial-gradient(1000px 500px at 0% 0%, #FFE4EF, transparent 60%), radial-gradient(700px 400px at 100% 100%, #E4F5DF, transparent 60%), #FFF8EF",
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
                width: 48,
                height: 48,
                borderRadius: 14,
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
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: 999,
              background: "#FFF1CB",
              color: "#7A5A00",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {tag}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 62,
            lineHeight: 1.08,
            fontWeight: 800,
            color: "#0F2A4A",
            letterSpacing: -1.2,
            maxWidth: "94%",
          }}
        >
          {title}
        </div>

        {/* Foot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            fontWeight: 700,
            color: "#5A6B82",
          }}
        >
          <div style={{ display: "flex" }}>
            {minutes ? `${minutes} min read · Parent guide` : "Parent guide"}
          </div>
          <div style={{ display: "flex", letterSpacing: 2, color: "#0F2A4A" }}>
            EARLYDAYS.CC
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
