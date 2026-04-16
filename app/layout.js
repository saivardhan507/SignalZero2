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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
