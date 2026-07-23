import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFF8F6, #FBE4E8)",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700, color: "#A52C50", marginBottom: 24 }}>{site.brand}</div>
        <div style={{ fontSize: 56, fontWeight: 800, color: "#2B1B24", textAlign: "center", lineHeight: 1.2 }}>
          {site.productName}
        </div>
        <div style={{ fontSize: 28, color: "#6B4F5C", marginTop: 24 }}>{site.productTagline}</div>
      </div>
    ),
    size
  );
}
