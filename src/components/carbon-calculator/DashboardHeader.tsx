
import UserButton from "@/components/UserButton";

const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Eco Footprint Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitore sua pegada de carbono e tome decisões sustentáveis</p>
      </div>
      <UserButton />
    </div>
  );
};

export default DashboardHeader;
