

"use client";

const steps = ["Submitted", "Coordinator", "Admin", "Activation"];

export default function ProgressBar({ currentStep }: { currentStep: number }) {
  const navyBlue = "#1E3A8A";
  const lightBlueBg = "#EFF6FF";
  const greyLine = "#E2E8F0";

  return (
    // Minimum vertical padding (4px top/bottom)
    <div style={{ padding: "4px 8px", backgroundColor: "#fff", borderRadius: "8px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", maxWidth: "800px", margin: "0 auto" }}>
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
              {/* Ultra sleek connector line */}
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute",
                  top: 11, // Centered for 22px circle
                  left: "50%",
                  width: "100%",
                  height: 1.5,
                  background: i < currentStep ? navyBlue : greyLine,
                  zIndex: 0,
                }} />
              )}

              {/* Tiny Step circle (22px) */}
              <div style={{
                width: 22, 
                height: 22,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 800,
                position: "relative",
                zIndex: 1,
                background: isCompleted || isActive ? navyBlue : "#fff",
                border: `1.5px solid ${isCompleted || isActive ? navyBlue : "#CBD5E1"}`,
                color: isCompleted || isActive ? "#fff" : "#94A3B8",
                boxShadow: isActive ? `0 0 0 3px ${lightBlueBg}` : "none",
              }}>
                {isCompleted ? (
                  <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>

              {/* Minimalist Label */}
              <span style={{
                marginTop: 4,
                fontSize: "10px",
                fontWeight: isActive || isCompleted ? 700 : 500,
                color: isActive || isCompleted ? navyBlue : "#64748B",
                textAlign: "center",
                lineHeight: 1,
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tight Description */}
      <div style={{
        marginTop: 8,
        textAlign: "center",
        fontSize: "11px",
        fontWeight: 600,
        color: "#64748B",
      }}>
        {currentStep === 0 && "Step 1: Submitted"}
        {currentStep === 1 && "Step 2: Reviewing"}
        {currentStep === 2 && "Step 3: Approving"}
        {currentStep === 3 && "Step 4: Activating"}
      </div>
    </div>
  );
}