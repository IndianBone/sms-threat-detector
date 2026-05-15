"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  Loader2,
  Send,
  RefreshCw,
  AlertCircle,
  Lock,
  Zap,
  WifiOff,
  ShieldAlert
} from "lucide-react"

type AnalysisState = "idle" | "analyzing" | "result" | "error"
type RiskLevel = "Low" | "Medium" | "High"
type PredictionCategory = "Safe" | "Phishing" | "Financial Fraud" | "Promotional Spam" | "Job Scam" | "Otp Scam" | "Suspicious"

interface APIResponse {
  message: string
  prediction: string
  confidence: number
  risk_level: string
  keywords: string[]
  risk_factors: string[]
}

interface AnalysisResult {
  prediction: PredictionCategory
  confidence: number
  riskLevel: RiskLevel
  keywords: string[]
  riskFactors: string[]
}

const API_BASE_URL = "https://sms-threat-detector.onrender.com"

// Map risk_level string from backend to RiskLevel type
const normalizeRiskLevel = (riskLevel: string): RiskLevel => {
  const lower = riskLevel.toLowerCase()
  if (lower === "high") return "High"
  if (lower === "medium") return "Medium"
  return "Low"
}

// Normalize prediction to supported categories
const normalizePrediction = (prediction: string): PredictionCategory => {
  const lower = prediction.toLowerCase()
  if (lower === "safe") return "Safe"
  if (lower === "phishing") return "Phishing"
  if (lower === "financial fraud") return "Financial Fraud"
  if (lower === "promotional spam") return "Promotional Spam"
  if (lower === "job scam") return "Job Scam"
  if (lower === "otp scam") return "Otp Scam"
  if (lower === "suspicious") return "Suspicious"
  return "Suspicious" // Default fallback
}

