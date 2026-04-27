export default function StatusCard({ 
  status, 
  remarks 
}: { 
  status?: string; 
  remarks?: string 
}) {
  const statusConfig = {
    Pending: {
      label: "Awaiting coordinator review",
      description: "Your registration has been submitted. A coordinator will review it shortly.",
      color: "#B45309",
      bg: "#FEF3C7",
    },
    CoordinatorApproved: {
      label: "Coordinator approved",
      description: "Your request has been approved by the coordinator and sent to admin.",
      color: "#065F46",
      bg: "#D1FAE5",
    },
    CoordinatorRejected: {
      label: "Coordinator rejected",
      description: remarks || "Your request was rejected by the coordinator.",
      color: "#991B1B",
      bg: "#FEE2E2",
    },
    AdminApproved: {
      label: "Admin approved",
      description: "Almost there! Your account is being activated.",
      color: "#065F46",
      bg: "#D1FAE5",
    },
    Activated: {
      label: "Account activated",
      description: "Your account is fully active. Welcome!",
      color: "#065F46",
      bg: "#D1FAE5",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.Pending;

  return (
    <div style={{
      padding: "1rem 1.25rem",
      borderRadius: 12,
      background: config.bg,
      border: `1px solid ${config.color}22`,
      marginTop: "1.5rem",
    }}>
      <p style={{ fontWeight: 500, color: config.color, margin: 0 }}>
        {config.label}
      </p>
      <p style={{ fontSize: 14, color: config.color, margin: "4px 0 0", opacity: 0.8 }}>
        {config.description}
      </p>
    </div>
  );
}