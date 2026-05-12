"use client"

import { motion } from "framer-motion"
import { 
  Zap, 
  Brain, 
  Shield, 
  Lock,
  Cpu,
  Globe
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Real-time Detection",
    description: "Instant threat analysis with sub-second response times for immediate protection.",
  },
  {
    icon: Brain,
    title: "NLP-Based Analysis",
    description: "Advanced natural language processing to understand context and intent.",
  },
  {
    icon: Shield,
    title: "AI Threat Intelligence",
    description: "Machine learning models trained on millions of threat patterns.",
  },
  {
    icon: Lock,
    title: "Fast & Secure Processing",
    description: "Enterprise-grade encryption with no data storage or retention.",
  },
  {
    icon: Cpu,
    title: "Multi-Layer Analysis",
    description: "Deep inspection of URLs, keywords, patterns, and behavioral signals.",
  },
  {
    icon: Globe,
    title: "Global Threat Database",
    description: "Continuously updated with the latest phishing and spam campaigns.",
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade security features powered by cutting-edge AI technology
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-6 rounded-2xl glass border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