// Real API call to FastAPI backend
const analyzeMessage = async (message: string): Promise<AnalysisResult> => {
  const response = await fetch(`${API_BASE_URL}/predict?message=${encodeURIComponent(message)}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  const data: APIResponse = await response.json()

  return {
    prediction: normalizePrediction(data.prediction),
    confidence: data.confidence,
    riskLevel: normalizeRiskLevel(data.risk_level),
    keywords: data.keywords || [],
    riskFactors: data.risk_factors || [],
  }
}

export function AnalysisCard() {
  const [message, setMessage] = useState("")
  const [state, setState] = useState<AnalysisState>("idle")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleAnalyze = async () => {
    if (!message.trim()) return
    
    setState("analyzing")
    setResult(null)
    setAnimatedProgress(0)
    setErrorMessage("")
    
    // Animate progress
    const interval = setInterval(() => {
      setAnimatedProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 200)
    
    try {
      const analysisResult = await analyzeMessage(message)
      clearInterval(interval)
      setAnimatedProgress(100)
      
      setTimeout(() => {
        setResult(analysisResult)
        setState("result")
      }, 300)
    } catch (error: unknown) {
      clearInterval(interval)
      setAnimatedProgress(0)
      console.log("[v0] API Error caught:", error)
      setErrorMessage("AI Engine Offline - Unable to connect to analysis server")
      setState("error")
    }
  }

  const handleReset = () => {
    setState("idle")
    setMessage("")
    setResult(null)
    setAnimatedProgress(0)
    setErrorMessage("")
  }

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "Low": return "text-success"
      case "Medium": return "text-yellow-500"
      case "High": return "text-destructive"
    }
  }

  const getRiskBg = (level: RiskLevel) => {
    switch (level) {
      case "Low": return "bg-success/10 border-success/30"
      case "Medium": return "bg-yellow-500/10 border-yellow-500/30"
      case "High": return "bg-destructive/10 border-destructive/30"
    }
  }

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case "Low": return <CheckCircle />
      case "Medium": return <AlertCircle />
      case "High": return <AlertTriangle />
    }
  }

  // Map prediction category to color
  const getPredictionColor = (prediction: PredictionCategory) => {
    switch (prediction) {
      case "Safe": return "text-success"
      case "Promotional Spam": return "text-yellow-500"
      case "Job Scam": return "text-destructive"
      case "Suspicious": return "text-destructive"
      case "Phishing": return "text-purple-500"
      case "Financial Fraud": return "text-purple-500"
      case "Otp Scam": return "text-purple-500"
      default: return "text-foreground"
    }
  }

  // Map prediction category to background
  const getPredictionBg = (prediction: PredictionCategory) => {
    switch (prediction) {
      case "Safe": return "bg-success/10 border-success/30"
      case "Promotional Spam": return "bg-yellow-500/10 border-yellow-500/30"
      case "Job Scam": return "bg-destructive/10 border-destructive/30"
      case "Suspicious": return "bg-destructive/10 border-destructive/30"
      case "Phishing": return "bg-purple-500/10 border-purple-500/30"
      case "Financial Fraud": return "bg-purple-500/10 border-purple-500/30"
      case "Otp Scam": return "bg-purple-500/10 border-purple-500/30"
      default: return "bg-secondary/10 border-secondary/30"
    }
  }

  // Map prediction category to icon
  const getPredictionIcon = (prediction: PredictionCategory) => {
    switch (prediction) {
      case "Safe": return <CheckCircle className="w-8 h-8" />
      case "Promotional Spam": return <AlertCircle className="w-8 h-8" />
      case "Job Scam": return <AlertTriangle className="w-8 h-8" />
      case "Suspicious": return <AlertTriangle className="w-8 h-8" />
      case "Phishing": return <ShieldAlert className="w-8 h-8" />
      case "Financial Fraud": return <ShieldAlert className="w-8 h-8" />
      case "Otp Scam": return <ShieldAlert className="w-8 h-8" />
      default: return <AlertCircle className="w-8 h-8" />
    }
  }

  // Map prediction category to subtitle message
  const getPredictionSubtitle = (prediction: PredictionCategory) => {
    switch (prediction) {
      case "Safe": return "No threats detected"
      case "Promotional Spam": return "Promotional spam detected"
      case "Job Scam": return "Potential job scam detected"
      case "Suspicious": return "Suspicious content detected"
      case "Phishing": return "Phishing attempt detected"
      case "Financial Fraud": return "Financial fraud detected"
      case "Otp Scam": return "OTP scam detected"
      default: return "Threat detected"
    }
  }

  // Determine glow effect based on prediction
  const getPredictionGlow = (prediction: PredictionCategory) => {
    switch (prediction) {
      case "Safe": return "glow-green"
      case "Promotional Spam": return ""
      case "Job Scam": return "glow-red"
      case "Suspicious": return "glow-red"
      case "Phishing": return ""
      case "Financial Fraud": return ""
      case "Otp Scam": return ""
      default: return ""
    }
  }

  return (
    <section id="analyze" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Analyze Your Message
          </h2>
          <p className="text-muted-foreground">
            Paste any SMS message to instantly detect threats and malicious content
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          {/* Main Analysis Card */}
          <div className="relative glass-strong rounded-3xl p-6 sm:p-8 lg:p-10 glow-blue">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-primary/30 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-primary/30 rounded-br-3xl" />
            
            <AnimatePresence mode="wait">
              {state === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Textarea */}
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-cyber-blue/50 to-primary/50 rounded-2xl blur-sm opacity-50" />
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Paste an SMS message here for threat analysis..."
                      className="relative w-full h-48 sm:h-56 p-6 bg-background/80 rounded-2xl border border-border/50 resize-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-base sm:text-lg"
                      aria-label="SMS message to analyze"
                    />
                  </div>

                  {/* Sample Messages */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground">Try:</span>
                    {[
                      "URGENT: Your bank account has been suspended. Click here to verify: http://fake-bank.com",
                      "Hey! Are we still meeting for lunch tomorrow?",
                      "CONGRATULATIONS! You&apos;ve won $10,000! Claim your prize NOW!",
                    ].map((sample, i) => (
                      <button
                        key={i}
                        onClick={() => setMessage(sample)}
                        className="text-xs px-3 py-1.5 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all truncate max-w-[200px]"
                      >
                        {sample.substring(0, 40)}...
                      </button>
                    ))}
                  </div>

                  {/* Analyze Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    disabled={!message.trim()}
                    className="mt-8 w-full sm:w-auto mx-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-cyber-blue text-primary-foreground font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow hover:animate-none transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Analyze Message
                    <Send className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {state === "analyzing" && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-12 text-center"
                >
                  {/* AI Analyzing Animation */}
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    {/* Outer ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-primary/30"
                      style={{
                        borderTopColor: "oklch(0.65 0.2 250)",
                        borderRightColor: "oklch(0.65 0.2 250 / 0.5)",
                      }}
                    />
                    {/* Middle ring */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-3 rounded-full border-2 border-cyber-blue/30"
                      style={{
                        borderBottomColor: "oklch(0.7 0.25 250)",
                        borderLeftColor: "oklch(0.7 0.25 250 / 0.5)",
                      }}
                    />
                    {/* Center */}
                    <div className="absolute inset-6 rounded-full glass flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    AI Analysis in Progress
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Scanning message for threats and anomalies...
                  </p>

                  {/* Progress Bar */}
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Analyzing...</span>
                      <span>{Math.round(animatedProgress)}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${animatedProgress}%` }}
                        className="h-full bg-gradient-to-r from-primary to-cyber-blue rounded-full"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                      <motion.div
                        animate={{ opacity: animatedProgress > 20 ? 1 : 0.3 }}
                        className="flex items-center gap-1"
                      >
                        <Shield className="w-3 h-3" />
                        Pattern Analysis
                      </motion.div>
                      <motion.div
                        animate={{ opacity: animatedProgress > 50 ? 1 : 0.3 }}
                        className="flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" />
                        Threat Detection
                      </motion.div>
                      <motion.div
                        animate={{ opacity: animatedProgress > 80 ? 1 : 0.3 }}
                        className="flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        Risk Assessment
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}

              {state === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-12 text-center"
                >
                  {/* Error Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center glow-red"
                  >
                    <WifiOff className="w-10 h-10 text-destructive" />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-destructive mb-2"
                  >
                    AI Engine Offline
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground mb-2 max-w-md mx-auto"
                  >
                    {errorMessage || "Unable to connect to the analysis server. Please ensure the backend is running."}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xs text-muted-foreground/60 mb-8 font-mono"
                  >
                    Endpoint: {API_BASE_URL}/predict
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="mx-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </motion.button>
                </motion.div>
              )}

              {state === "result" && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Result Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getPredictionBg(result.prediction)} ${getPredictionGlow(result.prediction)}`}
                      >
                        <span className={`${getPredictionColor(result.prediction)}`}>
                          {getPredictionIcon(result.prediction)}
                        </span>
                      </motion.div>
                      <div>
                        <motion.h3
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className={`text-2xl sm:text-3xl font-bold ${getPredictionColor(result.prediction)}`}
                        >
                          {result.prediction}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-muted-foreground"
                        >
                          {getPredictionSubtitle(result.prediction)}
                        </motion.p>
                      </div>
                    </div>

                    {/* Confidence Score */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-center"
                    >
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-secondary"
                          />
                          <motion.circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            className={getPredictionColor(result.prediction)}
                            initial={{ strokeDasharray: "0 251.2" }}
                            animate={{ strokeDasharray: `${result.confidence * 2.512} 251.2` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-xl font-bold ${getPredictionColor(result.prediction)}`}>
                            {Math.round(result.confidence)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Confidence</p>
                    </motion.div>
                  </div>

                  {/* Analyzed Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 rounded-xl bg-secondary/30 border border-border/50 mb-6"
                  >
                    <p className="text-sm text-muted-foreground mb-1">Analyzed Message:</p>
                    <p className="text-foreground">{message}</p>
                  </motion.div>

                  {/* Threat Details */}
                  {(result.keywords.length > 0 || result.riskFactors.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="grid sm:grid-cols-2 gap-4 mb-8"
                    >
                      {result.keywords.length > 0 && (
                        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                          <h4 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Detected Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.keywords.map((keyword, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.riskFactors.length > 0 && (
                        <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                          <h4 className="text-sm font-semibold text-yellow-500 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Risk Factors
                          </h4>
                          <ul className="space-y-1">
                            {result.riskFactors.map((factor, i) => (
                              <li key={i} className="text-xs text-yellow-500/80 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-yellow-500" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Reset Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="w-full sm:w-auto mx-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Analyze Another Message
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
