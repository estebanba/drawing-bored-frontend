import { useAuthStore } from "@/store/auth";
import { ProfileCard } from "@/components/ProfileCard";
import { ProductsCard } from "@/components/ProductsCard";

/**
 * Main dashboard page with clean, minimalistic layout.
 * Focused design that matches the overall aesthetic of the application.
 */
export function Dashboard() {
  const { user } = useAuthStore();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your account today.
        </p>
      </div>
      
      {/* Dashboard Content */}
      <div className="space-y-6">
        <ProfileCard />
        <ProductsCard />
      </div>
    </div>
  );
} 