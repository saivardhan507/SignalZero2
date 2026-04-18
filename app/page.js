"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Brain, Code, Database, BarChart3, Cpu, Workflow,
  ArrowRight, Send, MessageSquare, X, ChevronRight, ChevronLeft,
  ExternalLink, Linkedin, Mail, Phone, MapPin,
  Shield, Check, Menu, Sparkles, Zap, Globe,
  Target, TrendingUp, Users, Award, BookOpen, Layers,
  MousePointer, ArrowDown, Star, Box, Search, Rocket, CheckCircle
} from 'lucide-react';
import ModelViewer from '@/components/ModelViewer';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell
} from 'recharts';


// ===== CUSTOM RECHARTS ANIMATED COMPONENTS =====


const AnimatedCounter = ({ value, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [glow, setGlow] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const reducedMotion = useReducedMotion();

  // Extract number and suffix ("50+" -> num: 50, suffix: "+", "100%" -> num: 100, suffix: "%")
  const numMatch = value.match(/\d+/);
  const suffixMatch = value.match(/\D+$/);
  const targetNum = numMatch ? parseInt(numMatch[0]) : 0;
  const suffix = suffixMatch ? suffixMatch[0] : '';

  useEffect(() => {
    if (reducedMotion) {
      setCount(targetNum);
      return;
    }
    if (inView) {
      setGlow(false);
      let animationFrame;
      const duration = 1800; // 1.8s
      const startTime = performance.now() + delay;
      
      const step = (currentTime) => {
        if (currentTime < startTime) {
          animationFrame = requestAnimationFrame(step);
          return;
        }
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(2, -10 * progress); // easeOutExpo
        setCount(Math.floor(easeProgress * targetNum));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        } else {
          setCount(targetNum);
          setGlow(true);
          setTimeout(() => setGlow(false), 600);
        }
      };
      animationFrame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animationFrame);
    } else {
      setCount(0);
      setGlow(false);
    }
  }, [inView, targetNum, reducedMotion, delay]);

  return (
    <div 
      ref={ref} 
      className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1 tabular-nums transition-shadow duration-300"
      style={{ textShadow: glow ? '0 0 20px rgba(0,229,255,0.8)' : '0 0 0px transparent' }}
    >
      {count}{suffix}
    </div>
  );
};

const AnimatedYAxisTick = ({ x, y, payload, inView, reducedMotion }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (reducedMotion) {
      setVal(payload.value);
      return;
    }
    if (inView) {
      let animationFrame;
      const end = payload.value;
      const duration = 1200;
      const startTime = performance.now();
      
      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        // EaseOutQuart approximation
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setVal(Math.floor(easeProgress * end));
        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        }
      };
      animationFrame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animationFrame);
    } else {
      setVal(0);
    }
  }, [inView, payload.value, reducedMotion]);

  return <text x={x} y={y} dy={4} textAnchor="end" fill="#64748b" fontSize={11}>{val}</text>;
};

const CustomBarShape = (props) => {
  const { x, y, width, height, fill, index, isCyan } = props;
  const reducedMotion = useReducedMotion();
  const delay = reducedMotion ? 0 : index * 0.12 + (isCyan ? 0.15 : 0);
  const duration = reducedMotion ? 0 : (isCyan ? 1.2 : 1.0);
  
  if (width == null || height == null || x == null || y == null) return null;

  return (
    <motion.path
      d={`M${x},${y+height} L${x+width},${y+height} L${x+width},${y} L${x},${y} Z`}
      fill={fill}
      initial={{ scaleY: 0, originY: 1 }}
      animate={{ scaleY: 1 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        filter: isCyan && !reducedMotion ? 'drop-shadow(0 0 12px rgba(0,229,255,0.4))' : 'none',
        transformOrigin: "bottom"
      }}
    />
  );
};

