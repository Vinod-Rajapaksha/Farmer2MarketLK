import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Package, Plus, TrendingUp } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

export default function FarmerDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['farmerListings'],
    queryFn: async () => {
      const response = await api.get('/produce/my/listings');
      return response.data.data;
    }
  });

  const activeCount = data?.filter((item: any) => item.status === 'AVAILABLE').length || 0;
  const soldCount = data?.filter((item: any) => item.status === 'SOLD').length || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Farmer Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your agricultural produce listings</p>
          </div>
          
          <Link 
            to="/farmer/produce/new" 
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            List Produce
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Listings</p>
              <h3 className="text-2xl font-bold text-slate-900">{isLoading ? '-' : activeCount}</h3>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Sold Listings</p>
              <h3 className="text-2xl font-bold text-slate-900">{isLoading ? '-' : soldCount}</h3>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">My Listings</h2>
        
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading your listings...</div>
        ) : data?.length === 0 ? (
          <div className="text-center py-16 glass rounded-xl border border-dashed border-slate-300">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No listings yet</h3>
            <p className="text-slate-500 mb-4">You haven't added any produce to the marketplace.</p>
            <Link to="/farmer/produce/new" className="text-primary-600 font-medium hover:underline">Add your first produce</Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Produce</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {data.map((item: any) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded object-cover mr-3" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-slate-900">{item.name}</div>
                            <div className="text-sm text-slate-500">{item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        Rs. {item.price} / {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/farmer/produce/${item._id}/edit`} className="text-primary-600 hover:text-primary-900 mr-4">Edit</Link>
                        {item.status === 'AVAILABLE' && (
                          <button 
                            onClick={async () => {
                              if(confirm('Mark as sold?')) {
                                await api.patch(`/produce/${item._id}/sold`);
                                window.location.reload();
                              }
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Mark Sold
                          </button>
                        )}
                        <button 
                          onClick={async () => {
                            if(confirm('Are you sure you want to delete this listing?')) {
                              await api.delete(`/produce/${item._id}`);
                              window.location.reload();
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
