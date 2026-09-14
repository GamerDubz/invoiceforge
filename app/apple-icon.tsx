import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f1e6",
        }}
      >
        <div
          style={{
            width: 156,
            height: 156,
            borderRadius: "50%",
            background: "#7a2331",
            border: "5px solid #c9a24a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 78,
              height: 88,
              background: "#f6f1e6",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              transform: "rotate(-8deg)",
            }}
          >
            <div style={{ width: 52, height: 7, background: "#1c1d2b", borderRadius: 2, display: "flex" }} />
            <div style={{ width: 34, height: 7, background: "#1c1d2b", opacity: 0.55, borderRadius: 2, display: "flex" }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
