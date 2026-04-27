"use client";

const steps = ["Fill form", "Coordinator", "Admin", "Activate"];

export default function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ padding: "0.5rem 0 0.25rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {steps.map((label, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute",
                  top: 14,
                  left: "50%",
                  width: "100%",
                  height: 2,
                  background: isCompleted ? "#1D9E75" : "#E5E7EB",
                  zIndex: 0,
                }} />
              )}

              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 500,
                position: "relative",
                zIndex: 1,
                border: `2px solid ${isCompleted || isActive ? "#1D9E75" : "#E5E7EB"}`,
                background: isCompleted ? "#1D9E75" : "#fff",
                color: isCompleted ? "#fff" : isActive ? "#1D9E75" : "#9CA3AF",
                transition: "all 0.3s",
              }}>
                {isCompleted ? "✓" : i + 1}
              </div>

              <span style={{
                marginTop: 6,
                fontSize: 11,
                fontWeight: isActive ? 500 : 400,
                color: isCompleted || isActive ? "#0F6E56" : "#9CA3AF",
                textAlign: "center",
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <p style={{
        textAlign: "center",
        fontSize: 12,
        color: "#6B7280",
        margin: "0.75rem 0 0",
      }}>
        {currentStep === 0 && "Step 1 of 4 — Fill in your registration form"}
        {currentStep === 1 && "Step 2 of 4 — Awaiting coordinator review"}
        {currentStep === 2 && "Step 3 of 4 — Awaiting admin approval"}
        {currentStep === 3 && "Step 4 of 4 — Account activation"}
      </p>
    </div>
  );
}