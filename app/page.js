"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
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
  MousePointer, ArrowDown, Star, Box, Search
} from 'lucide-react';
import ModelViewer from '@/components/ModelViewer';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell
} from 'recharts';

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
    icon: Code, color: '#00f0ff',
    tech: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'MongoDB'],
  },
  {
    id: 'ai', title: 'Custom AI Agent / RAG Pipeline',
    description: 'Intelligent AI agents trained on your data, enabling conversational AI, document Q&A, and automated decision-making.',
    icon: Brain, color: '#8b5cf6',
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
      <circle cx="24" cy="24" r="22" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />
      <circle cx="24" cy="24" r="16" stroke="#00f0ff" strokeWidth="1.5" opacity="0.6" />
      <path d="M 8 24 Q 13 14, 18 24 Q 23 34, 28 24 Q 33 14, 38 24" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2.5" fill="#00f0ff" />
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

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleLeave);

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

    function animate() {
      time += 0.014;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
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
          if (dist < FLATTEN_RADIUS) {
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
        ctx.strokeStyle = '#00f0ff';
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
            ctx.strokeStyle = `rgba(0, 240, 255, ${stemOp})`;
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
        ctx.strokeStyle = `rgba(0, 240, 255, ${rowOp * 0.45})`;
        ctx.lineWidth = Math.max(0.5, 1.8 * rowData[0].scale);
        ctx.stroke();

        // Data points removed to look clean
      }

      // 3. Cursor "zero zone" indicator
      if (mx > 0 && mx < W && my > 0 && my < H) {
        // Subtle radial indicator
        const zg = ctx.createRadialGradient(mx, my, 0, mx, my, FLATTEN_RADIUS);
        zg.addColorStop(0, 'rgba(0, 240, 255, 0.025)');
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
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Inner ring
        ctx.beginPath();
        ctx.arc(mx, my, FLATTEN_RADIUS * 0.35, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Crosshair at cursor
        const ch = 8;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
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
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min((window.scrollY / docHeight) * 100, 100));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'Founder', href: '#founder' },
    { label: 'Contact', href: '#discovery' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-strong py-3' : 'py-5'}`}>
      {/* Scroll Progress Bar */}
      <div
        className="absolute top-0 left-0 h-[3px] z-[60]"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #00f0ff, #00d4e0)',
          boxShadow: '0 0 8px rgba(0, 240, 255, 0.5), 0 0 2px rgba(0, 240, 255, 0.3)',
          transition: 'width 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'width',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <SignalZeroLogo className="w-9 h-9 transition-transform group-hover:scale-110" />
          <div>
            <span className="text-white font-bold text-lg tracking-widest">SIGNAL</span>
            <span className="text-[#00f0ff] font-bold text-lg tracking-widest ml-1">ZERO</span>
          </div>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <a key={link.href} href={link.href} className="text-[13px] text-[#9CA3AF] hover:text-[#00f0ff] transition-colors duration-300 tracking-[0.05em] font-medium uppercase">
              {link.label}
            </a>
          ))}
          <a href="#discovery">
            <Button className="bg-[#00f0ff] text-black hover:bg-[#00d4e0] font-semibold px-6 rounded-full text-sm">
              Start a Project <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-gray-300 active:text-[#00f0ff] transition-colors py-3 block w-full cursor-pointer">
                  {link.label}
                </a>
              ))}
              <a href="#discovery" onClick={() => setMenuOpen(false)} className="block w-full mt-2">
                <Button className="bg-[#00f0ff] text-black active:bg-[#00d4e0] w-full rounded-full cursor-pointer">Start a Project</Button>
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Deep dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060610] via-[#0a0a1a] to-[#0a0a0f]" />
      {/* Radial ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#00f0ff] rounded-full opacity-[0.025] blur-[150px]" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#8b5cf6] rounded-full opacity-[0.03] blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#00f0ff] rounded-full opacity-[0.015] blur-[100px]" />
      {/* Cinematic Signal Wave Canvas */}
      <SignalWaveCanvas />
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pointer-events-none pt-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <Badge variant="outline" className="mb-8 border-[#00f0ff]/30 text-[#00f0ff] bg-[#00f0ff]/5 px-5 py-1.5 text-[11px] tracking-[0.2em] uppercase rounded-full pointer-events-auto font-medium">
            <Sparkles className="w-3.5 h-3.5 mr-2" /> Integrated AI & Systems Engineering Agency
          </Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase mb-8 flex justify-center items-center gap-4"
          style={{ letterSpacing: '-0.03em', lineHeight: '0.95', opacity: opacityFade }}
        >
          <motion.span
            style={{ x: useTransform(splitX, v => -v) }}
            className="neon-text-white text-white"
          >
            SIGNAL
          </motion.span>
          <motion.span
            style={{ x: splitX }}
            className="neon-text text-[#00f0ff]"
          >
            ZERO
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-xl font-medium text-gray-400 max-w-[55ch] mx-auto mb-12 leading-[1.6] pointer-events-auto cursor-default"
        >
          {"We engineer intelligent systems that transform raw data into competitive advantage. From custom AI agents to real-time analytics — we build what others can't.".split(" ").map((word, i) => (
            <motion.span
              key={i}
              whileHover={{ color: '#ffffff', scale: 1.2, textShadow: "0 0 15px rgba(0,240,255,0.6)", zIndex: 50 }}
              className="inline-block transition-all duration-200 hover:text-white"
              style={{ position: 'relative' }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto"
        >
          <a href="#discovery">
            <Button className="bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00d4e0] font-bold px-10 py-6 rounded-full text-[15px] shadow-lg shadow-[#00f0ff]/20 tracking-wide">
              Start Your Project <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
          <a href="#case-studies">
            <Button variant="outline" className="border-white/20 text-white hover:border-[#00f0ff]/40 hover:text-[#00f0ff] px-10 py-6 rounded-full text-[15px] bg-transparent tracking-wide">
              View Our Work <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </motion.div>
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: '10+', label: 'CLIENTS' },
            { value: '50+', label: 'PROJECTS DELIVERED' },
            { value: '6+', label: 'PRODUCTS BUILDING' },
            { value: '100%', label: 'DELIVERY RATE' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
              <div className="text-[11px] text-[#64748b] mt-2 tracking-[0.15em] font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown className="w-4 h-4 text-[#00f0ff]/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ===== ABOUT US SECTION =====
function AboutUsSection() {
  return (
    <section id="about" className="py-32 sm:py-40 px-6 relative border-t border-white/5 overflow-hidden">
      {/* High-tech wave pattern background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.15)_0%,transparent_70%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Radiant glow spots */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f0ff] rounded-full opacity-[0.02] blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#8b5cf6] rounded-full opacity-[0.02] blur-[150px] pointer-events-none" />

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
              <div className="w-1.5 h-8 bg-[#00f0ff] rounded-full shadow-[0_0_15px_rgba(0,240,255,0.6)]" />
              <h2 className="text-[#00f0ff] text-xs font-black tracking-[0.2em] font-mono uppercase" style={{ textShadow: "0 0 20px rgba(0,240,255,0.4)" }}>
                ABOUT US
              </h2>
            </div>

            {/* Main Heading */}
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-16 leading-[1.2] max-w-4xl tracking-tight" style={{ textShadow: "0 0 40px rgba(0,240,255,0.4)" }}>
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
                  <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 flex items-center justify-center border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                    <Code className="w-6 h-6 text-[#00f0ff]" />
                  </div>
                  <p className="text-[#00f0ff] font-mono text-sm sm:text-base tracking-[0.05em] font-bold" style={{ textShadow: "0 0 20px rgba(0,240,255,0.4)" }}>
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
    <section id="services" className="py-32 sm:py-40 px-6 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8b5cf6] rounded-full opacity-[0.02] blur-[150px]" />
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <Badge variant="outline" className="mb-4 border-[#8b5cf6]/30 text-[#8b5cf6] bg-[#8b5cf6]/5 px-5 py-1.5 text-xs font-mono tracking-[0.05em] uppercase rounded-full font-semibold">
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
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00f0ff] transition-colors tracking-tight leading-tight">{service.title}</h3>
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
      id: 1,
      title: 'Ideation',
      description: 'We brainstorm and refine your concept.',
      color: '#00f0ff',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          {/* Lightbulb icon */}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-13c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 2.5-3 5h2c0-2.5 3-3 3-5 0-2.21-1.79-4-4-4z" />
          <rect x="10" y="19" width="4" height="2" />
          <rect x="10" y="21" width="4" height="1" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Scope',
      description: 'Defining clear requirements and roadmap.',
      color: '#8b5cf6',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          {/* Target/Scope icon */}
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Design',
      description: 'Creating intuitive and beautiful interfaces.',
      color: '#ec4899',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          {/* Palette icon */}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-4 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Development',
      description: 'Clean coding with scalable architecture.',
      color: '#10b981',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          {/* Gears/Building icon */}
          <path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm0-5c-.82 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.68-1.5-1.5-1.5z" />
          <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z" />
        </svg>
      )
    },
    {
      id: 5,
      title: 'Delivery',
      description: 'Rigorous testing and smooth launch.',
      color: '#f59e0b',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          {/* Rocket icon */}
          <path d="M16.6915026,0.421627626 C16.4744481,0.584595767 16.1312458,0.841225559 15.4228455,1.56174899 C14.0139614,2.99788347 12.0109146,5.16798511 8.57219624,8.60670348 C6.5563168,10.6225828 4.70497565,12.6696079 3.27506535,14.5363908 C3.06056004,14.8297088 2.85343677,15.1155892 2.65384347,15.3934041 C1.24763012,17.3520231 0.17392,19.9919981 0.17392,22.8138554 C0.17392,23.4740061 0.753909049,24 1.43683272,24 C2.12036547,24 2.70034788,23.4740061 2.70034788,22.8138554 C2.70034788,20.5313496 3.54471308,18.4230759 4.98504686,16.8824752 C5.18603509,16.6298539 5.39214677,16.3836049 5.60350493,16.1329967 C7.08788331,14.4235184 9.01968152,12.2259256 11.0619303,10.1801513 C14.4450918,6.79717146 16.4206367,4.71509613 17.8047948,3.32926047 C18.4502106,2.68370366 18.8164277,2.31675762 19.0068499,2.12403159 L19.0068499,2.12403159 C19.3676812,1.78039983 19.8825862,1.78039983 20.2434174,2.12403159 C20.6052786,2.46910609 20.6052786,2.98353009 20.2434174,3.32860458 L14.8513219,8.7207002 L14.8513219,8.7207002 C14.8513219,8.7207002 14.6587467,8.91334688 14.4613297,9.11084486 C13.7207309,9.85159812 12.8297568,10.7434253 11.5230451,12.046637 C11.0600582,12.5090904 10.5686046,12.9996951 10.0589046,13.5085316 L10.0589046,13.5085316 C9.40922141,14.1524845 8.61236646,15.0283544 7.93552657,15.8695182 C7.62832829,16.2481231 7.33245093,16.6103196 7.04788334,16.9472944 L7.04788334,16.9472944 C5.99496213,18.3221122 5.17996761,19.3640266 4.58320906,20.2047453 L14.8513219,9.93653247 L14.8513219,9.93653247 C15.2131831,9.59289068 15.7280881,9.59289068 16.0899493,9.93653247 C16.4517106,10.2811966 16.4517106,10.7956206 16.0899493,11.140285 L5.82188129,21.4083475 C6.68338348,20.7184607 7.68961292,19.7627764 8.75254677,18.5900826 C9.14098014,18.1748935 9.5452656,17.738646 9.95761155,17.2733625 L9.95761155,17.2733625 C10.4752168,16.7154127 11.0053903,16.1354604 11.5318045,15.5987274 C12.8385163,14.2954157 13.7294904,13.4035885 14.4701881,12.6628948 C14.6675944,12.4651967 14.8600695,12.272491 15.0474139,12.0850466 L20.4395095,6.692951 C20.4395095,6.692951 20.8057266,6.32633132 21.4511424,5.68077451 C22.1595427,4.95931589 22.5027452,4.70267842 22.7197998,4.53970986 C23.0806311,4.19606809 23.5955361,4.19606809 23.9563673,4.53970986 C24.3182286,4.88435433 24.3182286,5.39877833 23.9563673,5.74341177 L19.6053495,10.0944296 C17.0151656,12.6845835 14.8513219,14.8491087 12.9788708,16.7209508 C12.1054743,17.5938226 11.3241618,18.3731925 10.6299646,19.0661247 C10.0589046,19.6370849 9.54140176,20.1536014 9.08813266,20.6068694 L9.08813266,20.6068694 C8.52551973,21.1703049 8.06919487,21.6273151 7.72001099,21.9758007 C7.25502949,22.4405689 7.25502949,23.1963471 7.72001099,23.6598817 C8.18484245,24.1251761 8.94105449,24.1251761 9.40603598,23.6598817 C9.96865891,23.0976563 10.629332,22.3441636 11.3828739,21.5201128 C12.0770711,20.8264876 12.8583835,20.0479205 13.7317801,19.1740088 C15.6042312,17.3014577 17.7680749,15.1368422 20.3582588,12.5466884 L24.7092766,8.19566654 C25.4176768,7.48713256 25.7848843,7.11846154 26.0019388,6.95549298 C26.362771,6.61185121 26.362771,6.09742721 26.0019388,5.75378544 L26.0019388,5.75378544 Z" />
        </svg>
      )
    },
    {
      id: 6,
      title: 'Support',
      description: 'Ongoing maintenance and improvements.',
      color: '#06b6d4',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          {/* Headset icon */}
          <path d="M12 1C6.48 1 2 5.48 2 11v6h4v4h4v-4h4v4h4v-4h4v-6c0-5.52-4.48-10-10-10zm0 2c4.41 0 8 3.59 8 8v4h-3v-3c0-.55-.45-1-1-1h-2v2h2v2h-4v-2h2v-2h-2c-.55 0-1 .45-1 1v3H4v-4c0-4.41 3.59-8 8-8z" />
        </svg>
      )
    }
  ];

  return (
    <motion.section
      ref={containerRef}
      style={{ scale: sectionScale, opacity: sectionOpacity, y: sectionY }}
      className="py-20 sm:py-32 px-4"
    >
      <div className="glass rounded-3xl p-8 sm:p-20 border border-white/5 overflow-hidden min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-xs font-mono font-bold text-[#00f0ff] mb-4 tracking-[0.2em] uppercase" style={{ textShadow: "0 0 20px rgba(0,240,255,0.4)" }}>
            HOW WE WORK
          </h3>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight" style={{ textShadow: "0 0 40px rgba(0,240,255,0.2)" }}>
            The Signal Zero Process
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">Six orchestrated steps connecting your concept to a thriving product.</p>
        </div>

        {/* Desktop Flowchart - Compact 3x2 Grid with Distinct Signals */}
        <div className="hidden lg:block w-full max-w-[1200px] mx-auto overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex flex-col items-center justify-center relative w-[1200px] min-w-[1200px] mt-4 h-[700px]">

            {/* Background Circuit Traces */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 700">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Intricate traces */}
            <path d="M0 100 L 150 100 L 180 130 L 300 130" fill="none" stroke="#fff" opacity="0.05" strokeWidth="1" />
            <path d="M1200 600 L 1050 600 L 1020 570 L 900 570" fill="none" stroke="#fff" opacity="0.05" strokeWidth="1" />
            <path d="M400 0 L 400 80 L 430 110 L 500 110" fill="none" stroke="#fff" opacity="0.05" strokeWidth="1" />
            <path d="M800 700 L 800 620 L 770 590 L 700 590" fill="none" stroke="#fff" opacity="0.05" strokeWidth="1" />
          </svg>

          {/* Core Signals SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 1200 700">
            <defs>
              <filter id="signalGlowObj">
                <feGaussianBlur stdDeviation="4" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Complex Network Trail Gradients with userSpaceOnUse to prevent Chrome zero-height bug */}
              <linearGradient id="grad12" gradientUnits="userSpaceOnUse" x1="260" y1="200" x2="470" y2="200">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="grad23" gradientUnits="userSpaceOnUse" x1="730" y1="200" x2="940" y2="200">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="grad34" gradientUnits="userSpaceOnUse" x1="940" y1="320" x2="260" y2="480">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="grad45" gradientUnits="userSpaceOnUse" x1="260" y1="600" x2="470" y2="600">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
              <linearGradient id="grad56" gradientUnits="userSpaceOnUse" x1="730" y1="600" x2="940" y2="600">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#00f0ff" />
              </linearGradient>
            </defs>

            {/* Path 1 -> 2 (Curved Stream) */}
            <path d="M 260 180 C 330 230, 400 130, 470 180" stroke="url(#grad12)" strokeWidth="2" opacity="0.2" fill="none" />
            <motion.path d="M 260 180 C 330 230, 400 130, 470 180" stroke="url(#grad12)" strokeWidth="3"
              strokeDasharray="20 40" filter="url(#signalGlowObj)" fill="none"
              animate={{ strokeDashoffset: [0, -60] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />

            {/* Path 2 -> 3 (Curved Stream) */}
            <path d="M 730 180 C 800 230, 870 130, 940 180" stroke="url(#grad23)" strokeWidth="2" opacity="0.2" fill="none" />
            <motion.path d="M 730 180 C 800 230, 870 130, 940 180" stroke="url(#grad23)" strokeWidth="3"
              strokeDasharray="20 40" filter="url(#signalGlowObj)" fill="none"
              animate={{ strokeDashoffset: [0, -60] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />

            {/* Path 3 -> 4 drops BEHIND row gap and emerges */}
            <path d="M 1070 320 T 1070 340 C 1070 380, 850 380, 800 380 L 400 380 C 350 380, 130 380, 130 420 T 130 480"
              fill="none" stroke="url(#grad34)" strokeWidth="2" opacity="0.2" />
            <motion.path d="M 1070 320 T 1070 340 C 1070 380, 850 380, 800 380 L 400 380 C 350 380, 130 380, 130 420 T 130 480"
              fill="none" stroke="url(#grad34)" strokeWidth="3"
              strokeDasharray="20 40" filter="url(#signalGlowObj)"
              animate={{ strokeDashoffset: [0, -60] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />

            {/* Path 4 -> 5 (Curved Stream) */}
            <path d="M 260 580 C 330 630, 400 530, 470 580" stroke="url(#grad45)" strokeWidth="2" opacity="0.2" fill="none" />
            <motion.path d="M 260 580 C 330 630, 400 530, 470 580" stroke="url(#grad45)" strokeWidth="3"
              strokeDasharray="20 40" filter="url(#signalGlowObj)" fill="none"
              animate={{ strokeDashoffset: [0, -60] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />

            {/* Path 5 -> 6 (Curved Stream) */}
            <path d="M 730 580 C 800 630, 870 530, 940 580" stroke="url(#grad56)" strokeWidth="2" opacity="0.2" fill="none" />
            <motion.path d="M 730 580 C 800 630, 870 530, 940 580" stroke="url(#grad56)" strokeWidth="3"
              strokeDasharray="20 40" filter="url(#signalGlowObj)" fill="none"
              animate={{ strokeDashoffset: [0, -60] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />

            {/* Central Glowing Nexus Node (Gap between 2,3 & 5,6) - Moved down out of text way */}
            <g transform="translate(600, 380)">
              {/* Outer pulsing ring */}
              <motion.circle r="30" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.4"
                animate={{ r: [15, 35, 15], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
              <motion.circle r="20" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.6" filter="url(#signalGlowObj)"
                animate={{ r: [10, 25, 10] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
              {/* Core Hub */}
              <circle r="8" fill="#00f0ff" filter="url(#signalGlowObj)" />
              <circle r="3" fill="#ffffff" />
            </g>
          </svg>

          {/* Cards Grid - 3x2 layout with distinct boundaries */}
          <div className="relative z-10 w-full h-[600px] my-auto pt-10">
            {/* Top Row: Cards 1, 2, 3 */}
            <div className="flex justify-between w-full h-[240px]">
              {steps.slice(0, 3).map((step, idx) => (
                <motion.div key={step.id} className="relative w-[260px] h-full group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="glass rounded-xl p-5 border-2 text-center h-full flex flex-col items-center justify-center bg-black/60 backdrop-blur-2xl hover:bg-black/40 transition-colors duration-300"
                    style={{ borderColor: `${step.color}40`, boxShadow: `0 10px 30px -10px ${step.color}20` }}>
                    <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 relative"
                      style={{ background: `${step.color}15`, border: `2px solid ${step.color}80`, color: step.color, boxShadow: `0 0 20px ${step.color}40` }}>
                      {step.icon}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-gray-500 mb-1 tracking-widest uppercase">STEP {step.id}</div>
                    <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-xs text-gray-400 leading-snug">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Huge explicit inter-row spacing for the trail and nexus node to breathe */}
            <div className="h-[120px] w-full" />

            {/* Bottom Row: Cards 4, 5, 6 */}
            <div className="flex justify-between w-full h-[240px]">
              {steps.slice(3).map((step, idx) => (
                <motion.div key={step.id} className="relative w-[260px] h-full group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: '-40px' }}
                  transition={{ duration: 0.5, delay: (idx + 3) * 0.1 }}
                >
                  <div className="glass rounded-xl p-5 border-2 text-center h-full flex flex-col items-center justify-center bg-black/60 backdrop-blur-2xl hover:bg-black/40 transition-colors duration-300"
                    style={{ borderColor: `${step.color}40`, boxShadow: `0 10px 30px -10px ${step.color}20` }}>
                    <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 relative"
                      style={{ background: `${step.color}15`, border: `2px solid ${step.color}80`, color: step.color, boxShadow: `0 0 20px ${step.color}40` }}>
                      {step.icon}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-gray-500 mb-1 tracking-widest uppercase">STEP {step.id}</div>
                    <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-xs text-gray-400 leading-snug">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          </div>
        </div>

        {/* Mobile Flowchart - Full Screen Vertical */}
        <div className="lg:hidden">
          <div className="relative space-y-6">
            {/* SVG curves for mobile */}
            <svg className="absolute inset-0 w-full pointer-events-none" style={{ height: 'auto' }}>
              <defs>
                <linearGradient id="mobileFlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>

            {/* Mobile Cards */}
            <div className="relative z-10 space-y-6">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                >
                  <motion.div
                    className="glass rounded-3xl p-6 border-2 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    style={{ borderColor: `${step.color}33` }}
                    whileHover={{ scale: 1.04, borderColor: step.color, boxShadow: `0 0 30px ${step.color}40` }}
                  >
                    <div className="flex items-center gap-6">
                      {/* Icon */}
                      <motion.div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                        style={{
                          background: `${step.color}20`,
                          border: `3px solid ${step.color}`,
                          color: step.color,
                          boxShadow: `0 0 25px ${step.color}50`
                        }}
                        whileHover={{ scale: 1.15 }}
                      >
                        {step.icon}
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="text-xs font-mono text-gray-500 mb-1 tracking-widest">STEP {step.id}</div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#00f0ff] group-hover:to-[#8b5cf6] transition-all">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Curved arrow between steps */}
                  {idx < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ margin: '-40px' }}
                      transition={{ duration: 0.6, delay: idx * 0.12 + 0.1 }}
                      className="flex justify-center py-3"
                    >
                      <svg className="w-8 h-8 text-[#00f0ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
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
              <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} isAnimationActive={true} animationDuration={1000}>
                {modelComparisonData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.name === 'Ensemble' ? '#00f0ff' : '#8b5cf6'} />
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
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`colorActual-${cs.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '8px', color: '#e2e8f0' }} />
            <Area type="monotone" dataKey="predicted" stroke="#00f0ff" fill={`url(#colorPredicted-${cs.id})`} strokeWidth={2} isAnimationActive={true} animationDuration={1000} />
            <Area type="monotone" dataKey="actual" stroke="#8b5cf6" fill={`url(#colorActual-${cs.id})`} strokeWidth={2} isAnimationActive={true} animationDuration={1000} />
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
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id={`colorActual-${cs.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(26, 26, 46, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,240,255,0.5)', borderRadius: '12px', color: '#e2e8f0', boxShadow: '0 0 20px rgba(0,240,255,0.3), inset 0 0 20px rgba(0,240,255,0.1)' }} />
              <Area type="monotone" dataKey="predicted" stroke="#00f0ff" fill={`url(#colorPredicted-${cs.id})`} strokeWidth={2} isAnimationActive={true} animationDuration={800} />
              <Area type="monotone" dataKey="actual" stroke="#8b5cf6" fill={`url(#colorActual-${cs.id})`} strokeWidth={2} isAnimationActive={true} animationDuration={800} />
              <Line type="monotone" dataKey="baseline" stroke="#475569" strokeDasharray="5 5" strokeWidth={1} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      );
    }
    if (cs.chartType === 'bar') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: '-50px' }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cs.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="source" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={12} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'rgba(26, 26, 46, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,240,255,0.5)', borderRadius: '12px', color: '#e2e8f0', boxShadow: '0 0 20px rgba(0,240,255,0.3), inset 0 0 20px rgba(0,240,255,0.1)' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="before" fill="#475569" radius={[4, 4, 0, 0]} name="Before" isAnimationActive={true} animationDuration={800} />
              <Bar dataKey="after" fill="#00f0ff" radius={[4, 4, 0, 0]} name="After" isAnimationActive={true} animationDuration={800} animationDelay={150} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      );
    }
    if (cs.chartType === 'radar') {
      return (
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={cs.data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={11} />
            <PolarRadiusAxis stroke="rgba(255,255,255,0.05)" domain={[0, 100]} tick={false} />
            <Tooltip contentStyle={{ background: 'rgba(26, 26, 46, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,240,255,0.5)', borderRadius: '12px', color: '#e2e8f0', boxShadow: '0 0 20px rgba(0,240,255,0.3), inset 0 0 20px rgba(0,240,255,0.1)' }} />
            <Radar dataKey="value" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.2} strokeWidth={2} isAnimationActive={true} animationDuration={1000} />
          </RadarChart>
        </ResponsiveContainer>
      );
    }
    if (cs.chartType === '3d') {
      const currentModel = cs.models[activeModelIndex];
      return (
        <div className="flex flex-col gap-6 w-full h-full min-h-[450px]">
          <div className="flex-1 w-full h-full">
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
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeModelIndex ? 'bg-[#00f0ff] w-4' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveModelIndex((activeModelIndex + 1) % cs.models.length)}
              className="flex items-center gap-2 group py-2.5 px-6 rounded-full bg-[#00f0ff]/5 hover:bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] transition-all duration-300 active:scale-95"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[600px]">
        {/* Content Panel */}
        <div className="p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold tracking-tight text-white leading-tight" style={{ textShadow: '0 0 30px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.3)' }}>{cs.title}</h3>
            {/* Logos fully removed per user request */}
          </div>

          <p className="text-gray-300 mb-10 leading-[1.6] text-lg max-w-[65ch]">{cs.description}</p>

          <div className="grid gap-8 mb-10">
            <div className="glass p-5 rounded-xl border border-white/5">
              <h4 className="flex items-center text-xs font-mono font-bold text-[#00f0ff] mb-2 tracking-[0.05em] uppercase"><Zap className="w-3.5 h-3.5 mr-2" /> The Challenge</h4>
              <p className="text-sm text-gray-400 leading-[1.6]">{cs.challenge}</p>
            </div>
            <div className="glass p-5 rounded-xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#8b5cf6] rounded-full opacity-10 blur-xl" />
              <h4 className="flex items-center text-xs font-mono font-bold text-[#8b5cf6] mb-2 tracking-[0.05em] uppercase"><Cpu className="w-3.5 h-3.5 mr-2" /> Our Solution</h4>
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
        <div className="p-8 sm:p-12 relative flex flex-col justify-center min-h-[400px]">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-mono text-gray-500 tracking-wide uppercase" style={{ textShadow: '0 0 15px rgba(0,240,255,0.4)' }}>
                {cs.id === 1 ? (activeChartIndex === 0 ? 'Performance Metrics' : 'Model Comparison') :
                  cs.id === 2 ? 'Data Processing Efficiency' :
                    cs.id === 3 ? 'RAG System Metrics' : 'Interactive 3D Visuals'}
              </h4>
              {cs.id === 1 && (
                <div className="flex gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeChartIndex === 0 ? 'bg-[#00f0ff] w-3' : 'bg-white/10'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeChartIndex === 1 ? 'bg-[#00f0ff] w-3' : 'bg-white/10'}`} />
                </div>
              )}
            </div>
            <motion.div
              style={{ y: yOffset }}
              key={`chart-${cs.id}-${activeChartIndex}-${activeModelIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className={`${cs.chartType === '3d' ? 'w-full h-full min-h-[500px]' : 'min-h-[250px] flex items-center justify-center'}`}
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
    <section id="case-studies" className="py-32 sm:py-40 px-6 relative">
      {/* Background glow wrapped to prevent overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00f0ff] rounded-full opacity-[0.02] blur-[150px]" />
      </div>
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <Badge variant="outline" className="mb-4 border-[#00f0ff]/30 text-[#00f0ff] bg-[#00f0ff]/5 px-5 py-1.5 text-xs font-mono tracking-[0.05em] uppercase rounded-full font-semibold">
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

  const sectionScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.82, 1, 0.92]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.35, 1, 1, 0.5]);
  const sectionY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80]);
  const cardX = useTransform(scrollYProgress, [0, 0.5, 1], [-80, 0, 80]);
  const cardY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  return (
    <motion.section
      ref={containerRef}
      style={{ scale: sectionScale, opacity: sectionOpacity, y: sectionY }}
      id="founder"
      className="py-32 sm:py-40 px-6 relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8b5cf6] rounded-full opacity-[0.03] blur-[120px]" />
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-[#ec4899]/30 text-[#ec4899] bg-[#ec4899]/5 px-5 py-1.5 text-xs font-mono tracking-[0.05em] uppercase rounded-full font-semibold">
            <Users className="w-3.5 h-3.5 mr-2" /> LEADERSHIP
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            Meet the{' '}<span className="gradient-text-warm">Founder</span>
          </h2>
        </AnimatedSection>
        <motion.div
          style={{ x: cardX, y: cardY }}
          className="w-full relative z-10"
        >
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Photo */}
              <div className="lg:col-span-2 relative overflow-hidden">
                <div className="aspect-square lg:aspect-auto lg:h-full relative">
                  <img src="/founder.png" alt="Eppa Sai Vardhan Reddy" className="w-full h-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0f]/50 hidden lg:block" />
                </div>
              </div>
              {/* Bio */}
              <div className="lg:col-span-3 p-8 sm:p-10 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-1 tracking-tight leading-tight">Eppa Sai Vardhan Reddy</h3>
                <p className="text-[#00f0ff] font-mono mb-5 text-xs tracking-[0.05em] uppercase font-semibold">Founder & Chief Architect</p>
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
                    <BookOpen className="w-5 h-5 text-[#8b5cf6] mt-0.5 flex-shrink-0" />
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
                  <a href="mailto:eppasaivardhanreddy@gmail.com" className="text-gray-400 hover:text-[#00f0ff] transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/eppa-sai-vardhan-reddy-5b71213a4" className="text-gray-400 hover:text-[#00f0ff] transition-colors">
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

  const sectionScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.82, 1, 0.92]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.35, 1, 1, 0.5]);
  const sectionY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80]);
  const essentialsX = useTransform(scrollYProgress, [0, 0.5, 1], [-60, 0, 60]);
  const essentialsY = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);

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
      <motion.section id="discovery" ref={containerRef} style={{ scale: sectionScale, opacity: sectionOpacity, y: sectionY }} className="py-24 sm:py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <div className="glass rounded-2xl border border-[#10b981]/20 p-10">
              <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-[#10b981]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Project Inquiry Received!</h3>
              <p className="text-gray-400 mb-6">Thank you, {form.fullName}. We&apos;ve sent a confirmation to {form.email}. Our team will review your project details and get back to you within 24 hours.</p>
              <Button onClick={() => { setSubmitted(false); setStep(1); setForm({ fullName: '', company: '', website: '', email: '', services: [], elevatorPitch: '', budgetTier: '', timeline: '', dataState: '', aiReadiness: [5] }); }} variant="outline" className="border-white/20 text-white hover:border-[#00f0ff]/50">
                Submit Another Inquiry
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section id="discovery" ref={containerRef} style={{ scale: sectionScale, opacity: sectionOpacity, y: sectionY }} className="py-32 sm:py-40 px-6 relative">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#00f0ff] rounded-full opacity-[0.02] blur-[120px]" />
      <div className="max-w-3xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <Badge variant="outline" className="mb-4 border-[#00f0ff]/30 text-[#00f0ff] bg-[#00f0ff]/5 px-5 py-1.5 text-xs font-mono tracking-[0.05em] uppercase rounded-full font-semibold">
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${s < step ? 'bg-[#00f0ff] text-black' : s === step ? 'border-2 border-[#00f0ff] text-[#00f0ff]' : 'border border-white/20 text-gray-500'
                  }`}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 4 && <div className={`w-10 sm:w-16 h-0.5 mx-1 transition-all duration-300 ${s < step ? 'bg-[#00f0ff]' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl border border-white/5 p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {/* Step 1: Essentials */}
              {step === 1 && (
                <motion.div key="step1" style={{ x: essentialsX, y: essentialsY }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h3 className="text-xl font-semibold text-white mb-6">The Essentials</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block">Full Name *</label>
                      <Input value={form.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="John Doe" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#00f0ff]/50" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm text-gray-400 mb-1.5 block">Company Name</label>
                        <Input value={form.company} onChange={e => updateField('company', e.target.value)} placeholder="Acme Inc." className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#00f0ff]/50" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1.5 block">Company Website</label>
                        <Input value={form.website} onChange={e => updateField('website', e.target.value)} placeholder="https://acme.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#00f0ff]/50" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block">Work Email *</label>
                      <Input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="john@acme.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#00f0ff]/50" />
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
                          ? 'border-[#00f0ff]/50 bg-[#00f0ff]/5'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                          }`}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15` }}>
                          <s.icon className="w-4 h-4" style={{ color: s.color }} />
                        </div>
                        <span className={`text-sm font-medium ${form.services.includes(s.id) ? 'text-white' : 'text-gray-400'}`}>{s.title}</span>
                        {form.services.includes(s.id) && <Check className="w-4 h-4 text-[#00f0ff] ml-auto" />}
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
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#00f0ff]/50 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm text-gray-400 mb-1.5 block">Budget Tier *</label>
                        <select
                          value={form.budgetTier}
                          onChange={e => updateField('budgetTier', e.target.value)}
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f0ff]/50 focus:outline-none appearance-none"
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
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f0ff]/50 focus:outline-none appearance-none"
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
                            className={`p-3 rounded-xl border text-sm text-left transition-all duration-300 ${form.dataState === opt ? 'border-[#00f0ff]/50 bg-[#00f0ff]/5 text-white' : 'border-white/5 text-gray-400 hover:border-white/10'
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
                          <span className="text-sm font-mono text-[#00f0ff]">{form.aiReadiness[0]}/10</span>
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
                  className="bg-[#00f0ff] text-black hover:bg-[#00d4e0] disabled:opacity-30 font-semibold"
                >
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-[#00f0ff] text-black hover:bg-[#00d4e0] disabled:opacity-50 font-semibold px-8"
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
              <span className="text-[#00f0ff] text-[10px] mt-[5px] flex-shrink-0">●</span>
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
              <span className="text-[#00f0ff] text-xs font-mono mt-[1px] flex-shrink-0 w-4">{num}.</span>
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
  const [sessionId] = useState(() => typeof window !== 'undefined' ? `chat_${Date.now()}_${Math.random().toString(36).slice(2)}` : 'default');
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#00f0ff] text-black flex items-center justify-center shadow-lg shadow-[#00f0ff]/30 hover:scale-110 transition-transform"
        whileTap={{ scale: 0.9 }}
      >
        {open ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] glass-strong rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00f0ff]/10 to-[#8b5cf6]/10 p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00f0ff]/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#00f0ff]" />
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
                    ? 'bg-[#00f0ff] text-black rounded-br-md'
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
                      <div className="w-2 h-2 rounded-full bg-[#00f0ff]/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#00f0ff]/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#00f0ff]/50 animate-bounce" style={{ animationDelay: '300ms' }} />
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 text-sm flex-1 focus:border-[#00f0ff]/50"
                />
                <Button type="submit" disabled={!input.trim() || loading} className="bg-[#00f0ff] text-black hover:bg-[#00d4e0] px-3 disabled:opacity-30">
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
            className="fixed bottom-0 left-0 right-0 z-[100] p-4"
          >
            <div className="max-w-4xl mx-auto glass-strong rounded-2xl border border-white/10 p-6">
              {!showDetails ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-[#00f0ff]" />
                      <span className="text-sm font-semibold text-white">Cookie Preferences</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We use cookies to enhance your browsing experience. You can customize your preferences or accept all.
                      <button onClick={() => setShowPrivacy(true)} className="text-[#00f0ff] hover:underline ml-1">Privacy Policy</button>
                      {' | '}
                      <button onClick={() => setShowImpressum(true)} className="text-[#00f0ff] hover:underline">Impressum</button>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button onClick={() => setShowDetails(true)} variant="outline" className="border-white/10 text-gray-400 text-xs h-9 px-4 hover:text-white">Customize</Button>
                    <Button onClick={rejectAll} variant="outline" className="border-white/10 text-gray-400 text-xs h-9 px-4 hover:text-white">Reject All</Button>
                    <Button onClick={acceptAll} className="bg-[#00f0ff] text-black text-xs h-9 px-4 font-semibold hover:bg-[#00d4e0]">Accept All</Button>
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
                      <button onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))} className={`w-10 h-5 rounded-full transition-colors ${prefs.analytics ? 'bg-[#00f0ff]' : 'bg-white/20'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${prefs.analytics ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div><p className="text-sm text-white">Marketing Cookies</p><p className="text-xs text-gray-500">Used for targeted advertising</p></div>
                      <button onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))} className={`w-10 h-5 rounded-full transition-colors ${prefs.marketing ? 'bg-[#00f0ff]' : 'bg-white/20'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${prefs.marketing ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => setShowDetails(false)} variant="outline" className="border-white/10 text-gray-400 text-xs h-9">Back</Button>
                    <Button onClick={savePrefs} className="bg-[#00f0ff] text-black text-xs h-9 px-6 font-semibold">Save Preferences</Button>
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
    <footer className="py-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <SignalZeroLogo className="w-8 h-8" />
              <div>
                <span className="text-white font-bold tracking-widest">SIGNAL</span>
                <span className="text-[#00f0ff] font-bold tracking-widest ml-1">ZERO</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-4">
              Engineering intelligent systems that transform raw data into competitive advantage. Premium AI & Data solutions for forward-thinking businesses.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:eppasaivardhanreddy@gmail.com" className="text-gray-500 hover:text-[#00f0ff] transition-colors"><Mail className="w-4 h-4" /></a>
              <a href="https://www.linkedin.com/in/eppa-sai-vardhan-reddy-5b71213a4" className="text-gray-500 hover:text-[#00f0ff] transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="text-gray-500 hover:text-[#00f0ff] transition-colors"><Globe className="w-4 h-4" /></a>
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
    <main className="bg-[#0a0a0f] text-white min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
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
