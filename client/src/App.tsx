import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/admin-dashboard";
import EditorDashboard from "@/pages/editor-dashboard";
import VideoTheater from "@/pages/video-theater";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/editor" component={EditorDashboard} />
      <Route path="/video/:id" component={VideoTheater} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;