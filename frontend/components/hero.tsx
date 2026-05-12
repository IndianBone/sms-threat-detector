"use client"

import { motion } from "framer-motion"
import { Shield, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyber-blue/15 rounded-full blur-3xl"
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, oklch(0.65 0.2 250) 1px, transparent 1px),
                             linear-gradient(to bottom, oklch(0.65 0.2 250) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Powered by Advanced AI & NLP</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
        >
          <span className="text-foreground">AI-Powered </span>
          <span className="text-primary text-glow-blue">SMS Threat</span>
          <br />
          <span className="text-foreground">Detection</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
        >
          Detect spam, phishing, fraud, and malicious SMS messages instantly 
          using AI and NLP. Enterprise-grade security for everyone.
        </motion.p>

        {/* Animated Shield Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 mb-4 flex justify-center"
        >
          <div className="relative p-4">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px oklch(0.65 0.2 250 / 0.3)",
                  "0 0 40px oklch(0.65 0.2 250 / 0.5)",
                  "0 0 20px oklch(0.65 0.2 250 / 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-20 h-20 rounded-2xl glass flex items-center justify-center"
            >
              <Shield className="w-10 h-10 text-primary" />
            </motion.div>
            
            {/* Orbiting dots */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              <div className="absolute -top-0 w-2 h-2 rounded-full bg-primary" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center text-lg"
            >
              <div className="absolute top-1/2 -right-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyber-blue-glow" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
