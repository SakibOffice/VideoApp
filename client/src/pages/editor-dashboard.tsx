import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UploadForm } from "@/components/upload-form";
import { VideoGrid } from "@/components/video-grid";

export default function EditorDashboard() {
  const { role, setRole } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!role || role !== "editor") {
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
          <h1 className="text-2xl font-bold">Editor Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <div className="space-y-6">
          <UploadForm />
          <VideoGrid />
        </div>
      </div>
    </div>
  );
}
