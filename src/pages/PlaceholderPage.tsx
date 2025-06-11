import { Helmet } from "react-helmet-async";

export function PlaceholderPage({ title = "Coming Soon" }: { title?: string }) {
  return (
    <div className="w-full py-20 text-center">
      <Helmet>
        <title>{title} | Your App</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">This page is not yet implemented. Check back soon!</p>
    </div>
  );
} 