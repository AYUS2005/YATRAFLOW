import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeverityLevel } from '@/types';

const getSeverityStyles = (severity: SeverityLevel) => {
  const styles = {
    low: 'bg-severity-low/10 border-severity-low text-severity-low',
    medium: 'bg-severity-medium/10 border-severity-medium text-severity-medium',
    high: 'bg-severity-high/10 border-severity-high text-severity-high',
    critical: 'bg-severity-critical/10 border-severity-critical text-severity-critical',
  };
  return styles[severity];
};

export const AlertPanel = () => {
  const alerts = useStore((state) => state.alerts);
  const dismissAlert = useStore((state) => state.dismissAlert);
  const clearAlerts = useStore((state) => state.clearAlerts);

  const activeAlerts = alerts.filter((alert) => !alert.dismissed);

  if (activeAlerts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">No active alerts</p>
        <p className="text-sm text-muted-foreground mt-1">You're all clear!</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Active Alerts</h3>
          <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs font-medium">
            {activeAlerts.length}
          </span>
        </div>
        {activeAlerts.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAlerts}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Alerts List */}
      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-3">
          <AnimatePresence>
            {activeAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 rounded-lg border-2 ${getSeverityStyles(alert.severity)} relative`}
              >
                {/* Dismiss button */}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Content */}
                <h4 className="font-semibold mb-1 pr-6">{alert.title}</h4>
                <p className="text-sm opacity-90 mb-2">{alert.message}</p>
                <div className="flex items-center justify-between text-xs opacity-75">
                  <span className="capitalize">{alert.type} alert</span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};
