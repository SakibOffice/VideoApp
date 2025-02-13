import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VideoGrid } from "@/components/video-grid";

export default function AdminDashboard() {
  const { role, setRole } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!role || role !== "admin") {
      setLocation("/");
    }
  }, [role, setLocation]);

  const handleLogout = () => {
    setRole(null);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <VideoGrid />
      </div>
    </div>
  );
}
