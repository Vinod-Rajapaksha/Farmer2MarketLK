import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Link } from 'react-router-dom';
import { Search, MapPin, Sparkles, Filter } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices', 'Other'];
const DISTRICTS = ['All', 'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [district, setDistrict] = useState('All');
  const [page, setPage] = useState(1);
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['marketplace', search, category, district, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      if (district !== 'All') params.append('district', district);
      params.append('page', page.toString());
      params.append('limit', '12');

      const response = await api.get(`/produce?${params.toString()}`);
      return response.data.data;
    }
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {user?.role === 'BUYER' && (
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-primary-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                Find Produce with AI
              </h2>
              <p className="text-white/90 max-w-lg">
                Describe exactly what you need in plain English, and our Gemini AI will find the perfect matching listings for you.
              </p>
            </div>
            <Link to="/buyer/ai" className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors whitespace-nowrap shadow-sm">
              Try AI Search ✨
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="glass rounded-2xl p-5 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" /> Filters
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search produce..." 
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select 
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white text-sm"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">District</label>
                <select 
                  value={district}
                  onChange={(e) => { setDistrict(e.target.value); setPage(1); }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white text-sm"
                >
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass rounded-2xl h-80 animate-pulse bg-slate-200"></div>
                ))}
              </div>
            ) : data?.produce?.length === 0 ? (
              <div className="text-center py-20 glass rounded-2xl border border-dashed border-slate-300">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No produce found</h3>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.produce.map((item: any) => (
                    <Link key={item._id} to={`/produce/${item._id}`} className="glass rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 group flex flex-col">
                      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl">🌾</div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-800 shadow-sm">
                          {item.category}
                        </div>
                      </div>
                      <div className="p-5 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{item.name}</h3>
                        </div>
                        <div className="text-primary-600 font-bold text-xl mb-4">
                          Rs. {item.price} <span className="text-sm font-normal text-slate-500">/ {item.unit}</span>
                        </div>
                        <div className="mt-auto space-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">⚖️</div>
                            {item.quantity} {item.unit} available
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center"><MapPin className="w-3 h-3 text-slate-600"/></div>
                            {item.district}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {data?.pagination.pages > 1 && (
                  <div className="flex justify-center mt-12 gap-2">
                    <button 
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-50 font-medium"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-slate-600 font-medium flex items-center">
                      Page {page} of {data.pagination.pages}
                    </span>
                    <button 
                      disabled={page === data.pagination.pages}
                      onClick={() => setPage(p => p + 1)}
                      className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-50 font-medium"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}