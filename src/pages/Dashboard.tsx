import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAccidentZones } from '@/hooks/useAccidentZones';
import { useHazards } from '@/hooks/useHazards';
import { useAlerts } from '@/hooks/useAlerts';
import { MapView } from '@/components/dashboard/MapView';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { ReportHazardForm } from '@/components/dashboard/ReportHazardForm';
import { Button } from '@/components/ui/button';
import { Menu, AlertCircle, MapPin, LogOut, Settings } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const userLocation = useStore((state) => state.userLocation);
  const setReportFormOpen = useStore((state) => state.setReportFormOpen);

  // Initialize hooks
  useGeolocation();
  useAccidentZones();
  useHazards();
  useAlerts();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster position="top-right" />
      <ReportHazardForm />

      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">YATRAFLOW Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user.displayName || 'User'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Location status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <MapPin className={`w-4 h-4 ${userLocation ? 'text-green-500' : 'text-muted-foreground'}`} />
              <span className="text-sm">
                {userLocation ? 'Location Active' : 'Enable Location'}
              </span>
            </div>

            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border overflow-hidden h-[600px] lg:h-full">
            {userLocation ? (
              <MapView />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Location Required</h3>
                  <p className="text-muted-foreground mb-4">
                    Please enable location access to view the map
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => setReportFormOpen(true)}
                className="w-full"
                disabled={!userLocation}
              >
                Report Hazard
              </Button>
              {user.role === 'admin' && (
                <Button
                  onClick={() => navigate('/admin')}
                  variant="outline"
                  className="w-full"
                >
                  Admin Panel
                </Button>
              )}
            </div>
          </div>

          {/* Alerts Panel */}
          <AlertPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
