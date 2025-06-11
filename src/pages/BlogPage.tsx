import { Helmet } from "react-helmet-async";

/**
 * A minimal blog page with clean article listings.
 * Clean page layout emphasizing content readability.
 */
export function BlogPage() {
  const posts = [
    {
      title: "Getting Started with the Boilerplate",
      date: "2024-06-15",
      description: "A comprehensive guide to setting up and configuring your new project using our boilerplate.",
      slug: "getting-started"
    },
    {
      title: "Authentication Best Practices",
      date: "2024-06-10",
      description: "Learn how to implement secure authentication patterns and protect your application.",
      slug: "authentication-best-practices"
    },
    {
      title: "Integrating Payment Systems",
      date: "2024-06-05",
      description: "Step-by-step guide to setting up Stripe payments and handling subscriptions.",
      slug: "integrating-payments"
    },
    {
      title: "Deploying to Production",
      date: "2024-06-01",
      description: "Best practices for deploying your application to production environments.",
      slug: "deploying-to-production"
    },
    {
      title: "Building Scalable APIs",
      date: "2024-05-28",
      description: "Design patterns and strategies for creating maintainable and scalable backend APIs.",
      slug: "building-scalable-apis"
    },
    {
      title: "UI Component Guidelines",
      date: "2024-05-25",
      description: "How to effectively use and customize the included UI components in your project.",
      slug: "ui-component-guidelines"
    }
  ];

  return (
    <div className="w-full py-24">
      <Helmet>
        <title>Blog | Your App</title>
      </Helmet>
      
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Blog</h1>
        <p className="text-lg text-muted-foreground text-center mb-16">
          Guides, tutorials, and best practices for building with our boilerplate.
        </p>
        
        <div className="space-y-12">
          {posts.map((post, index) => (
            <article key={index} className="pb-8 border-b border-border last:border-b-0">
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <h2 className="text-2xl font-semibold">
                  <a href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </a>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {post.description}
                </p>
                <a 
                  href={`/blog/${post.slug}`} 
                  className="inline-block text-sm text-primary hover:underline"
                >
                  Read more →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
} 