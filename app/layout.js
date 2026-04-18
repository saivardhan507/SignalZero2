import './globals.css';

export const metadata = {
  title: 'Signal Zero | Integrated AI & Systems Engineering Agency',
  description: 'Premium Integrated AI and Systems engineering agency specializing in Full-Stack Development, Custom RAG AI Agents, FinTech Solutions, Data Engineering, and 3D Modeling.',
  keywords: 'AI agency, systems engineering, RAG agents, fintech, full-stack development, 3D modeling',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
      </head>
      <body className="antialiased relative min-h-screen">
        {/* Layer 1: Aurora Mesh Gradient */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] rounded-full bg-[#00e5ff] opacity-[0.18] blur-[120px] animate-aurora-1" />
          <div className="absolute top-[-5%] right-[-10%] w-[45vw] h-[50vh] rounded-full bg-[#00e5ff] opacity-[0.18] blur-[120px] animate-aurora-2" />
          <div className="absolute top-[30%] left-[20%] w-[60vw] h-[60vh] rounded-full bg-[#7b2fff] opacity-[0.18] blur-[120px] animate-aurora-3" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] rounded-full bg-[#084298] opacity-[0.18] blur-[120px] animate-aurora-4" />
        </div>

        {/* Layer 2: Dot Grid Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40 select-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,229,255,0.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Layer 3: Noise Texture Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.025] mix-blend-overlay select-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 w-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
