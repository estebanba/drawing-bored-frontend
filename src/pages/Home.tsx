import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DBStatus } from "@/components/DBStatus";

// Home page component
export function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh] gap-6 px-4 py-8">
      <div className="text-3xl font-bold mb-2">Welcome to the Boilerplate</div>
      <div className="text-muted-foreground text-base mb-4">Vite + React + shadcn/ui + Zustand + Auth Example</div>
      <div className="flex gap-2 justify-center mb-4">
        <Button asChild variant="outline"><Link to="/signup">Sign Up</Link></Button>
        <Button asChild><Link to="/login">Log In</Link></Button>
      </div>
      <div className="bg-muted rounded-md p-3">
        <DBStatus />
      </div>
    </div>
  );
} 