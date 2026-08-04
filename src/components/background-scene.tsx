export function BackgroundScene() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 60% at 68% 42%, color-mix(in srgb, var(--axis-ai) 11%, transparent), color-mix(in srgb, var(--axis-quantum) 5%, transparent) 48%, transparent 78%)",
        }}
      />
    </div>
  );
}
