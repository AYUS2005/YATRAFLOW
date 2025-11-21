import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import toast from 'react-hot-toast';

export const ReportHazardForm = () => {
  const user = useStore((state) => state.user);
  const userLocation = useStore((state) => state.userLocation);
  const isOpen = useStore((state) => state.isReportFormOpen);
  const setOpen = useStore((state) => state.setReportFormOpen);

  const [type, setType] = useState<string>('pothole');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userLocation) {
      toast.error('Please sign in and enable location');
      return;
    }

    if (!description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'hazards'), {
        type,
        lat: userLocation.lat,
        lng: userLocation.lng,
        description: description.trim(),
        reportedBy: user.uid,
        reportedByName: user.displayName || 'Anonymous',
        status: 'pending',
        timestamp: serverTimestamp(),
      });

      toast.success('Hazard reported successfully! It will be reviewed by admins.');
      setDescription('');
      setType('pothole');
      setOpen(false);
    } catch (error) {
      console.error('Error reporting hazard:', error);
      toast.error('Failed to report hazard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report Road Hazard</DialogTitle>
          <DialogDescription>
            Help keep roads safe by reporting hazards at your current location.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Hazard Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select hazard type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pothole">Pothole</SelectItem>
                <SelectItem value="debris">Debris</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the hazard in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Location info */}
          {userLocation && (
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">Report Location:</p>
              <p className="text-muted-foreground">
                Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !userLocation}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
