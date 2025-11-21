import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Bell, Shield, Users, Zap } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Real-Time GPS Tracking',
    description: 'Continuous location monitoring with smooth, accurate positioning for reliable navigation.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: AlertTriangle,
    title: 'Accident Zone Alerts',
    description: 'Get instant notifications when approaching high-risk areas based on historical accident data.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Multi-sensory alerts including sound, vibration, and visual warnings for maximum awareness.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Severity-Based Warnings',
    description: 'Color-coded system showing low, medium, high, and critical risk zones at a glance.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Users,
    title: 'Community Reports',
    description: 'Report road hazards like potholes, debris, and construction to help fellow travelers.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Zap,
    title: 'Instant Response',
    description: 'Lightning-fast alerts ensure you have time to react and navigate safely.',
    color: 'from-yellow-500 to-orange-500',
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features for Your Safety
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience cutting-edge technology designed to keep you informed and protected on every journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl" 
                   style={{ background: `linear-gradient(to bottom right, var(--primary), var(--accent))` }} 
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
