import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { ArrowLeft, MapPin, Phone, MessageCircle, Calendar, Package } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function ProduceDetailsPage() {
  const { id } = useParams();
  const { user } = useAuthStore();

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['produce', id],
    queryFn: async () => {
      const response = await api.get(`/produce/${id}`);
      return response.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <main className="flex-grow flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </main>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="w-full">
        <main className="flex-grow max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Produce not found</h2>
          <p className="text-slate-500 mb-6">The listing you're looking for might have been removed or sold.</p>
          <Link to="/marketplace" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700">
            Back to Marketplace
          </Link>
        </main>
      </div>
    );
  }

  // Format WhatsApp number (assume it's a local Sri Lankan number starting with 0, change to 94)
  const formatWhatsApp = (phone: string) => {
    let formatted = phone.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
      formatted = '94' + formatted.substring(1);
    }
    return formatted;
  };

  const waNumber = item.farmerId?.phone ? formatWhatsApp(item.farmerId.phone) : '';
  const waMessage = encodeURIComponent(`Hello ${item.farmerId?.name}, I'm interested in buying your ${item.name} (${item.quantity} ${item.unit}) listed on Farmer2MarketLK.`);

  return (
    <div className="w-full">
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Link to="/marketplace" className="text-slate-500 hover:text-primary-600 font-medium flex items-center gap-1 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
        
        <div className="glass rounded-3xl overflow-hidden shadow-xl border border-white/50 flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 bg-slate-100 relative">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover min-h-[300px]" />
            ) : (
              <div className="w-full h-full min-h-[300px] flex items-center justify-center text-slate-300 text-6xl">
                🌾
              </div>
            )}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-sm font-bold px-4 py-1.5 rounded-full text-slate-800 shadow-sm">
              {item.category}
            </div>
            {item.status === 'SOLD' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <span className="bg-red-500 text-white font-black text-2xl px-6 py-2 rounded-xl transform -rotate-12 shadow-2xl">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-8 lg:p-12 flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">{item.name}</h1>
            
            <div className="text-primary-600 font-bold text-3xl mb-6">
              Rs. {item.price} <span className="text-lg font-normal text-slate-500">/ {item.unit}</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Available Quantity</p>
                  <p className="font-semibold text-lg">{item.quantity} {item.unit}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Location</p>
                  <p className="font-semibold text-lg">{item.district}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Available From</p>
                  <p className="font-semibold text-lg">{new Date(item.availableDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {item.description && (
              <div className="mb-8">
                <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{item.description}</p>
              </div>
            )}

            <div className="mt-auto pt-8 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Farmer Details</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">
                  {item.farmerId?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">{item.farmerId?.name}</p>
                  <p className="text-slate-500 text-sm">{item.farmerId?.district} District</p>
                </div>
              </div>

              {user?.role === 'BUYER' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a 
                    href={`tel:${item.farmerId?.phone}`} 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" /> Call Farmer
                  </a>
                  <a 
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#1fbc5a] text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" /> WhatsApp
                  </a>
                </div>
              ) : (
                <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm border border-orange-200">
                  You need to be logged in as a <strong>Buyer</strong> to contact the farmer.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}