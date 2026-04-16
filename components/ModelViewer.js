"use client";

import { useRef } from 'react';

/**
 * Premium 3D Model Viewer Component
 * Optimized for stability: relies on global @google/model-viewer initialization.
 */
export default function ModelViewer({ src, alt, autoRotate = true, className = "" }) {
  const modelRef = useRef(null);

  return (
    <div className={`relative w-full aspect-video min-h-[300px] md:min-h-[350px] lg:min-h-[450px] rounded-3xl overflow-hidden glass border border-white/5 shadow-2xl ${className}`}>
      <model-viewer
        ref={modelRef}
        src={src}
        alt={alt}
        auto-rotate={autoRotate ? "true" : undefined}
        rotation-per-second="25deg"
        camera-controls
        interaction-prompt="auto"
        shadow-intensity="2"
        shadow-softness="1"
        exposure="1.1"
        environment-image="neutral"
        loading="eager"
        reveal="auto"
        style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'transparent',
          '--poster-color': 'transparent'
        }}
        className="w-full h-full"
      >
        {/* Cinematic Loading Screen */}
        <div slot="poster" className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f]/80 backdrop-blur-xl transition-opacity duration-1000">
           <div className="relative mb-6">
              <div className="w-12 h-12 border-2 border-[#00f0ff]/10 rounded-full"></div>
              <div className="absolute inset-0 w-12 h-12 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin"></div>
           </div>
           <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-[#00f0ff]/80 font-mono tracking-[0.4em] uppercase">Initializing Engine</span>
              <div className="w-32 h-[1px] bg-white/5 mt-2 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent w-full animate-shimmer"></div>
              </div>
           </div>
        </div>
      </model-viewer>
      
      {/* Premium HUD elements */}
      <div className="absolute top-6 left-6 pointer-events-none flex flex-col gap-2">
        <div className="bg-[#00f0ff]/5 backdrop-blur-md border border-[#00f0ff]/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#00f0ff] animate-pulse"></div>
            <span className="text-[9px] text-[#00f0ff] font-bold tracking-[0.2em] uppercase">System Online</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 pointer-events-none flex flex-col gap-1">
        <span className="text-[8px] text-white/30 font-mono tracking-[0.3em] uppercase">Interactive 3D Render</span>
        <div className="text-[10px] text-white/60 font-bold tracking-widest">{alt}</div>
      </div>


    </div>
  );
}
