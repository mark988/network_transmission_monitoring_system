import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Topology from "@/pages/topology";
import Nodes from "@/pages/nodes";
import Analytics from "@/pages/analytics";
import Alerts from "@/pages/alerts";
import AiDiagnosis from "@/pages/ai-diagnosis";
import Users from "@/pages/users";
import Settings from "@/pages/settings";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/login" component={Login} />
          <Route path="/" component={Landing} />
        </>
      ) : (
        <div className="flex h-screen overflow-hidden bg-slate-900">
          <Sidebar />
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/topology" component={Topology} />
            <Route path="/nodes" component={Nodes} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/alerts" component={Alerts} />
            <Route path="/ai-diagnosis" component={AiDiagnosis} />
            <Route path="/users" component={Users} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </div>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
