"use client"

import { motion } from "framer-motion"
import { Shield, Linkedin, Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Info */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <Shield className="w-6 h-6 text-primary transition-all duration-300 group-hover:text-cyber-blue-glow" />
              <span className="text-lg font-bold text-foreground">
                Shield<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground text-center md:text-left">
              Built with FastAPI, NLP, and Machine Learning
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://www.linkedin.com/in/aditya-tripathi-1476ba235/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive" /> using Next.js, Tailwind CSS & Framer Motion
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © {new Date().getFullYear()} ShieldAI. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
