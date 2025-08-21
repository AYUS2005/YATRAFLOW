import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ReportAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportAlertModal({ isOpen, onClose }: ReportAlertModalProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [location, setLocation] = useState("Current location");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitAlertMutation = useMutation({
    mutationFn: async (alertData: {
      type: string;
      description: string;
      location: string;
      latitude: number;
      longitude: number;
    }) => {
      const response = await apiRequest("POST", "/api/alerts", alertData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alert submitted successfully",
        description: "Your alert has been reported to the community.",
      });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Failed to submit alert",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedType("");
    setLocation("Current location");
    setDescription("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !description.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Alert type and description are required.",
        variant: "destructive",
      });
      return;
    }

    // Mock coordinates - in real app would use geolocation
    const mockCoordinates = {
      latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
      longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
    };

    submitAlertMutation.mutate({
      type: selectedType,
      description: description.trim(),
      location,
      ...mockCoordinates,
    });
  };

  const alertTypes = [
    { id: "accident", label: "Accident", icon: "fas fa-car-crash", color: "accident" },
    { id: "traffic", label: "Traffic", icon: "fas fa-traffic-light", color: "traffic" },
    { id: "hazard", label: "Hazard", icon: "fas fa-exclamation-triangle", color: "hazard" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Report Alert</h3>
            <button
              data-testid="button-close-modal"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Alert type selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Alert Type</label>
              <div className="grid grid-cols-3 gap-3">
                {alertTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    data-testid={`select-alert-type-${type.id}`}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 border-2 rounded-lg transition-colors text-center ${
                      selectedType === type.id
                        ? `border-${type.color} bg-${type.color} bg-opacity-10`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <i className={`${type.icon} text-${type.color} text-xl mb-2`}></i>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Location */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <Input
                  data-testid="input-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="pr-10"
                />
                <button
                  type="button"
                  data-testid="button-use-current-location"
                  className="absolute right-3 top-3 text-primary hover:text-blue-700"
                >
                  <i className="fas fa-crosshairs"></i>
                </button>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                data-testid="input-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Provide details about the alert..."
                className="resize-none"
              />
            </div>
            
            {/* Submit button */}
            <Button
              type="submit"
              data-testid="button-submit-alert"
              disabled={submitAlertMutation.isPending}
              className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3"
            >
              {submitAlertMutation.isPending ? "Submitting..." : "Submit Alert"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
