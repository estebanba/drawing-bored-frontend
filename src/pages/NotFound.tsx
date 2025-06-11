import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-4">404 - Not Found</h1>
      <Link to="/" className="text-blue-600 underline">Go Home</Link>
    </div>
  );
} 