function AnimatedEfficiencyChart({ cs }) {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { amount: 0.2, margin: "0px 0px -10% 0px" });
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });
  
  // Subtle vertical parallax (max 30px offset) mapping scrolled state to Y
  const parallaxY = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const yOffset = reducedMotion ? 0 : parallaxY;

  return (
    <motion.div
      ref={containerRef}
      style={{ y: yOffset, willChange: 'transform' }}
      className="w-full relative"
    >
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={cs.data} key={inView ? 'active' : 'reset'}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="source" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={12} tick={(props) => <AnimatedYAxisTick {...props} inView={inView} reducedMotion={reducedMotion} />} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
          <Tooltip contentStyle={{ background: 'rgba(26, 26, 46, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,240,255,0.5)', borderRadius: '12px', color: '#e2e8f0', boxShadow: '0 0 20px rgba(0,240,255,0.3), inset 0 0 20px rgba(0,240,255,0.1)' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="before" fill="#475569" radius={[4, 4, 0, 0]} name="Before" shape={(props) => <CustomBarShape {...props} isCyan={false} />} isAnimationActive={false} />
          <Bar dataKey="after" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} name="After" shape={(props) => <CustomBarShape {...props} isCyan={true} />} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// ===== CONSTANTS =====
const SERVICES = [
  {
    id: '3d', title: '3D Modeling & WebGL',
    description: 'Interactive 3D experiences that captivate users with immersive product visualizations and virtual environments.',
    icon: Box, color: '#ec4899',
    tech: ['Three.js', 'Spline', 'WebGL', 'Blender', 'GSAP'],
  },
  {
    id: 'fullstack', title: 'Full-Stack Web Platform',
    description: 'Custom-built web applications with modern architectures, real-time features, and seamless user experiences.',
    icon: Code, color: 'var(--accent-primary)',
    tech: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'MongoDB'],
  },
  {
    id: 'ai', title: 'Custom AI Agent / RAG Pipeline',
    description: 'Intelligent AI agents trained on your data, enabling conversational AI, document Q&A, and automated decision-making.',
    icon: Brain, color: 'var(--accent-secondary)',
    tech: ['LangChain', 'GPT-4', 'Gemini', 'Vector DB', 'Python'],
  },
  {
    id: 'fintech', title: 'FinTech & Algorithmic Dashboards',
    description: 'Real-time trading dashboards, financial analytics platforms, and algorithmic trading system development.',
    icon: BarChart3, color: '#10b981',
    tech: ['Python', 'TensorFlow', 'D3.js', 'WebSocket', 'Redis'],
  },
  {
    id: 'data', title: 'Data Engineering & ETL',
    description: 'End-to-end data pipeline design, warehouse optimization, and real-time streaming architecture.',
    icon: Database, color: '#f59e0b',
    tech: ['Apache Spark', 'Airflow', 'dbt', 'Snowflake', 'Kafka'],
  },
  {
    id: 'automation', title: 'Cognitive Workflow Automation',
    description: 'AI-powered process automation that eliminates manual work and enables intelligent document processing.',
    icon: Workflow, color: '#06b6d4',
    tech: ['NLP', 'OCR', 'RPA', 'DialogFlow', 'Python'],
  },
];

const stockData = [
  { month: 'Jan', predicted: 145, actual: 125, baseline: 130 },
  { month: 'Feb', predicted: 152, actual: 175, baseline: 132 },
  { month: 'Mar', predicted: 148, actual: 130, baseline: 131 },
  { month: 'Apr', predicted: 165, actual: 195, baseline: 135 },
  { month: 'May', predicted: 172, actual: 155, baseline: 134 },
  { month: 'Jun', predicted: 180, actual: 208, baseline: 136 },
  { month: 'Jul', predicted: 175, actual: 150, baseline: 138 },
  { month: 'Aug', predicted: 190, actual: 225, baseline: 140 },
  { month: 'Sep', predicted: 185, actual: 165, baseline: 139 },
  { month: 'Oct', predicted: 198, actual: 238, baseline: 142 },
  { month: 'Nov', predicted: 205, actual: 185, baseline: 143 },
  { month: 'Dec', predicted: 215, actual: 255, baseline: 145 },
];

const modelComparisonData = [
  { name: 'Logistic Reg', value: 68 },
  { name: 'Random Forest', value: 76 },
  { name: 'XGBoost', value: 79 },
  { name: 'LSTM', value: 81 },
  { name: 'Ensemble', value: 84 },
];

const etlData = [
  { source: 'CRM Data', before: 45, after: 12 },
  { source: 'ERP Sync', before: 60, after: 15 },
  { source: 'API Feeds', before: 35, after: 8 },
  { source: 'File Import', before: 55, after: 14 },
  { source: 'DB Migration', before: 90, after: 22 },
];

const ragData = [
  { metric: 'Accuracy', value: 84, fullMark: 100 },
  { metric: 'Speed', value: 88, fullMark: 100 },
  { metric: 'Relevance', value: 86, fullMark: 100 },
  { metric: 'Context', value: 91, fullMark: 100 },
  { metric: 'Coverage', value: 85, fullMark: 100 },
  { metric: 'Reliability', value: 93, fullMark: 100 },
];

const CASE_STUDIES = [
  {
    id: 4,
    title: 'Hospital Architecture Visualization',
    category: '3D Modeling',
    description: 'We partnered with a leading architectural firm to bring their hospital blueprints to life. Explore the spatial design and structural layout in real-time.',
    challenge: 'Architects needed a way to present complex 3D structural layouts to stakeholders without requiring specialized visualization software.',
    solution: 'Designed ultra-efficient, browser-based 3D models with interactive real-time controls, allowing for virtual walkthroughs and structural exploration.',
    results: ['2 High-detail 3D models', '100% Browser-native', 'Real-time interactivity', 'Improved stakeholder buy-in'],
    tech: ['Three.js', 'WebGL', 'Blender', 'GLB Optimized'],
    chartType: '3d',
    models: [
      { src: '/models/modern_building.glb', title: 'Structural Hub' },
      { src: '/models/hospital_waiting_room.glb', title: 'Waiting Area' }
    ],
  },
  {
    id: 1,
    title: 'AI-Driven Stock Market Prediction Engine',
    category: 'FinTech & AI',
    description: 'Built a hybrid ML model combining LSTM, Random Forest, and Gradient Boosting for real-time stock price prediction with 84% directional accuracy.',
    challenge: 'The client needed to process 50GB of historical market data and deliver sub-second predictions during trading hours.',
    solution: 'Designed a multi-algorithm fusion architecture with real-time feature engineering, achieving 84% accuracy on directional predictions.',
    results: ['84% prediction accuracy', '< 200ms response time', '40% ROI improvement', 'Processing 50GB+ data'],
    tech: ['Python', 'TensorFlow', 'LSTM', 'Apache Kafka', 'Redis', 'React'],
    chartType: 'line',
    data: stockData,
  },
  {
    id: 2,
    title: 'Enterprise ETL Pipeline Automation',
    category: 'Data Engineering',
    description: 'Automated legacy ETL pipelines for a mid-market operations company, reducing processing time by 70% and eliminating manual data wrangling.',
    challenge: 'Data trapped across 12 different sources including legacy systems, Excel files, and siloed databases with no unified schema.',
    solution: 'Built an automated pipeline with intelligent schema detection, data quality checks, and real-time monitoring dashboards.',
    results: ['70% faster processing', '99.8% data accuracy', '12 sources unified', 'Zero manual intervention'],
    tech: ['Apache Airflow', 'dbt', 'Snowflake', 'Python', 'Docker', 'Power BI'],
    chartType: 'bar',
    data: etlData,
  },
  {
    id: 3,
    title: 'Custom RAG Agent for Healthcare',
    category: 'AI / RAG',
    description: 'Developed a HIPAA-compliant RAG chatbot for a healthcare provider, trained on 10,000+ medical documents for patient support.',
    challenge: 'Need for accurate, context-aware responses from a vast medical knowledge base while maintaining strict HIPAA compliance.',
    solution: 'Custom RAG pipeline with fine-tuned embeddings, multi-hop reasoning, and a secure vector database with access controls.',
    results: ['96% answer relevance', '40% reduced support load', '10K+ documents indexed', 'HIPAA compliant'],
    tech: ['LangChain', 'Pinecone', 'GPT-4', 'FastAPI', 'React', 'AWS'],
    chartType: 'radar',
    data: ragData,
  },
];

const BUDGET_OPTIONS = [
  'Under ₹30k',
  '₹30k - ₹60k',
  '₹60k - ₹3L',
  '₹3L+',
];

const TIMELINE_OPTIONS = ['ASAP', '1-3 Months', '3-6 Months', 'Just Exploring'];

const DATA_STATE_OPTIONS = [
  'Clean & Organized',
  'Spread Across Multiple Systems',
  'Trapped in Excel / CSVs',
  'We have data?',
];

// ===== ANIMATED SECTION WRAPPER =====
function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== SIGNAL ZERO LOGO SVG =====
function SignalZeroLogo({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <circle cx="24" cy="24" r="22" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.3" />
      <circle cx="24" cy="24" r="16" stroke="var(--accent-primary)" strokeWidth="1.5" opacity="0.6" />
      <path d="M 8 24 Q 13 14, 18 24 Q 23 34, 28 24 Q 33 14, 38 24" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2.5" fill="var(--accent-primary)" />
    </svg>
  );
}

// ===== CINEMATIC SIGNAL WAVE CANVAS =====
function SignalWaveCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);
  const statesRef = useRef(null);
  const velocitiesRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    // Wave grid configuration
    const COLS = 55;
    const ROWS = 22;
    const SPACING_X = 28;
    const SPACING_Z = 24;
    const AMPLITUDE = 55;
    const FLATTEN_RADIUS = 260;
    const PERSPECTIVE = 700;
    const TILT = 0.42;

    const totalPts = COLS * ROWS;
    if (!statesRef.current) {
      statesRef.current = new Float32Array(totalPts).fill(1);
      velocitiesRef.current = new Float32Array(totalPts).fill(0);
    }
    const states = statesRef.current;
    const velocities = velocitiesRef.current;

    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    let mouseTimeout;

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Safety net: if no mouse movement for 1s, treat as leave (safeguard against stuck states)
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(handleLeave, 1000);
    };
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleLeave);
    window.addEventListener('touchend', handleLeave);
    window.addEventListener('touchcancel', handleLeave);

    function project(x, y, z) {
      const ry = y * cosT - z * sinT;
      const rz = y * sinT + z * cosT;
      const d = PERSPECTIVE + rz + 350;
      const scale = d > 0 ? PERSPECTIVE / d : 0;
      return {
        sx: canvas.width / 2 + x * scale,
        sy: canvas.height * 0.48 + ry * scale,
        scale: Math.max(0, scale),
        depth: rz,
      };
    }

    let lastMouseX = -9999;
    let lastMouseY = -9999;
    let targetSpeed = 0.014;
    let currentSpeed = 0.014;

    function animate() {
      // Calculate mouse velocity for wave speed
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      
      let targetSpeed = 0.014;
      if (mx !== -9999 && lastMouseX !== -9999) {
        const dxMouse = mx - lastMouseX;
        const dyMouse = my - lastMouseY;
        const dist = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        targetSpeed = Math.min(0.05, 0.014 + dist * 0.001);
      }
      lastMouseX = mx;
      lastMouseY = my;
      
      // Smoothly interpolate to target speed
      currentSpeed += (targetSpeed - currentSpeed) * 0.05;
      time += currentSpeed;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const W = canvas.width;
      const H = canvas.height;

      // Compute all projected points
      const pts = [];
      for (let r = 0; r < ROWS; r++) {
        const row = [];
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c;
          const x3d = (c - COLS / 2) * SPACING_X;
          const z3d = (r - ROWS / 2) * SPACING_Z;

          // Multi-harmonic wave
          const w1 = Math.sin(x3d * 0.038 + time * 2.2) * Math.cos(z3d * 0.028 + time * 1.6);
          const w2 = Math.sin(x3d * 0.055 - time * 1.3 + z3d * 0.02) * 0.45;
          const w3 = Math.cos(x3d * 0.025 + z3d * 0.035 + time * 0.9) * 0.3;
          const w4 = Math.sin((x3d + z3d) * 0.02 + time * 3) * 0.15;
          const rawY = (w1 + w2 + w3 + w4) * AMPLITUDE;

          // Project wave and baseline
          const pW = project(x3d, rawY, z3d);
          const pB = project(x3d, 0, z3d);

          // Distance from mouse to projected wave point
          const dx = mx - pW.sx;
          const dy = my - pW.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Target: 0 = flat (zero signal), 1 = full wave
          let target;
          if (!isTouch && dist < FLATTEN_RADIUS) {
            const t = dist / FLATTEN_RADIUS;
            // Very aggressive flattening near center, edge repulsion bulge
            if (t < 0.5) {
              target = t * t * 0.05; // nearly zero near cursor
            } else {
              const edge = (t - 0.5) * 2; // 0-1 in outer half
              target = edge * edge * (3 - 2 * edge); // smoothstep
              // Edge repulsion: slight amplitude boost at boundary
              if (t > 0.75 && t < 0.95) {
                target *= 1.0 + (1 - Math.abs(t - 0.85) / 0.1) * 0.2;
              }
            }
          } else {
            target = 1.0;
          }

          // Spring physics: fast, responsive with slight overshoot
          const springK = 0.12;
          const damping = 0.78;
          const acc = (target - states[idx]) * springK;
          velocities[idx] = velocities[idx] * damping + acc;
          states[idx] = Math.max(0, Math.min(1.15, states[idx] + velocities[idx]));

          const finalY = rawY * states[idx];
          const pF = project(x3d, finalY, z3d);

          // Depth-based fade
          const depthFade = Math.max(0.04, Math.min(1, 1 - (r / ROWS) * 0.75));

          row.push({
            sx: pF.sx, sy: pF.sy,
            bx: pB.sx, by: pB.sy,
            scale: pF.scale, depth: pF.depth,
            opacity: depthFade, state: states[idx],
            waveY: finalY, rawY,
          });
        }
        pts.push(row);
      }

      // === RENDER (back to front) ===

      // 1. Draw baseline grid plane (subtle reference lines)
      ctx.save();
      ctx.globalAlpha = 0.06;
      for (let r = 0; r < ROWS; r++) {
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const p = pts[r][c];
          if (c === 0) ctx.moveTo(p.bx, p.by);
          else ctx.lineTo(p.bx, p.by);
        }
        ctx.strokeStyle = 'var(--accent-primary)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      for (let c = 0; c < COLS; c += 3) {
        ctx.beginPath();
        for (let r = 0; r < ROWS; r++) {
          const p = pts[r][c];
          if (r === 0) ctx.moveTo(p.bx, p.by);
          else ctx.lineTo(p.bx, p.by);
        }
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw vertical stems, wave lines, and data points (per row, back to front)
      for (let r = 0; r < ROWS; r++) {
        const rowData = pts[r];
        const rowOp = rowData[0].opacity;

        // Vertical stems (spectrum analyzer style)
        for (let c = 0; c < COLS; c += 2) {
          const p = rowData[c];
          const stemH = Math.abs(p.sy - p.by);
          if (stemH > 1.5) {
            const stemOp = rowOp * 0.12 * Math.min(1, stemH / 20);
            ctx.beginPath();
            ctx.moveTo(p.bx, p.by);
            ctx.lineTo(p.sx, p.sy);
            ctx.strokeStyle = `rgba(0, 229, 255, ${stemOp})`;
            ctx.lineWidth = Math.max(0.3, 0.8 * p.scale);
            ctx.stroke();
          }
        }

        // Wave line glow (wide, soft)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const p = rowData[c];
          if (c === 0) ctx.moveTo(p.sx, p.sy);
          else {
            // Smooth curve through points
            const prev = rowData[c - 1];
            const cpx = (prev.sx + p.sx) / 2;
            ctx.quadraticCurveTo(prev.sx, prev.sy, cpx, (prev.sy + p.sy) / 2);
          }
        }
        const lastP = rowData[COLS - 1];
        ctx.lineTo(lastP.sx, lastP.sy);
        ctx.strokeStyle = `rgba(0, 200, 255, ${rowOp * 0.06})`;
        ctx.lineWidth = Math.max(1, 8 * rowData[0].scale);
        ctx.stroke();
        ctx.restore();

        // Wave line core (sharp, bright)
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const p = rowData[c];
          if (c === 0) ctx.moveTo(p.sx, p.sy);
          else {
            const prev = rowData[c - 1];
            const cpx = (prev.sx + p.sx) / 2;
            ctx.quadraticCurveTo(prev.sx, prev.sy, cpx, (prev.sy + p.sy) / 2);
          }
        }
        ctx.lineTo(lastP.sx, lastP.sy);
        // Color shifts: more white when signal is strong, more dim when near zero
        ctx.strokeStyle = `rgba(0, 229, 255, ${rowOp * 0.45})`;
        ctx.lineWidth = Math.max(0.5, 1.8 * rowData[0].scale);
        ctx.stroke();

        // Data points removed to look clean
      }

      // 3. Cursor "zero zone" indicator
      if (mx > 0 && mx < W && my > 0 && my < H) {
        // Subtle radial indicator
        const zg = ctx.createRadialGradient(mx, my, 0, mx, my, FLATTEN_RADIUS);
        zg.addColorStop(0, 'rgba(0, 229, 255, 0.025)');
        zg.addColorStop(0.5, 'rgba(0, 200, 255, 0.01)');
        zg.addColorStop(0.85, 'rgba(0, 180, 255, 0.005)');
        zg.addColorStop(1, 'rgba(0, 150, 255, 0)');
        ctx.fillStyle = zg;
        ctx.beginPath();
        ctx.arc(mx, my, FLATTEN_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Edge ring (like a force field)
        ctx.beginPath();
        ctx.arc(mx, my, FLATTEN_RADIUS, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Inner ring
        ctx.beginPath();
        ctx.arc(mx, my, FLATTEN_RADIUS * 0.35, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Crosshair at cursor
        const ch = 8;
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mx - ch, my); ctx.lineTo(mx + ch, my);
        ctx.moveTo(mx, my - ch); ctx.lineTo(mx, my + ch);
        ctx.stroke();
      }

      // 4. Ambient and active particles removed for clean look

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

// ===== 3D TILT CARD =====
function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
  }, []);
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`card-3d ${className}`}
    >
      {children}
    </div>
  );
}

