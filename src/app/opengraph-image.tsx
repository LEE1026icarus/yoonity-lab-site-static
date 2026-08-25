import { ImageResponse } from "next/og";

export const alt = "Yoonity Lab — 산업 문제 해결형 AI 연구실";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f5f3ed",
        color: "#121216",
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 24,
          letterSpacing: 1.5,
        }}
      >
        <span style={{ fontWeight: 800 }}>YOONITY LAB</span>
        <span style={{ color: "#62616b" }}>DONGGUK UNIVERSITY</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            maxWidth: 930,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -2,
          }}
        >
          From complex decisions to verifiable solutions.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 27,
            color: "#62616b",
          }}
        >
          Industry problem-solving AI &amp; Information Systems Lab
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, fontSize: 22, fontWeight: 700 }}>
        <span style={{ color: "#1668e3" }}>AI</span>
        <span style={{ color: "#a238c5" }}>Generative AI</span>
        <span style={{ color: "#d25827" }}>Quantum Computing</span>
      </div>
    </div>,
    size,
  );
}
