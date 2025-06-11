import { Outlet } from "react-router-dom";
import { HeaderStandard } from "./HeaderStandard";
import { Footer } from "./Footer";

/**
 * Provides the standard layout for marketing and public-facing pages.
 * It includes a standard header, a main content area, and a footer.
 */
export function LayoutStandard() {
  return (
    <div className="flex min-h-screen flex-col max-w-[66vw] mx-auto">
      <HeaderStandard />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
} 