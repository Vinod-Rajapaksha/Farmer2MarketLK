import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Link } from 'react-router-dom';
import { Sparkles, Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

const aiFormSchema = z.object({
  query: z.string().min(10, 'Please describe your requirement in detail (at least 10 characters)'),
});

type FormData = z.infer<typeof aiFormSchema>;

export default function AIRecommendationPage() {
  const [recommendations, setRecommendations] = useState<any[] | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(aiFormSchema)
  });

  const aiMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post('/ai/recommend', data);
      return response.data.data.recommendations;
    },
    onSuccess: (data) => {
      setRecommendations(data);
    }
  });

  const onSubmit = (data: FormData) => {
    aiMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Link to="/marketplace" className="text-slate-500 hover:text-primary-600 font-medium flex items-center gap-1 mb-6 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            AI-Powered Produce Matching
          </h1>
          <p className="text-slate-600 text-lg">
            Tell us exactly what you're looking for, including quantities, price limits, and specific districts. Our AI will find the best matches for you.
          </p>
        </div>

        <div className="glass rounded-3xl p-6 md:p-8 max-w-3xl mx-auto mb-12 shadow-xl border border-purple-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-primary-500"></div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">What do you need?</label>
              <textarea 
                {...register('query')} 
                rows={4} 
                className="w-full px-5 py-4 bg-white/50 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-lg transition-all" 
                placeholder='e.g., "I need around 300kg of fresh tomatoes under Rs.200 per kg in Kurunegala district."'
              ></textarea>
              {errors.query && <p className="mt-2 text-sm text-red-500 font-medium">{errors.query.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={aiMutation.isPending} 
              className="w-full bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2"
            >
              {aiMutation.isPending ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Analyzing your request...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Find Best Matches
                </>
              )}
            </button>
            {aiMutation.isError && (
              <p className="mt-2 text-sm text-red-500 font-medium text-center">
                {(aiMutation.error as any).response?.data?.message || 'Failed to process AI request. Please try again.'}
              </p>
            )}
          </form>
        </div>

        {/* Results Section */}
        {recommendations !== null && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              Top Recommendations
              <span className="bg-purple-100 text-purple-700 text-sm py-1 px-3 rounded-full">
                {recommendations.length} found
              </span>
            </h2>

            {recommendations.length === 0 ? (
              <div className="text-center py-16 glass rounded-2xl border border-dashed border-slate-300">
                <div className="text-4xl mb-4">🤔</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No perfect matches found</h3>
                <p className="text-slate-500">Try adjusting your requirement or browse the marketplace manually.</p>
                <Link to="/marketplace" className="mt-6 inline-block text-primary-600 font-medium hover:underline">
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {recommendations.map((rec: any, index: number) => (
                  <div key={rec.produce._id} className="glass rounded-2xl p-6 border border-slate-200 hover:border-purple-300 transition-colors shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden">
                    
                    {index === 0 && (
                      <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 font-bold text-xs px-4 py-1 rounded-bl-lg shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3"/> BEST MATCH
                      </div>
                    )}
                    
                    <div className="md:w-1/4 flex-shrink-0">
                      <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative">
                        {rec.produce.imageUrl ? (
                          <img src={rec.produce.imageUrl} alt={rec.produce.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl">🌾</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                          <span className="text-white font-bold text-lg drop-shadow-md">
                            {rec.matchScore}% Match
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-3/4 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">{rec.produce.name}</h3>
                          <p className="text-primary-600 font-bold text-xl mt-1">
                            Rs. {rec.produce.price} <span className="text-sm text-slate-500 font-normal">/ {rec.produce.unit}</span>
                          </p>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                          <p className="font-medium text-slate-700">{rec.produce.quantity} {rec.produce.unit} available</p>
                          <p>{rec.produce.district}</p>
                        </div>
                      </div>

                      <div className="my-4 bg-purple-50 rounded-xl p-4 border border-purple-100">
                        <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-2">Why this matches:</h4>
                        <ul className="space-y-1">
                          {rec.reason.map((r: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-purple-800 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-auto flex justify-end">
                        <Link 
                          to={`/produce/${rec.produce._id}`}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
                        >
                          View Listing <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