// ===== NAVIGATION =====
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      // Calculate scroll progress percentage
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min((window.scrollY / docHeight) * 100, 100));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial state
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'ABOUT', href: '#about' },
    { label: 'SERVICES', href: '#services' },
    { label: 'CASE STUDIES', href: '#case-studies' },
    { label: 'FOUNDER', href: '#founder' },
    { label: 'CONTACT', href: '#discovery' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-400 ease-in-out ${
        scrolled 
          ? 'bg-[var(--bg-base)]/65 backdrop-blur-[16px] border-b border-[var(--accent-primary)]/12 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-3' 
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <SignalZeroLogo className="w-9 h-9 transition-transform group-hover:scale-110 text-[var(--accent-primary)]" />
          <div>
            <span className="text-[var(--text-primary)] font-bold text-lg tracking-widest">SIGNAL</span>
            <span className="text-[var(--accent-primary)] font-bold text-lg tracking-widest ml-1">ZERO</span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className="group relative text-[13px] text-gray-300 hover:text-[var(--accent-primary)] transition-colors duration-300 tracking-[0.05em] font-medium uppercase hover:[text-shadow:0_0_8px_rgba(0,245,255,0.4)]"
            >
              {link.label}
              {/* Subtle underline scale-in animation */}
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--accent-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
            </a>
          ))}
          <a href="#discovery">
            <Button className="bg-[var(--accent-primary)] text-[var(--bg-base)] hover:bg-[var(--accent-primary)] font-bold px-6 py-5 rounded-full text-sm transition-all duration-300 hover:shadow-[0_0_18px_rgba(0,245,255,0.5)]">
              Start a Project <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white hover:text-[var(--accent-primary)] transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Scroll Progress Bar at the very bottom edge of the header */}
      <div
        className="absolute bottom-0 left-0 h-[3px]"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, var(--accent-primary), #0080ff)',
          boxShadow: '0 0 8px rgba(0, 229, 255, 0.5), 0 0 2px rgba(0, 229, 255, 0.3)',
          transition: 'width 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'width',
        }}
      />

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-[#050810] shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-y-auto z-[9999] pointer-events-auto"
          >
            <div className="px-6 py-8 flex flex-col gap-2">
              {links.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setMenuOpen(false)}
                  onTouchEnd={() => setMenuOpen(false)}
                  className="block w-full py-4 text-gray-300 hover:text-[var(--accent-primary)] text-lg font-bold tracking-widest uppercase transition-colors cursor-pointer"
                  style={{ minHeight: '48px', WebkitTapHighlightColor: 'rgba(0,229,255,0.2)' }}
                >
                  {link.label}
                </a>
              ))}
              <a 
                href="#discovery" 
                onClick={() => setMenuOpen(false)} 
                onTouchEnd={() => setMenuOpen(false)}
                className="mt-6 block w-full cursor-pointer"
                style={{ WebkitTapHighlightColor: 'rgba(0,229,255,0.2)' }}
              >
                <Button className="w-full bg-[var(--accent-primary)] text-[var(--bg-base)] hover:bg-[var(--accent-primary)] font-bold py-6 rounded-full text-lg transition-all duration-300 hover:shadow-[0_0_18px_rgba(0,245,255,0.5)] pointer-events-none">
                  Start a Project <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ===== HERO SECTION =====
