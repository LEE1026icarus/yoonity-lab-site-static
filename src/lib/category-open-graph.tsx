import { ImageResponse } from "next/og";

export const CATEGORY_OPEN_GRAPH_SIZE = { width: 1200, height: 630 };

type CategoryTheme = {
  label: string;
  title: string;
  description: string;
  accent: string;
};

export function createCategoryOpenGraphImage(theme: CategoryTheme) {
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
        borderTop: `18px solid ${theme.accent}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
        <span style={{ fontWeight: 800 }}>YOONITY LAB</span>
        <span style={{ color: theme.accent, fontWeight: 700 }}>{theme.label}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.08 }}>
          {theme.title}
        </div>
        <div style={{ display: "flex", marginTop: 30, fontSize: 29, color: "#62616b" }}>
          {theme.description}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: theme.accent }}>
        DONGGUK UNIVERSITY · MANAGEMENT INFORMATION SYSTEMS
      </div>
    </div>,
    CATEGORY_OPEN_GRAPH_SIZE,
  );
}
