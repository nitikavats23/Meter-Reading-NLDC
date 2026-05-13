// 

"use client";

const steps = ["Submitted", "Coordinator", "Admin", "Activation"];

export default function ProgressBar({ currentStep }: { currentStep: number }) {
  // Image ke colors: Navy Blue (#1E3A8A), Light Blue Circle Background (#EFF6FF)
  const navyBlue = "#1E3A8A";
  const lightBlueBg = "#EFF6FF";
  const greyLine = "#E2E8F0";

  return (
    <div style={{ padding: "1.5rem 1rem", backgroundColor: "#fff", borderRadius: "12px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", maxWidth: "900px", margin: "0 auto" }}>
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
              {/* Connector line - Image ki tarah sleek aur colored */}
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute",
                  top: 16,
                  left: "50%",
                  width: "100%",
                  height: 2.5,
                  background: i < currentStep ? navyBlue : greyLine,
                  zIndex: 0,
                  transition: "background 0.4s ease",
                }} />
              )}

              {/* Step circle - Exact match to image_62a840.png */}
              <div style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                position: "relative",
                zIndex: 1,
                // Agar complete ya active hai to Navy Blue background
                background: isCompleted || isActive ? navyBlue : "#fff",
                border: `2px solid ${isCompleted || isActive ? navyBlue : "#CBD5E1"}`,
                color: isCompleted || isActive ? "#fff" : "#94A3B8",
                transition: "all 0.3s ease",
                // Active step ke liye wahi light blue ring jo image mein hai
                boxShadow: isActive ? `0 0 0 6px ${lightBlueBg}` : "none",
              }}>
                {isCompleted ? (
                  <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>

              {/* Step label - Navy blue for active/completed */}
              <span style={{
                marginTop: 10,
                fontSize: 12,
                fontWeight: isActive || isCompleted ? 700 : 500,
                color: isActive || isCompleted ? navyBlue : "#64748B",
                textAlign: "center",
                transition: "color 0.3s",
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Description logic same rakha hai bas styling clean ki hai */}
      <div style={{
        marginTop: 24,
        textAlign: "center",
        fontSize: 13,
        fontWeight: 500,
        color: "#475569",
        paddingTop: 12,
      }}>
        {currentStep === 0 && "Step 1 of 4 — Form successfully submitted"}
        {currentStep === 1 && "Step 2 of 4 — Awaiting coordinator review"}
        {currentStep === 2 && "Step 3 of 4 — Under admin approval process"}
        {currentStep === 3 && "Step 4 of 4 — Final account activation"}
      </div>
    </div>
  );
}