function HeroSection() {
  const { scrollY } = useScroll();
  const splitX = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityFade = useTransform(scrollY, [0, 400], [1, 0]);

  const statsData = [
    { value: '10+', label: 'CLIENTS SCALED', icon: Users, delay: 1.0 },
    { value: '50+', label: 'PROJECTS DELIVERED', icon: CheckCircle, delay: 1.1 },
    { value: '6+', label: 'PRODUCTS BUILDING', icon: Rocket, delay: 1.2 },
    { value: '100%', label: 'DELIVERY RATE', icon: Target, delay: 1.3 },
  ];

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center w-full z-10 py-12 lg:py-20 flex-shrink-0">
      {/* Content */}
      <div className="relative z-10 text-center px-6 w-full max-w-6xl mx-auto pointer-events-none flex flex-col items-center justify-center font-sans mt-8">
        
        {/* Top Hover Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mb-6 lg:mb-8 border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2 text-[clamp(0.65rem,1.2vw,0.75rem)] tracking-[0.2em] uppercase rounded-full pointer-events-auto font-medium inline-flex items-center text-zinc-300 hover:text-white hover:border-[var(--accent-glow)]/50 hover:shadow-[0_0_15px_rgba(0,255,127,0.2)] transition-all duration-300 group cursor-default">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-[var(--accent-glow)] group-hover:animate-pulse" /> Integrated AI & Systems Engineering Agency
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-[clamp(3.5rem,10vw,8rem)] font-black uppercase mb-6 sm:mb-8 flex justify-center items-center gap-3 sm:gap-4 flex-wrap"
          style={{ letterSpacing: '-0.03em', lineHeight: '1.05', opacity: opacityFade }}
        >
          <motion.span
            style={{ x: useTransform(splitX, v => -v) }}
            className="text-[var(--text-primary)]"
          >
            SIGNAL
          </motion.span>
          <motion.span
            style={{ x: splitX }}
            className="neon-text text-[var(--accent-primary)] drop-shadow-[0_0_40px_rgba(0,204,255,0.4)]"
          >
            ZERO
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[clamp(1rem,2vw,1.15rem)] font-medium text-zinc-400 max-w-[65ch] mx-auto mb-10 lg:mb-12 leading-[1.7] pointer-events-auto cursor-default"
        >
          We engineer intelligent systems that transform raw data into competitive advantage. From custom AI agents to real-time analytics — we build what others can&apos;t.
        </motion.p>
        
        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto w-full max-w-lg mx-auto"
        >
          <a href="#discovery" className="w-full sm:w-auto">
            <Button className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)] text-[#030303] hover:scale-[1.02] hover:brightness-110 font-bold px-10 py-6 rounded-full text-[15px] tracking-wide border-0 transition-all duration-300"
                    style={{ boxShadow: "0 0 20px rgba(0, 204, 255, 0.3)" }}>
              Start Your Project <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
          <a href="#case-studies" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full glass border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:text-white px-10 py-6 rounded-full text-[15px] tracking-wide transition-all duration-300">
              View Our Work <ExternalLink className="w-4 h-4 ml-2 text-zinc-400" />
            </Button>
          </a>
        </motion.div>

        {/* Bento Grid Stats */}
        {/* Bento Grid Stats */}
        <motion.div 
          className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full mx-auto pointer-events-auto relative z-10 px-2 lg:px-0"
          style={{ y: useTransform(scrollY, [0, 800], [0, -40]), willChange: 'transform' }}
        >
          {statsData.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass p-6 sm:p-7 transition-all duration-500 group relative overflow-hidden text-left"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--accent-glow)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  initial={{ scale: 0.6 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-[var(--accent-glow)]/30 transition-colors duration-300"
                >
                  <stat.icon className="w-5 h-5 text-[var(--accent-glow)]" />
                </motion.div>
              </div>
              <AnimatedCounter value={stat.value} delay={i * 150} />
              <div className="text-[10px] sm:text-[11px] text-zinc-400 tracking-[0.2em] font-medium uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className="w-5 h-5 text-zinc-500 hover:text-white transition-colors" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ===== ABOUT US SECTION =====
function AboutUsSection() {
  return (
    <section id="about" className="py-32 sm:py-40 px-4 sm:px-6 relative border-t border-white/5 overflow-hidden">
      {/* High-tech wave pattern background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.15)_0%,transparent_70%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 229, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Radiant glow spots */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[clamp(20rem,40vw,40rem)] aspect-square bg-[var(--accent-primary)] rounded-full opacity-[0.02] blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[clamp(20rem,40vw,40rem)] aspect-square bg-[var(--accent-secondary)] rounded-full opacity-[0.02] blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ margin: '-80px' }}
        transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 14 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="glass p-10 sm:p-16 rounded-3xl border border-white/5">
          <AnimatedSection>
            {/* Label */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-8 bg-[var(--accent-primary)] rounded-full shadow-[0_0_15px_rgba(0,240,255,0.6)]" />
              <h2 className="text-[var(--accent-primary)] text-xs font-black tracking-[0.2em] font-mono uppercase" style={{ textShadow: "0 0 20px rgba(0,240,255,0.4)" }}>
                ABOUT US
              </h2>
            </div>

            {/* Main Heading */}
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-16 leading-[1.2] max-w-4xl tracking-tight" style={{ textShadow: "0 0 40px rgba(0,240,255,0.4)" }}>
              We are a hybrid software company built by a team of obsessively detailed professionals.
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-20">
              {/* Left Column */}
              <div className="space-y-8">
                <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
                  <strong className="text-white font-semibold tracking-wide">Signal Zero</strong> creates its own products and helps startups and businesses grow with strong software solutions.
                </p>
                <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
                  We focus on <strong className="text-white font-semibold">clean design, reliable execution, and friendly communication.</strong>
                </p>
              </div>

              {/* Right Column */}
              <div className="space-y-10">
                <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
                  Our goal is simple. Build tools that solve real problems and support companies that want to scale with technology.
                </p>

                <div className="flex items-center gap-5 mt-4 pt-8 border-t border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center border border-[var(--accent-primary)]/30 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                    <Code className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <p className="text-[var(--accent-primary)] font-mono text-sm sm:text-base tracking-[0.05em] font-bold" style={{ textShadow: "0 0 20px rgba(0,240,255,0.4)" }}>
                    "Simplicity is the ultimate sophistication."
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </motion.div>
    </section>
  );
}

// ===== SERVICES SECTION =====
function ServicesSection() {
  return (
    <section id="services" className="py-32 sm:py-40 px-4 sm:px-6 relative">
      <div className="absolute top-0 right-0 w-[clamp(15rem,30vw,30rem)] aspect-square bg-[var(--accent-secondary)] rounded-full opacity-[0.02] blur-[150px]" />
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <Badge variant="outline" className="mb-4 border-[var(--accent-secondary)]/30 text-[var(--accent-secondary)] bg-[var(--accent-secondary)]/5 px-5 py-1.5 text-xs font-mono tracking-[0.05em] uppercase rounded-full font-semibold">
            <Layers className="w-3.5 h-3.5 mr-2" /> WHAT WE BUILD
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 uppercase" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            Core Engineering{' '}<span className="gradient-text">Capabilities</span>
          </h2>
          <p className="text-gray-300 max-w-[65ch] mx-auto leading-[1.6] text-base sm:text-lg">From concept to deployment, we deliver end-to-end solutions across the full technology spectrum.</p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32 sm:mb-40">
          {SERVICES.map((service, i) => {
            const directions = [
              { x: -150, y: -150 }, // Top-Left
              { x: 0, y: -200 },    // Top
              { x: 150, y: -150 },  // Top-Right
              { x: -150, y: 150 },  // Bottom-Left
              { x: 0, y: 200 },     // Bottom
              { x: 150, y: 150 }    // Bottom-Right
            ];
            const startPos = directions[i % directions.length];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: startPos.x, y: startPos.y }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ margin: '-80px' }}
                transition={{ duration: 0.8, delay: i * 0.1, type: "spring", stiffness: 60, damping: 14 }}
              >
                <TiltCard>
                  <div className="glass rounded-2xl p-7 h-full border border-white/5 hover:border-white/10 transition-all duration-500 group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${service.color}12` }}>
                      <service.icon className="w-6 h-6" style={{ color: service.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--accent-primary)] transition-colors tracking-tight leading-tight">{service.title}</h3>
                    <p className="text-base text-gray-300 mb-6 leading-[1.6]">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.tech.map(t => (
                        <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5 font-mono tracking-[0.05em] uppercase">{t}</span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
        {/* Premium Animated Process Timeline */}
        <OurProcessSection />
      </div>
    </section>
  );
}

// ===== OUR PROCESS SECTION - PREMIUM TIMELINE =====
function OurProcessSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const sectionScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.82, 1, 0.92]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.35, 1, 1, 0.5]);
  const sectionY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80]);

  const steps = [
    {
      id: 1, title: 'Ideation', description: 'We brainstorm and refine your concept.', color: '#00e5ff',
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/><circle cx="12" cy="12" r="4"/></svg>
    },
    {
      id: 2, title: 'Scope', description: 'Defining clear requirements and roadmap.', color: '#a855f7',
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    },
    {
      id: 3, title: 'Design', description: 'Creating intuitive and beautiful interfaces.', color: '#f43f8e',
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.94c1.88 0 3.05-1.04 3.05-2.08 0-1.1-1.12-1.48-1.57-2.67a5 5 0 0 1-4.14-7.58c.24-.4.8-1.3 1.14-1.63a7.41 7.41 0 0 0-1.52-5 9.87 9.87 0 0 0-4.43 2.5 10.4 10.4 0 0 0-2.45 4.5 10.13 10.13 0 0 0 3.23 9.4 14.52 14.52 0 0 0 6.69 2.56z"/><circle cx="6.5" cy="5.5" r=".5"/><circle cx="10" cy="4" r=".5"/><circle cx="13.5" cy="6.5" r=".5"/><circle cx="15.5" cy="10" r=".5"/><circle cx="16" cy="14" r=".5"/></svg>
    },
    {
      id: 4, title: 'Development', description: 'Clean coding with scalable architecture.', color: '#00d68f',
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/><circle cx="12" cy="12" r="3"/></svg>
    },
    {
      id: 5, title: 'Delivery', description: 'Rigorous testing and smooth launch.', color: '#f59e0b',
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5 21 3M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.71-2.13.09-3.09a3 3 0 0 0-3.09.09zM12 15l9 3 3-3-3-9-15-3-3 3 3 9z"/></svg>
    },
    {
      id: 6, title: 'Support', description: 'Ongoing maintenance and improvements.', color: '#3b82f6',
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
    }
  ];

  return (
    <motion.section
      ref={containerRef}
      style={{ scale: sectionScale, opacity: sectionOpacity, y: sectionY }}
      className="py-10 sm:py-20 px-[20px] md:px-[60px]"
    >
      <div className="glass rounded-[40px] px-5 py-10 md:p-[60px] border border-white/5 overflow-hidden mx-auto max-w-[1200px] w-full flex flex-col relative">
        
        {/* Header */}
        <div className="text-center mb-16 relative z-10 mx-auto max-w-2xl">
          <h3 className="text-[11px] font-mono font-bold text-[var(--accent-primary)] mb-4" style={{ letterSpacing: '0.2em', textShadow: "0 0 20px rgba(0,240,255,0.4)" }}>
            HOW WE WORK
          </h3>
          <h2 className="text-[28px] sm:text-[36px] md:text-[46px] font-extrabold text-[#f0f4ff] mb-6 tracking-tight">
            The Signal Zero Process
          </h2>
          <p className="text-[#8892a4] text-[16px] leading-[1.7]">Six orchestrated steps connecting your concept to a thriving product.</p>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dashMove {
            to { stroke-dashoffset: -100; }
          }
          .process-connector {
            stroke-dasharray: 8 6;
            animation: dashMove 2s linear infinite;
            stroke-width: 2;
            fill: none;
            opacity: 0.8;
          }
          .card-hover-effect {
            transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          }
          .card-hover-effect:hover {
            transform: translateY(-4px);
            border-color: var(--hover-border) !important;
            box-shadow: var(--hover-shadow) !important;
          }
        `}} />

        {/* Global Wrapper for SVG and Grid */}
        <div className="relative w-full z-10">
          
          {/* Desktop SVG Overlay */}
          <div className="hidden md:block absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
            <svg className="w-full h-full pointer-events-none" viewBox="0 0 1080 600" preserveAspectRatio="none" overflow="visible">
              <defs>
                <linearGradient id="g1-2"><stop offset="0%" stopColor={steps[0].color}/><stop offset="100%" stopColor={steps[1].color}/></linearGradient>
                <linearGradient id="g2-3"><stop offset="0%" stopColor={steps[1].color}/><stop offset="100%" stopColor={steps[2].color}/></linearGradient>
                <linearGradient id="g3-4"><stop offset="0%" stopColor={steps[2].color}/><stop offset="100%" stopColor={steps[3].color}/></linearGradient>
                <linearGradient id="g4-5"><stop offset="0%" stopColor={steps[3].color}/><stop offset="100%" stopColor={steps[4].color}/></linearGradient>
                <linearGradient id="g5-6"><stop offset="0%" stopColor={steps[4].color}/><stop offset="100%" stopColor={steps[5].color}/></linearGradient>

                {/* SVG Masks for "Drawing" the paths that contain natively scrolling CSS dashes */}
                <mask id="mask1">
                  <motion.path d="M 328 140 C 344 160, 360 120, 376 140" stroke="white" strokeWidth="8" fill="none"
                               initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false, margin: '-20%' }} transition={{ duration: 0.4, delay: 1 * 0.15 }} />
                </mask>
                <mask id="mask2">
                  <motion.path d="M 704 140 C 720 160, 736 120, 752 140" stroke="white" strokeWidth="8" fill="none"
                               initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false, margin: '-20%' }} transition={{ duration: 0.4, delay: 2 * 0.15 }} />
                </mask>
                <mask id="mask3">
                  <motion.path d="M 1026 140 C 1076 140, 1076 468, 1026 468" stroke="white" strokeWidth="8" fill="none"
                               initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false, margin: '-20%' }} transition={{ duration: 0.6, delay: 3 * 0.15 }} />
                </mask>
                <mask id="mask4">
                  <motion.path d="M 752 468 C 736 488, 720 448, 704 468" stroke="white" strokeWidth="8" fill="none"
                               initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false, margin: '-20%' }} transition={{ duration: 0.4, delay: 4 * 0.15 }} />
                </mask>
                <mask id="mask5">
                  <motion.path d="M 376 468 C 360 488, 344 448, 328 468" stroke="white" strokeWidth="8" fill="none"
                               initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false, margin: '-20%' }} transition={{ duration: 0.4, delay: 5 * 0.15 }} />
                </mask>
              </defs>

              {/* Infinitely Scrolling Dashed Paths tied to the expanding Masks */}
              <path d="M 328 140 C 344 160, 360 120, 376 140" stroke="url(#g1-2)" className="process-connector" mask="url(#mask1)" />
              <path d="M 704 140 C 720 160, 736 120, 752 140" stroke="url(#g2-3)" className="process-connector" mask="url(#mask2)" />
              <path d="M 1026 140 C 1076 140, 1076 468, 1026 468" stroke="url(#g3-4)" className="process-connector" mask="url(#mask3)" />
              <path d="M 752 468 C 736 488, 720 448, 704 468" stroke="url(#g4-5)" className="process-connector" mask="url(#mask4)" />
              <path d="M 376 468 C 360 488, 344 448, 328 468" stroke="url(#g5-6)" className="process-connector" mask="url(#mask5)" />
            </svg>
          </div>

          {/* Core Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-[48px] md:gap-x-[48px] md:gap-y-[48px] w-full relative z-10">
            {steps.map((step) => {
              // Custom grid positions for snake flow
              const isCol3Row2 = step.id === 4;
              const isCol2Row2 = step.id === 5;
              const isCol1Row2 = step.id === 6;
              const gridPlaceClasses = isCol3Row2 ? "md:col-start-3 md:row-start-2" : 
                                       isCol2Row2 ? "md:col-start-2 md:row-start-2" : 
                                       isCol1Row2 ? "md:col-start-1 md:row-start-2" : "";
              
              const isActive = step.id === 1;

              return (
                <motion.div key={step.id} className={`w-full ${gridPlaceClasses}`}
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: false, margin: '-20%' }}
                     transition={{ duration: 0.4, delay: step.id * 0.15 }}
                     style={{ 
                       '--hover-border': `${step.color}66`,
                       '--hover-shadow': `0 0 40px ${step.color}66`
                     }}>
                  {/* Card */}
                  <div
                    className={`card-hover-effect relative flex flex-col items-start p-8 rounded-[20px] ${isActive ? 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.7)] shadow-[0_0_40px_rgba(255,255,255,0.08)]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]'}`}
                    style={{ minHeight: '280px', borderStyle: 'solid', borderWidth: '1px' }}
                  >
                    <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center self-center mb-6 relative z-10"
                         style={{ 
                           border: `2px solid ${step.color}`,
                           background: `${step.color}1a`
                         }}>
                      <div style={{ color: step.color }}>
                        {step.icon}
                      </div>
                    </div>
                    
                    <div className="w-full relative z-10 text-center md:text-left">
                      <div className="font-mono font-bold uppercase mb-2"
                           style={{ letterSpacing: '0.2em', fontSize: '11px', color: step.color, opacity: 0.8 }}>
                        STEP {step.id}
                      </div>
                      <h4 className="text-[22px] font-bold text-[#f0f4ff] mb-2 leading-tight">
                        {step.title}
                      </h4>
                      <p className="text-[14px] leading-[1.7] text-[#8892a4]">
                        {step.description}
                      </p>
                    </div>

                    {/* Mobile Only Dashboard Dashed line */}
                    {step.id !== 6 && (
                      <div className="md:hidden absolute w-[2px] h-[50px] left-1/2 -bottom-[50px] -translate-x-1/2 border-l-2 border-dashed z-0"
                           style={{ borderColor: step.color, opacity: 0.5 }} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </motion.section>
  );
}

