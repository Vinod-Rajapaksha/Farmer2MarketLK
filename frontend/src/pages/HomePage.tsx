import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="Farmer2MarketLK Logo" className="h-10 w-auto rounded-md shadow-sm" />
            <span className="font-heading font-bold text-xl text-primary-700">Farmer2MarketLK</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        <img src="/logo.jpeg" alt="Farmer2MarketLK Logo" className="w-32 h-32 mx-auto rounded-3xl shadow-xl mb-8 border-4 border-white" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Connect <span className="text-primary-600">Farmers</span><br />
          With <span className="text-primary-600">Buyers</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The digital marketplace that directly connects Sri Lankan farmers with buyers. 
          Sell your fresh produce directly, or find local agricultural products easily.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-primary-500/30 flex items-center justify-center gap-2">
            Start Trading <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/marketplace" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3 rounded-xl font-medium transition-colors">
            Browse Marketplace
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="bg-white py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Farmers</h3>
              <p className="text-slate-600">List your produce easily, reach thousands of buyers across the country, and manage your listings in one place.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Buyers</h3>
              <p className="text-slate-600">Find fresh, local produce easily. Search, filter by district, and contact farmers directly without middlemen.</p>
            </div>

            <div className="text-center p-6 relative">
              <div className="absolute -top-4 -right-4 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" /> New Feature
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Recommendations</h3>
              <p className="text-slate-600">Just describe what you need in plain English. Our Gemini AI will instantly find the best matching produce for you.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
