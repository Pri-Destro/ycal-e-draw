"use client";

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card, CardContent } from '@repo/ui/card';
import Link from 'next/link';
import { 
  Palette, 
  MousePointer, 
  Share2, 
  Layers, 
  Zap, 
  Users,
  Download,
  Globe,
  Pen,
  Moon,
  Sun
} from 'lucide-react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const features = [
    {
      icon: <Pen className="w-6 h-6" />,
      title: "Intuitive Drawing",
      description: "Create beautiful diagrams with our easy-to-use drawing tools and shapes."
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Layer Management",
      description: "Organize your work with advanced layer support and grouping features."
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with live multiplayer editing capabilities."
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Rich Styling",
      description: "Customize colors, fonts, and styles to match your creative vision."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Anywhere",
      description: "Export your creations as PNG, SVG, or PDF with perfect quality."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Works Everywhere",
      description: "Access your drawings from any device with our web-based platform."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Spotlight Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${
            isDarkMode 
              ? 'rgba(139, 92, 246, 0.15)' 
              : 'rgba(99, 102, 241, 0.15)'
          }, transparent 40%)`
        }}
      />
      
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Pen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">DrawFlow</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Features</a>
              <a href="#pricing" className={`transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Pricing</a>
              <a href="#about" className={`transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>About</a>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleDarkMode}
                className={`p-2 ${
                  isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Link href={"/auth/signin"}>
              <Button variant="outline" className={`transition-colors ${
                isDarkMode 
                  ? 'border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white' 
                  : 'border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white'
             } px-4 py-2`}>
                Sign In
              </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent ${
              isDarkMode 
                ? 'from-white via-indigo-200 to-purple-400' 
                : 'from-gray-900 via-indigo-600 to-purple-600'
            }`}>
              Draw Ideas Into Reality
            </h1>
            
            <p className={`text-xl md:text-2xl mb-12 leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              The ultimate collaborative whiteboard for teams, designers, and creators. 
              Bring your ideas to life with powerful drawing tools and real-time collaboration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                <Zap className="mr-2 w-5 h-5" />
                Start Drawing Free
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className={`px-8 py-4 text-lg transition-colors ${
                  isDarkMode 
                    ? 'border-gray-400 text-gray-300 hover:bg-white hover:text-gray-900' 
                    : 'border-gray-400 text-gray-600 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <MousePointer className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative">
            <div className={`backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto ${
              isDarkMode 
                ? 'bg-gradient-to-r from-indigo-800/20 to-purple-800/20 border border-indigo-500/30' 
                : 'bg-gradient-to-r from-indigo-100/50 to-purple-100/50 border border-indigo-200/50'
            }`}>
              <div className={`aspect-video rounded-xl border flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-gray-700' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
              }`}>
                <div className={`text-center ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`w-12 h-12 rounded-lg animate-pulse ${
                        isDarkMode 
                          ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30' 
                          : 'bg-gradient-to-br from-indigo-300/50 to-purple-300/50'
                      }`} style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <p className="text-lg">Interactive Canvas Preview</p>
                  <p className={`text-sm mt-2 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>Your drawings will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to Create
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Powerful features designed to enhance your creativity and streamline your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`transition-all duration-300 group hover:transform hover:scale-105 ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 hover:border-indigo-500/50' 
                  : 'bg-white/80 border-gray-200 hover:border-indigo-300 hover:shadow-lg'
              }`}>
                <CardContent className="p-8">
                  <div className={`w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 ${
                    isDarkMode 
                      ? 'group-hover:shadow-lg group-hover:shadow-indigo-500/25' 
                      : 'group-hover:shadow-lg group-hover:shadow-indigo-500/20'
                  }`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className={`leading-relaxed ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 py-20">
          <div className={`backdrop-blur-sm rounded-2xl p-12 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30' 
              : 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-200/50'
          }`}>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${
                  isDarkMode 
                    ? 'from-indigo-400 to-purple-400' 
                    : 'from-indigo-600 to-purple-600'
                }`}>
                  1M+
                </div>
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Active Users</p>
              </div>
              
              <div>
                <div className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${
                  isDarkMode 
                    ? 'from-indigo-400 to-purple-400' 
                    : 'from-indigo-600 to-purple-600'
                }`}>
                  50M+
                </div>
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Drawings Created</p>
              </div>
              
              <div>
                <div className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${
                  isDarkMode 
                    ? 'from-indigo-400 to-purple-400' 
                    : 'from-indigo-600 to-purple-600'
                }`}>
                  99.9%
                </div>
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Uptime</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Creating?
            </h2>
            <p className={`text-xl mb-12 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join millions of creators who trust DrawFlow for their visual collaboration needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 text-lg"
              >
                <Users className="mr-2 w-5 h-5" />
                Get Started Today
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className={`px-12 py-4 text-lg transition-colors ${
                  isDarkMode 
                    ? 'border-gray-400 text-gray-300 hover:bg-white hover:text-gray-900' 
                    : 'border-gray-400 text-gray-600 hover:bg-gray-900 hover:text-white'
                }`}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`container mx-auto px-6 py-12 border-t ${
          isDarkMode ? 'border-slate-800' : 'border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Pen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">DrawFlow</span>
            </div>
            
            <div className={`flex items-center space-x-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <a href="#" className={`transition-colors ${
                isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'
              }`}>Privacy</a>
              <a href="#" className={`transition-colors ${
                isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'
              }`}>Terms</a>
              <a href="#" className={`transition-colors ${
                isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'
              }`}>Support</a>
              <span>© 2024 DrawFlow. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}