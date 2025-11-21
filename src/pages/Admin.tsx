import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Hazard } from '@/types';
import toast from 'react-hot-toast';

const Admin = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [pendingHazards, setPendingHazards] = useState<Hazard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    // Fetch pending hazards
    const q = query(
      collection(db, 'hazards'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hazards: Hazard[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        hazards.push({
          id: doc.id,
          type: data.type,
          lat: data.lat,
          lng: data.lng,
          description: data.description,
          reportedBy: data.reportedBy,
          reportedByName: data.reportedByName,
          status: data.status,
          timestamp: data.timestamp?.toDate() || new Date(),
        });
      });
      setPendingHazards(hazards);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const handleApproveHazard = async (hazardId: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'hazards', hazardId), {
        status: 'approved',
        approvedBy: user?.uid,
        approvedAt: serverTimestamp(),
      });
      toast.success('Hazard approved');
    } catch (error) {
      console.error('Error approving hazard:', error);
      toast.error('Failed to approve hazard');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectHazard = async (hazardId: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'hazards', hazardId), {
        status: 'rejected',
        rejectedBy: user?.uid,
        rejectedAt: serverTimestamp(),
      });
      toast.success('Hazard rejected');
    } catch (error) {
      console.error('Error rejecting hazard:', error);
      toast.error('Failed to reject hazard');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage zones and hazards</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto p-6">
        <Tabs defaultValue="hazards" className="w-full">
          <TabsList>
            <TabsTrigger value="hazards">Pending Hazards</TabsTrigger>
            <TabsTrigger value="zones">Accident Zones</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="hazards" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Hazard Reports</CardTitle>
                <CardDescription>
                  Review and approve user-reported hazards ({pendingHazards.length} pending)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingHazards.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending hazards to review
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingHazards.map((hazard) => (
                      <div
                        key={hazard.id}
                        className="border border-border rounded-lg p-4 flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="capitalize">
                              {hazard.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {hazard.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{hazard.description}</p>
                          <div className="text-xs text-muted-foreground">
                            <p>Reported by: {hazard.reportedByName}</p>
                            <p>
                              Location: {hazard.lat.toFixed(6)}, {hazard.lng.toFixed(6)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => handleApproveHazard(hazard.id)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectHazard(hazard.id)}
                            disabled={loading}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zones" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Accident Zones Management</CardTitle>
                <CardDescription>
                  Add, edit, or remove accident-prone zones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Zone management interface coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>View system statistics and usage data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Analytics dashboard coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
