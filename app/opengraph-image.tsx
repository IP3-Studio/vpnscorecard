import { ImageResponse } from "next/og";

export const alt = "VPN Scorecard: independent, non-commercial VPN comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090b",
          color: "#fafafa",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 12,
              background: "#10b981",
              color: "#ffffff",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            VS
          </div>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 700 }}>
            <span>VPN</span>
            <span style={{ color: "#10b981" }}>Scorecard</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1 }}>
            Which VPN actually protects your privacy?
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#a1a1aa", marginTop: 24, maxWidth: 960 }}>
            Independent, non-commercial scoring on privacy, audits, jurisdiction
            and value. No affiliate links.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#71717a" }}>
          vpnscorecard.com · a project of IP3 Studio
        </div>
      </div>
    ),
    { ...size },
  );
}
