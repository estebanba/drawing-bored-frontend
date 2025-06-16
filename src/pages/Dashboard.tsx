/**
 * Main dashboard page with clean, minimalistic layout.
 * Simple dashboard without auth dependencies - ready for customization.
 */
export function Dashboard() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your clean dashboard. Ready to build something amazing!
        </p>
      </div>
      
      {/* Dashboard Content */}
      <div className="space-y-6">
        {/* Sample Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card text-card-foreground rounded-xl border p-6">
            <h3 className="font-semibold text-sm text-muted-foreground">Total Users</h3>
            <p className="text-2xl font-bold mt-2">1,234</p>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </div>
          
          <div className="bg-card text-card-foreground rounded-xl border p-6">
            <h3 className="font-semibold text-sm text-muted-foreground">Revenue</h3>
            <p className="text-2xl font-bold mt-2">$12,345</p>
            <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
          </div>
          
          <div className="bg-card text-card-foreground rounded-xl border p-6">
            <h3 className="font-semibold text-sm text-muted-foreground">Active Projects</h3>
            <p className="text-2xl font-bold mt-2">23</p>
            <p className="text-xs text-muted-foreground mt-1">+3 new this week</p>
          </div>
        </div>

        {/* Sample Content Area */}
        <div className="bg-card text-card-foreground rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm">System health check completed successfully</p>
              <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm">New user registration</p>
              <span className="text-xs text-muted-foreground ml-auto">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm">Maintenance scheduled for tomorrow</p>
              <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 