// ===== CASE STUDIES =====
// ===== CASE STUDY CARD =====
function CaseStudyCard({ cs, index }) {
  const [activeChartIndex, setActiveChartIndex] = useState(0);
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const rotateZ = useTransform(smoothScroll, [0, 1], [-2, 2]);
  const yOffset = useTransform(smoothScroll, [0, 0.5, 1], [15, 0, -15]);
  const opacity = useTransform(smoothScroll, [0, 0.15, 0.85, 1], [0.3, 1, 1, 0.3]);
  const PARALLAX_VECTORS = [
    { x: 45, y: 30 },
    { x: -35, y: -40 },
    { x: 30, y: -35 },
    { x: -40, y: 45 },
  ];
  const vector = PARALLAX_VECTORS[index % PARALLAX_VECTORS.length];
  const xTransform = useTransform(smoothScroll, [0, 0.15, 0.85, 1], [-vector.x, 0, 0, vector.x]);
  const yParallax = useTransform(smoothScroll, [0, 0.15, 0.85, 1], [-vector.y, 0, 0, vector.y]);

  useEffect(() => {
    let interval;
    if (cs.id === 1) {
      interval = setInterval(() => {
        setActiveChartIndex(prev => (prev === 0 ? 1 : 0));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [cs.id]);

  const renderChart = () => {
    if (cs.id === 1) {
      if (activeChartIndex === 1) {
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={modelComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '8px', color: '#e2e8f0' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="value" fill="var(--accent-secondary)" radius={[6, 6, 0, 0]} barSize={40} isAnimationActive={true} animationDuration={1000}>
                {modelComparisonData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.name === 'Ensemble' ? 'var(--accent-primary)' : 'var(--accent-secondary)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      }
      return (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={cs.data}>
            <defs>
              <linearGradient id={`colorPredicted-${cs.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`colorActual-${cs.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '8px', color: '#e2e8f0' }} />
            <Area type="monotone" dataKey="predicted" stroke="var(--accent-primary)" fill={`url(#colorPredicted-${cs.id})`} strokeWidth={2} isAnimationActive={true} animationDuration={1000} />
            <Area type="monotone" dataKey="actual" stroke="var(--accent-secondary)" fill={`url(#colorActual-${cs.id})`} strokeWidth={2} isAnimationActive={true} animationDuration={1000} />
            <Line type="monotone" dataKey="baseline" stroke="#475569" strokeDasharray="5 5" strokeWidth={1} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
    if (cs.chartType === 'line') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: '-50px' }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={cs.data}>
              <defs>
                <linearGradient id={`colorPredicted-${cs.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id={`colorActual-${cs.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'rgba(26, 26, 46, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,240,255,0.5)', borderRadius: '12px', color: '#e2e8f0', boxShadow: '0 0 20px rgba(0,240,255,0.3), inset 0 0 20px rgba(0,240,255,0.1)' }} />
              <Area type="monotone" dataKey="predicted" stroke="var(--accent-primary)" fill={`url(#colorPredicted-${cs.id})`} strokeWidth={2} isAnimationActive={true} animationDuration={800} />
              <Area type="monotone" dataKey="actual" stroke="var(--accent-secondary)" fill={`url(#colorActual-${cs.id})`} strokeWidth={2} isAnimationActive={true} animationDuration={800} />
              <Line type="monotone" dataKey="baseline" stroke="#475569" strokeDasharray="5 5" strokeWidth={1} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      );
    }
    if (cs.chartType === 'bar') {
      return <AnimatedEfficiencyChart cs={cs} />;
    }
    if (cs.chartType === 'radar') {
      return (
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={cs.data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={11} />
            <PolarRadiusAxis stroke="rgba(255,255,255,0.05)" domain={[0, 100]} tick={false} />
            <Tooltip contentStyle={{ background: 'rgba(26, 26, 46, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,240,255,0.5)', borderRadius: '12px', color: '#e2e8f0', boxShadow: '0 0 20px rgba(0,240,255,0.3), inset 0 0 20px rgba(0,240,255,0.1)' }} />
            <Radar dataKey="value" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.2} strokeWidth={2} isAnimationActive={true} animationDuration={1000} />
          </RadarChart>
        </ResponsiveContainer>
      );
    }
    if (cs.chartType === '3d') {
      const currentModel = cs.models[activeModelIndex];
      return (
        <div className="flex flex-col gap-6 w-full">
          <div className="w-full relative">
            <ModelViewer
              src={currentModel.src}
              alt={currentModel.title}
              autoRotate={true}
            />
          </div>

          <div className="flex items-center justify-between glass py-4 px-7 rounded-2xl border border-white/5 shadow-2xl">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Current Visualization</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">{currentModel.title}</span>
                <div className="flex gap-1.5 ml-2">
                  {cs.models.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeModelIndex ? 'bg-[var(--accent-primary)] w-4' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveModelIndex((activeModelIndex + 1) % cs.models.length)}
              className="flex items-center gap-2 group py-2.5 px-6 rounded-full bg-[var(--accent-primary)]/5 hover:bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] transition-all duration-300 active:scale-95"
            >
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase">Swap Perspective</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: xTransform, y: yParallax, opacity: opacity }}
      className="glass rounded-2xl border border-white/5 overflow-hidden w-full relative z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[min(37.5rem,80vh)]">
        {/* Content Panel */}
        <div className="p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight" style={{ textShadow: '0 0 30px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.3)' }}>{cs.title}</h3>
            {/* Logos fully removed per user request */}
          </div>

          <p className="text-gray-300 mb-10 leading-[1.6] text-lg max-w-[65ch]">{cs.description}</p>

          <div className="grid gap-8 mb-10">
            <div className="glass p-5 rounded-xl border border-white/5">
              <h4 className="flex items-center text-xs font-mono font-bold text-[var(--accent-primary)] mb-2 tracking-[0.05em] uppercase"><Zap className="w-3.5 h-3.5 mr-2" /> The Challenge</h4>
              <p className="text-sm text-gray-400 leading-[1.6]">{cs.challenge}</p>
            </div>
            <div className="glass p-5 rounded-xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-secondary)] rounded-full opacity-10 blur-xl" />
              <h4 className="flex items-center text-xs font-mono font-bold text-[var(--accent-secondary)] mb-2 tracking-[0.05em] uppercase"><Cpu className="w-3.5 h-3.5 mr-2" /> Our Solution</h4>
              <p className="text-sm text-gray-400 leading-[1.6]">{cs.solution}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-10 border-t border-white/5 pt-8">
            {cs.results.map((r, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-0.5">
                  <Check className="w-4 h-4 text-[#10b981]" />
                </div>
                <span className="text-gray-300 text-sm leading-[1.6]">{r}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            {cs.tech.map(t => (
              <span key={t} className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 text-gray-400 border border-white/5 font-mono tracking-[0.05em] uppercase">{t}</span>
            ))}
          </div>
        </div>

        {/* Chart Panel */}
        <div className="p-6 sm:p-12 relative flex flex-col items-center justify-center min-h-[400px] h-full lg:min-h-[400px]">
          <div className="w-full relative z-10 max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-6 pb-4">
              <h4 className="text-[13px] font-mono text-gray-500 font-bold tracking-widest uppercase">
                {cs.id === 1 ? (activeChartIndex === 0 ? 'Performance Metrics' : 'Model Comparison') :
                  cs.id === 2 ? 'Data Processing Efficiency' :
                    cs.id === 3 ? 'RAG System Metrics' : 'Interactive 3D Visuals'}
              </h4>
              {cs.id === 1 && (
                <div className="flex gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeChartIndex === 0 ? 'bg-[var(--accent-primary)] w-3' : 'bg-white/20'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeChartIndex === 1 ? 'bg-[var(--accent-secondary)] w-3' : 'bg-white/20'}`} />
                </div>
              )}
            </div>
            <motion.div
              key={`chart-${cs.id}-${activeChartIndex}-${activeModelIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className={`flex items-center justify-center w-full min-h-[16rem]`}
            >
              {renderChart()}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===== CASE STUDIES SECTION =====
function CaseStudiesSection() {
  return (
    <section id="case-studies" className="py-32 sm:py-40 px-4 sm:px-6 relative">
      {/* Background glow wrapped to prevent overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[clamp(20rem,40vw,40rem)] aspect-square bg-[var(--accent-primary)] rounded-full opacity-[0.02] blur-[150px]" />
      </div>
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <Badge variant="outline" className="mb-4 border-[var(--accent-primary)]/30 text-[var(--accent-primary)] bg-[var(--accent-primary)]/5 px-5 py-1.5 text-xs font-mono tracking-[0.05em] uppercase rounded-full font-semibold">
            <Target className="w-3.5 h-3.5 mr-2" /> PROVEN RESULTS
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 uppercase" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            Case{' '}<span className="gradient-text">Studies</span>
          </h2>
          <p className="text-gray-300 max-w-[65ch] mx-auto leading-[1.6] text-base">Real-world projects that demonstrate our engineering depth and measurable impact.</p>
        </AnimatedSection>

        <div className="flex flex-col gap-12 lg:gap-24">
          {CASE_STUDIES.map((cs, i) => (
            <CaseStudyCard key={cs.id} cs={cs} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== FOUNDER SECTION =====
function FounderSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  return (
    <motion.section
      ref={containerRef}
      id="founder"
      className="py-32 sm:py-40 px-4 sm:px-6 relative overflow-hidden bg-black"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(15rem,30vw,30rem)] aspect-square bg-[var(--accent-secondary)] rounded-full opacity-[0.03] blur-[120px]" />
      <div className="max-w-6xl mx-auto" style={{ perspective: '1000px' }}>
        <AnimatedSection className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-[#ec4899]/30 text-[#ec4899] bg-[#ec4899]/5 px-5 py-1.5 text-xs font-mono tracking-[0.05em] uppercase rounded-full font-semibold">
            <Users className="w-3.5 h-3.5 mr-2" /> LEADERSHIP
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            Meet the{' '}<span className="gradient-text-warm">Founder</span>
          </h2>
        </AnimatedSection>
        <motion.div
          initial={{ opacity: 0, rotateX: 15, y: 40, z: -50 }} 
          whileInView={{ opacity: 1, rotateX: 0, y: 0, z: 0 }} 
          exit={{ opacity: 0, rotateX: -15, y: -40, z: -50 }} 
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative z-10"
        >
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Photo */}
              <div className="lg:col-span-2 relative overflow-hidden">
                <div className="aspect-square lg:aspect-auto lg:h-full relative">
                  <img src="/founder.png" alt="Eppa Sai Vardhan Reddy" className="w-full h-full object-cover object-top opacity-90 mix-blend-screen" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] via-transparent to-transparent" />
                </div>
              </div>
              {/* Bio */}
              <div className="lg:col-span-3 p-6 sm:p-10 flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight leading-tight">Eppa Sai Vardhan Reddy</h3>
                <p className="text-[var(--accent-primary)] font-mono mb-5 text-xs tracking-[0.05em] uppercase font-semibold">Founder & Chief Architect</p>
                <p className="text-gray-300 leading-[1.6] mb-8 max-w-[65ch] text-base">
                  Adaptable and results-oriented Data Science and AI professional with deep expertise in machine learning, NLP, and predictive modeling.
                  A NASA Space Settlement Awardee (World 2nd Prize) and published IEEE researcher, with a proven track record of building AI systems
                  that deliver measurable business impact.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">NASA Space Settlement</p>
                      <p className="text-xs text-gray-500">World 2nd Prize, 2018</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-[var(--accent-secondary)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">Published Research</p>
                      <p className="text-xs text-gray-500">IEEE ICOECA 2024, IRJMETS 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-[#ec4899] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">AI & ML Specialist</p>
                      <p className="text-xs text-gray-500">TensorFlow, Keras, Scikit-learn, NLP</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">Govt AI Projects</p>
                      <p className="text-xs text-gray-500">T-SAT, Govt. of Telangana</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Python', 'TensorFlow', 'React', 'SQL', 'Power BI', 'Figma', 'NLP', 'Deep Learning'].map(s => (
                    <span key={s} className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <a href="mailto:eppasaivardhanreddy@gmail.com" className="text-gray-400 hover:text-[var(--accent-primary)] transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/eppa-sai-vardhan-reddy-5b71213a4" className="text-gray-400 hover:text-[var(--accent-primary)] transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <span className="text-sm text-gray-500 ml-2"><MapPin className="w-3.5 h-3.5 inline mr-1" />Hyderabad, India</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ===== DISCOVERY FORM =====
function DiscoveryForm() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const essentialsX = useTransform(scrollYProgress, [0, 0.5, 1], [-20, 0, 20]);
  const essentialsY = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '', company: '', website: '', email: '',
    services: [],
    elevatorPitch: '', budgetTier: '', timeline: '',
    dataState: '', aiReadiness: [5],
  });

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleService = (id) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(id) ? prev.services.filter(s => s !== id) : [...prev.services, id],
    }));
  };

  const canProceed = () => {
    if (step === 1) return form.fullName && form.email;
    if (step === 2) return form.services.length > 0;
    if (step === 3) return form.elevatorPitch && form.budgetTier && form.timeline;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = { ...form, aiReadiness: form.aiReadiness[0] };
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.section id="discovery" ref={containerRef} className="py-24 sm:py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <div className="glass rounded-2xl border border-[#10b981]/20 p-10">
              <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-[#10b981]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Project Inquiry Received!</h3>
              <p className="text-gray-400 mb-6">Thank you, {form.fullName}. We&apos;ve sent a confirmation to {form.email}. Our team will review your project details and get back to you within 24 hours.</p>
              <Button onClick={() => { setSubmitted(false); setStep(1); setForm({ fullName: '', company: '', website: '', email: '', services: [], elevatorPitch: '', budgetTier: '', timeline: '', dataState: '', aiReadiness: [5] }); }} variant="outline" className="border-white/20 text-white hover:border-[var(--accent-primary)]/50">
                Submit Another Inquiry
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section id="discovery" ref={containerRef} className="py-32 sm:py-40 px-4 sm:px-6 relative overflow-hidden bg-black">
      <div className="absolute top-0 left-0 w-[clamp(10rem,25vw,25rem)] aspect-square bg-[var(--accent-primary)] rounded-full opacity-[0.02] blur-[120px]" />
      <div className="max-w-3xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <Badge variant="outline" className="mb-4 border-[var(--accent-primary)]/30 text-[var(--accent-primary)] bg-[var(--accent-primary)]/5 px-5 py-1.5 text-xs font-mono tracking-[0.05em] uppercase rounded-full font-semibold">
            <Zap className="w-3.5 h-3.5 mr-2" /> PROJECT DISCOVERY
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 uppercase" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            Start Your{' '}<span className="gradient-text">Project</span>
          </h2>
          <p className="text-gray-300 max-w-[65ch] mx-auto leading-[1.6]">Tell us about your project and we&apos;ll craft a tailored solution.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          {/* Progress bar */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${s < step ? 'bg-[var(--accent-primary)] text-black' : s === step ? 'border-2 border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border border-white/20 text-gray-500'
                  }`}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 4 && <div className={`w-10 sm:w-16 h-0.5 mx-1 transition-all duration-300 ${s < step ? 'bg-[var(--accent-primary)]' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl border border-white/5 p-8 sm:p-10" style={{ perspective: '1000px' }}>
            <AnimatePresence mode="wait">
              {/* Step 1: Essentials */}
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  initial={{ opacity: 0, rotateX: 90, y: 50, z: -100 }} 
                  whileInView={{ opacity: 1, rotateX: 0, y: 0, z: 0 }} 
                  exit={{ opacity: 0, rotateX: -90, y: -50, z: -100 }} 
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                  className="glass p-6 sm:p-8 rounded-2xl border border-white/5"
                >
                  <h3 className="text-xl font-semibold text-white mb-6">The Essentials</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block">Full Name *</label>
                      <Input value={form.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="John Doe" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[var(--accent-primary)]/50" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm text-gray-400 mb-1.5 block">Company Name</label>
                        <Input value={form.company} onChange={e => updateField('company', e.target.value)} placeholder="Acme Inc." className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[var(--accent-primary)]/50" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1.5 block">Company Website</label>
                        <Input value={form.website} onChange={e => updateField('website', e.target.value)} placeholder="https://acme.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[var(--accent-primary)]/50" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block">Work Email *</label>
                      <Input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="john@acme.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[var(--accent-primary)]/50" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Services */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h3 className="text-xl font-semibold text-white mb-2">Core Engineering Selection</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => toggleService(s.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 text-left ${form.services.includes(s.id)
                          ? 'border-[var(--accent-primary)]/50 bg-[var(--accent-primary)]/5'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                          }`}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15` }}>
                          <s.icon className="w-4 h-4" style={{ color: s.color }} />
                        </div>
                        <span className={`text-sm font-medium ${form.services.includes(s.id) ? 'text-white' : 'text-gray-400'}`}>{s.title}</span>
                        {form.services.includes(s.id) && <Check className="w-4 h-4 text-[var(--accent-primary)] ml-auto" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Parameters */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h3 className="text-xl font-semibold text-white mb-6">Project Parameters</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block">Elevator Pitch *</label>
                      <Textarea
                        value={form.elevatorPitch}
                        onChange={e => updateField('elevatorPitch', e.target.value)}
                        placeholder="In 2-3 sentences, what is the core problem you are trying to solve?"
                        rows={3}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[var(--accent-primary)]/50 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm text-gray-400 mb-1.5 block">Budget Tier *</label>
                        <select
                          value={form.budgetTier}
                          onChange={e => updateField('budgetTier', e.target.value)}
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--accent-primary)]/50 focus:outline-none appearance-none"
                        >
                          <option value="" className="bg-[#0a0a0f]">Select budget range</option>
                          {BUDGET_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0a0a0f]">{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1.5 block">Timeline *</label>
                        <select
                          value={form.timeline}
                          onChange={e => updateField('timeline', e.target.value)}
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--accent-primary)]/50 focus:outline-none appearance-none"
                        >
                          <option value="" className="bg-[#0a0a0f]">Select timeline</option>
                          {TIMELINE_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0a0a0f]">{o}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Deep Context */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h3 className="text-xl font-semibold text-white mb-2">Deep Context</h3>
                  <p className="text-sm text-gray-400 mb-6">Help us understand your current state better.</p>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-gray-400 mb-3 block">What state is your company&apos;s data currently in?</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {DATA_STATE_OPTIONS.map(opt => (
                          <button
                            key={opt}
                            onClick={() => updateField('dataState', opt)}
                            className={`p-3 rounded-xl border text-sm text-left transition-all duration-300 ${form.dataState === opt ? 'border-[var(--accent-primary)]/50 bg-[var(--accent-primary)]/5 text-white' : 'border-white/5 text-gray-400 hover:border-white/10'
                              }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-3 block">How AI-Ready are your business operations?</label>
                      <div className="px-2">
                        <Slider
                          value={form.aiReadiness}
                          onValueChange={val => updateField('aiReadiness', val)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-gray-500">1 - Not at all</span>
                          <span className="text-sm font-mono text-[var(--accent-primary)]">{form.aiReadiness[0]}/10</span>
                          <span className="text-xs text-gray-500">10 - Fully ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              <Button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                variant="outline"
                className={`border-white/10 text-gray-400 hover:text-white ${step === 1 ? 'invisible' : ''}`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              {step < 4 ? (
                <Button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="bg-[var(--accent-primary)] text-black hover:bg-[#00d4e0] disabled:opacity-30 font-semibold"
                >
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-[var(--accent-primary)] text-black hover:bg-[#00d4e0] disabled:opacity-50 font-semibold px-8"
                >
                  {submitting ? 'Submitting...' : 'Submit Inquiry'} {!submitting && <Send className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </motion.section>
  );
}

// ===== MARKDOWN RENDERER FOR CHAT =====
function ChatMarkdown({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        // Bullet points
        if (trimmed.match(/^[-*•]\s/)) {
          const content = trimmed.replace(/^[-*•]\s/, '');
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="text-[var(--accent-primary)] text-[10px] mt-[5px] flex-shrink-0">●</span>
              <span>{renderInline(content)}</span>
            </div>
          );
        }
        // Numbered list
        if (trimmed.match(/^\d+[\.\)]\s/)) {
          const num = trimmed.match(/^(\d+)[\.\)]\s/)[1];
          const content = trimmed.replace(/^\d+[\.\)]\s/, '');
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="text-[var(--accent-primary)] text-xs font-mono mt-[1px] flex-shrink-0 w-4">{num}.</span>
              <span>{renderInline(content)}</span>
            </div>
          );
        }
        return <p key={i}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

function renderInline(text) {
  // Split by **bold** patterns
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    // Handle *italic*
    const italicParts = part.split(/(\*[^*]+\*)/g);
    if (italicParts.length > 1) {
      return italicParts.map((ip, j) => {
        if (ip.startsWith('*') && ip.endsWith('*') && ip.length > 2) {
          return <em key={`${i}-${j}`} className="italic text-gray-200">{ip.slice(1, -1)}</em>;
        }
        return ip;
      });
    }
    return part;
  });
}

// ===== CHAT WIDGET =====
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('default');
  useEffect(() => {
    setSessionId(`chat_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  }, []);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'model', text: 'Hey! I\'m Signal Zero\'s AI assistant. Ask me anything about our services, process, or how we can help with your project.' }]);
    }
  }, [open, messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, sessionId }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'model', text: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again or use our Project Discovery form.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] right-6 z-50 w-14 h-14 rounded-full bg-[var(--accent-primary)] text-[#050810] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/30 hover:scale-110 transition-transform"
        whileTap={{ scale: 0.9 }}
      >
        {open ? <X className="w-6 h-6 stroke-[3px]" /> : <MessageSquare className="w-6 h-6 stroke-[2.5px]" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] glass-strong rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Signal Zero AI</p>
                  <p className="text-xs text-gray-400">Ask about our services</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="h-[350px] overflow-y-auto p-4 space-y-3 chat-scroll">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user'
                    ? 'bg-[var(--accent-primary)] text-black rounded-br-md'
                    : 'bg-white/5 text-[#9CA3AF] rounded-bl-md border border-white/5'
                    }`}>
                    {msg.role === 'user' ? msg.text : <ChatMarkdown text={msg.text} />}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5">
              <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about our services..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 text-sm flex-1 focus:border-[var(--accent-primary)]/50"
                />
                <Button type="submit" disabled={!input.trim() || loading} className="bg-[var(--accent-primary)] text-black hover:bg-[#00d4e0] px-3 disabled:opacity-30">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ===== COOKIE BANNER =====
function CookieBanner() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);
  const [prefs, setPrefs] = useState({ essential: true, analytics: false, marketing: false });

  useEffect(() => {
    const consent = localStorage.getItem('sz_cookie_consent');
    if (!consent) setShow(true);
  }, []);

  const acceptAll = () => {
    localStorage.setItem('sz_cookie_consent', JSON.stringify({ essential: true, analytics: true, marketing: true }));
    setShow(false);
  };
  const rejectAll = () => {
    localStorage.setItem('sz_cookie_consent', JSON.stringify({ essential: true, analytics: false, marketing: false }));
    setShow(false);
  };
  const savePrefs = () => {
    localStorage.setItem('sz_cookie_consent', JSON.stringify(prefs));
    setShow(false);
    setShowDetails(false);
  };

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[100] pt-4 px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
          >
            <div className="max-w-4xl mx-auto glass-strong rounded-2xl border border-white/10 p-6">
              {!showDetails ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-[var(--accent-primary)]" />
                      <span className="text-sm font-semibold text-white">Cookie Preferences</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We use cookies to enhance your browsing experience. You can customize your preferences or accept all.
                      <button onClick={() => setShowPrivacy(true)} className="text-[var(--accent-primary)] hover:underline ml-1">Privacy Policy</button>
                      {' | '}
                      <button onClick={() => setShowImpressum(true)} className="text-[var(--accent-primary)] hover:underline">Impressum</button>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button onClick={() => setShowDetails(true)} variant="outline" className="border-white/10 text-gray-400 text-xs h-9 px-4 hover:text-white">Customize</Button>
                    <Button onClick={rejectAll} variant="outline" className="border-white/10 text-gray-400 text-xs h-9 px-4 hover:text-white">Reject All</Button>
                    <Button onClick={acceptAll} className="bg-[var(--accent-primary)] text-black text-xs h-9 px-4 font-semibold hover:bg-[#00d4e0]">Accept All</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4">Cookie Settings</h4>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div><p className="text-sm text-white">Essential Cookies</p><p className="text-xs text-gray-500">Required for the website to function</p></div>
                      <span className="text-xs text-gray-400">Always on</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div><p className="text-sm text-white">Analytics Cookies</p><p className="text-xs text-gray-500">Help us understand usage patterns</p></div>
                      <button onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))} className={`w-10 h-5 rounded-full transition-colors ${prefs.analytics ? 'bg-[var(--accent-primary)]' : 'bg-white/20'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${prefs.analytics ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div><p className="text-sm text-white">Marketing Cookies</p><p className="text-xs text-gray-500">Used for targeted advertising</p></div>
                      <button onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))} className={`w-10 h-5 rounded-full transition-colors ${prefs.marketing ? 'bg-[var(--accent-primary)]' : 'bg-white/20'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${prefs.marketing ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => setShowDetails(false)} variant="outline" className="border-white/10 text-gray-400 text-xs h-9">Back</Button>
                    <Button onClick={savePrefs} className="bg-[var(--accent-primary)] text-black text-xs h-9 px-6 font-semibold">Save Preferences</Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#0d0d15] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Privacy Policy</h3>
                <button onClick={() => setShowPrivacy(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="text-sm text-gray-400 space-y-4 leading-relaxed">
                <p><strong className="text-white">Data Collection:</strong> We collect information you provide through our Project Discovery form, including your name, email, company details, and project requirements. This data is used solely to evaluate your project needs and provide tailored solutions.</p>
                <p><strong className="text-white">Cookie Usage:</strong> We use essential cookies for site functionality, analytics cookies to understand usage patterns, and optional marketing cookies for personalized experiences. You can control these through our cookie preferences.</p>
                <p><strong className="text-white">Third-Party Services:</strong> We use Google Gemini AI for our chatbot assistant and Resend for email notifications. These services process data according to their respective privacy policies.</p>
                <p><strong className="text-white">Data Storage:</strong> Your data is stored securely in our database with industry-standard encryption. We retain data only as long as necessary for business purposes.</p>
                <p><strong className="text-white">Your Rights (GDPR):</strong> Under GDPR, you have the right to access, rectify, erase, restrict processing, and port your data. Contact us at eppasaivardhanreddy@gmail.com to exercise these rights.</p>
                <p><strong className="text-white">Contact:</strong> Signal Zero, Hyderabad, India. Email: eppasaivardhanreddy@gmail.com</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Impressum Modal */}
      <AnimatePresence>
        {showImpressum && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#0d0d15] border border-white/10 rounded-2xl max-w-lg w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Impressum</h3>
                <button onClick={() => setShowImpressum(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="text-sm text-gray-400 space-y-3 leading-relaxed">
                <p><strong className="text-white">Company:</strong> Signal Zero</p>
                <p><strong className="text-white">Founder & Owner:</strong> Eppa Sai Vardhan Reddy</p>
                <p><strong className="text-white">Address:</strong> Hyderabad, Telangana, India</p>
                <p><strong className="text-white">Email:</strong> eppasaivardhanreddy@gmail.com</p>
                <p><strong className="text-white">Phone:</strong> (+91) 9347302648</p>
                <p><strong className="text-white">Service:</strong> AI & Data Engineering Consulting and Development</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ===== FOOTER =====
function Footer() {
  return (
    <footer className="py-16 px-4 sm:px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <SignalZeroLogo className="w-8 h-8" />
              <div>
                <span className="text-white font-bold tracking-widest">SIGNAL</span>
                <span className="text-[var(--accent-primary)] font-bold tracking-widest ml-1">ZERO</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-4">
              Engineering intelligent systems that transform raw data into competitive advantage. Premium AI & Data solutions for forward-thinking businesses.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:eppasaivardhanreddy@gmail.com" className="text-gray-500 hover:text-[var(--accent-primary)] transition-colors"><Mail className="w-4 h-4" /></a>
              <a href="https://www.linkedin.com/in/eppa-sai-vardhan-reddy-5b71213a4" className="text-gray-500 hover:text-[var(--accent-primary)] transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="text-gray-500 hover:text-[var(--accent-primary)] transition-colors"><Globe className="w-4 h-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">SERVICES</h4>
            <ul className="space-y-2.5">
              {SERVICES.map(s => (
                <li key={s.id}><a href="#services" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">{s.title}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">COMPANY</h4>
            <ul className="space-y-2.5">
              <li><a href="#case-studies" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Case Studies</a></li>
              <li><a href="#founder" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">About the Founder</a></li>
              <li><a href="#discovery" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Start a Project</a></li>
              <li><button className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</button></li>
              <li><button className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Impressum</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Signal Zero. All rights reserved.</p>
          <p className="text-xs text-gray-600">Hyderabad, India</p>
        </div>
      </div>
    </footer>
  );
}

// ===== HOME PAGE =====
export default function Home() {
  return (
    <main className="bg-[#030303] text-white min-h-screen overflow-x-hidden relative">
      {/* 2% Noise Texture Overlay */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.02]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      <div className="relative flex flex-col min-h-safe w-full pb-safe">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#050505] to-[#030303]" />
          <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[clamp(20rem,50vw,56rem)] aspect-square bg-[var(--accent-glow)] rounded-full opacity-[0.035] blur-[150px] mix-blend-screen" />
          <div className="absolute top-1/4 right-1/4 w-[clamp(15rem,30vw,31rem)] aspect-square bg-[#60efff] rounded-full opacity-[0.045] blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-1/4 left-1/3 w-[clamp(12rem,25vw,25rem)] aspect-square bg-[var(--accent-glow)] rounded-full opacity-[0.025] blur-[100px] mix-blend-screen" />
          <SignalWaveCanvas />
        </div>
        <Navigation />
        <HeroSection />
      </div>
      <AboutUsSection />
      <ServicesSection />
      <CaseStudiesSection />
      <FounderSection />
      <DiscoveryForm />
      <Footer />
      <ChatWidget />
      <CookieBanner />
    </main>
  );
}
