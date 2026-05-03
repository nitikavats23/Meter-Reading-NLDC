"use client";

const steps = ["Fill form", "Coordinator", "Admin", "Activate"];

export default function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ padding: "0.75rem 1rem 0.5rem" }}>
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
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute",
                  top: 16,
                  left: "50%",
                  width: "100%",
                  height: 2,
                  background: isCompleted ? "#1D4ED8" : "#E2E8F0",
                  zIndex: 0,
                  transition: "background 0.3s",
                }} />
              )}

              {/* Step circle */}
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                position: "relative",
                zIndex: 1,
                border: `2px solid ${isCompleted ? "#1D4ED8" : isActive ? "#1D4ED8" : "#CBD5E1"}`,
                background: isCompleted ? "#1D4ED8" : isActive ? "#EFF6FF" : "#F8FAFC",
                color: isCompleted ? "#fff" : isActive ? "#1D4ED8" : "#94A3B8",
                transition: "all 0.3s",
                boxShadow: isActive ? "0 0 0 4px #DBEAFE" : "none",
              }}>
                {isCompleted ? (
                  <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>

              {/* Step label */}
              <span style={{
                marginTop: 8,
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                color: isCompleted ? "#1D4ED8" : isActive ? "#1E3A5F" : "#94A3B8",
                textAlign: "center",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step description */}
      <div style={{
        marginTop: 16,
        textAlign: "center",
        fontSize: 12,
        fontWeight: 500,
        color: "#64748B",
        borderTop: "1px solid #F1F5F9",
        paddingTop: 12,
        letterSpacing: "0.01em",
      }}>
        {currentStep === 0 && "Step 1 of 4 — Fill in your registration form"}
        {currentStep === 1 && "Step 2 of 4 — Awaiting coordinator review"}
        {currentStep === 2 && "Step 3 of 4 — Awaiting admin approval"}
        {currentStep === 3 && "Step 4 of 4 — Account activation"}
      </div>
    </div>
  );
}