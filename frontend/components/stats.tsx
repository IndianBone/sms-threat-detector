"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"
import { 
  MessageSquare, 
  ShieldAlert, 
  ShieldCheck, 
  Target 
} from "lucide-react"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  suffix?: string
  color: "blue" | "red" | "green"
  delay?: number
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    })

    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v))

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [count, rounded, value])

  return (
    <span>
      {displayValue.toLocaleString()}{suffix}
    </span>
  )
}

function StatCard({ icon, label, value, suffix, color, delay = 0 }: StatCardProps) {
  const colorClasses = {
    blue: "text-primary border-primary/30 bg-primary/5",
    red: "text-destructive border-destructive/30 bg-destructive/5",
    green: "text-success border-success/30 bg-success/5",
  }

  const iconBgClasses = {
    blue: "bg-primary/10",
    red: "bg-destructive/10",
    green: "bg-success/10",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative p-6 rounded-2xl glass border ${colorClasses[color]} transition-all duration-300`}
    >
      <div className={`w-12 h-12 rounded-xl ${iconBgClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-3xl sm:text-4xl font-bold ${colorClasses[color].split(" ")[0]}`}>
        <AnimatedCounter value={value} suffix={suffix} />
      </p>
    </motion.div>
  )
}

export function Stats() {
  return (
    <section id="stats" className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Dashboard Statistics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time analytics from our AI-powered threat detection system
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<MessageSquare className="w-6 h-6 text-primary" />}
            label="Total Messages Scanned"
            value={127549}
            color="blue"
            delay={0}
          />
          <StatCard
            icon={<ShieldAlert className="w-6 h-6 text-destructive" />}
            label="Spam Detected"
            value={24891}
            color="red"
            delay={0.1}
          />
          <StatCard
            icon={<ShieldCheck className="w-6 h-6 text-success" />}
            label="Safe Messages"
            value={102658}
            color="green"
            delay={0.2}
          />
          <StatCard
            icon={<Target className="w-6 h-6 text-primary" />}
            label="Detection Accuracy"
            value={99}
            suffix="%"
            color="blue"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  )
}
