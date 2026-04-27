import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import ProgressBar from "@/components/ProgressBar";
import StatusCard from "@/components/StatusCard";

export default async function UserDashboard() {
  const session = await getServerSession();
  
  const approval = await prisma.approval.findFirst({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
  });

  const steps = ["Fill form", "Coordinator", "Admin", "Activate"];
  
  // currentStep based on approval status
  const currentStep = 
    approval?.status === "Pending" ? 1 :
    approval?.status === "CoordinatorApproved" ? 2 :
    approval?.status === "AdminApproved" ? 3 :
    approval?.status === "Activated" ? 4 : 1;

  return (
    <div>
      <ProgressBar currentStep={currentStep} />
      <StatusCard status={approval?.status}  />
    </div>
  );
}