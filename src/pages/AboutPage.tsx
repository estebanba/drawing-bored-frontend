import { Helmet } from "react-helmet-async";

/**
 * A minimal about page with clean content layout.
 * Clean page layout emphasizing narrative and company story.
 */
export function AboutPage() {
  return (
    <div className="w-full py-24">
      <Helmet>
        <title>About Us | Your App</title>
      </Helmet>
      
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
        <p className="text-lg text-muted-foreground text-center mb-16">
          Building tools to help developers ship faster and focus on what matters.
        </p>
        
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                We started this project after experiencing the same frustrations over and over: 
                spending weeks setting up the same basic infrastructure for every new application. 
                Authentication, payments, email systems, UI components—the essential building blocks 
                that every modern web application needs.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe developers should spend their time building unique features that solve 
                real problems, not recreating the same foundation over and over. Our boilerplate 
                provides a solid, well-tested starting point so you can focus on what makes your 
                product special.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
              <p className="text-muted-foreground leading-relaxed">
                We focus on simplicity, reliability, and developer experience. Every component 
                is carefully crafted, thoroughly tested, and well-documented. We use modern, 
                proven technologies and follow industry best practices to ensure your foundation 
                is solid and scalable.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Built for Developers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a solo developer working on a side project or part of a team 
                building the next big thing, our boilerplate gives you the head start you need. 
                Clean code, clear documentation, and thoughtful architecture—everything you'd 
                want in a foundation for your next project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 