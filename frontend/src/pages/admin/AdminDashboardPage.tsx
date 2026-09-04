import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Users, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data.data;
    }
  });

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete user ${name}?`)) {
      try {
        await api.delete(`/users/${id}`);
        refetch();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const farmerCount = users?.filter((u: any) => u.role === 'FARMER').length || 0;
  const buyerCount = users?.filter((u: any) => u.role === 'BUYER').length || 0;
  const adminCount = users?.filter((u: any) => u.role === 'ADMIN').length || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage users across the Farmer2MarketLK platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl p-6 flex flex-col justify-center text-center">
             <h3 className="text-4xl font-bold text-slate-900">{isLoading ? '-' : users?.length}</h3>
             <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wider">Total Users</p>
          </div>
          <div className="glass rounded-xl p-6 flex flex-col justify-center text-center border-b-4 border-green-500">
             <h3 className="text-4xl font-bold text-slate-900">{isLoading ? '-' : farmerCount}</h3>
             <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wider">Farmers</p>
          </div>
          <div className="glass rounded-xl p-6 flex flex-col justify-center text-center border-b-4 border-blue-500">
             <h3 className="text-4xl font-bold text-slate-900">{isLoading ? '-' : buyerCount}</h3>
             <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wider">Buyers</p>
          </div>
          <div className="glass rounded-xl p-6 flex flex-col justify-center text-center border-b-4 border-purple-500">
             <h3 className="text-4xl font-bold text-slate-900">{isLoading ? '-' : adminCount}</h3>
             <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wider">Admins</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">User Management</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">District</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading users...</td></tr>
                ) : users?.map((u: any) => (
                  <tr key={u._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-sm text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full 
                        ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : ''}
                        ${u.role === 'FARMER' ? 'bg-green-100 text-green-800' : ''}
                        ${u.role === 'BUYER' ? 'bg-blue-100 text-blue-800' : ''}
                      `}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {u.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {u.district}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {u._id !== user?._id && u.role !== 'ADMIN' && (
                        <button 
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="text-red-600 hover:text-red-900 flex items-center justify-end w-full gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
