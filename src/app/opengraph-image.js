import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HiredUp.me - Find Jobs in Bangladesh & Remote Worldwide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            backgroundColor: "white",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20,
            fontSize: 48,
          }}
        >
          🚀
        </div>
        <span
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "white",
          }}
        >
          HiredUp.me
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 42,
          color: "white",
          textAlign: "center",
          marginBottom: 20,
          fontWeight: 600,
        }}
      >
        Get hired up, not just hired.
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.9)",
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        Find 10,000+ Jobs in Bangladesh & Remote Worldwide
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          marginTop: 50,
          gap: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
          }}
        >
          <span style={{ fontSize: 48, fontWeight: "bold" }}>10K+</span>
          <span style={{ fontSize: 20, opacity: 0.9 }}>Jobs</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
          }}
        >
          <span style={{ fontSize: 48, fontWeight: "bold" }}>500+</span>
          <span style={{ fontSize: 20, opacity: 0.9 }}>Companies</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
          }}
        >
          <span style={{ fontSize: 48, fontWeight: "bold" }}>50K+</span>
          <span style={{ fontSize: 20, opacity: 0.9 }}>Job Seekers</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
