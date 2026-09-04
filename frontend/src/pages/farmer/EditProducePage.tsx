import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from '../../store/toastStore';

const editProduceSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.string().min(2, 'Category is required'),
  quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  district: z.string().min(2, 'District is required'),
  availableDate: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof editProduceSchema>;

const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 
  'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Spices', 'Other'];

export default function EditProducePage() {
  const { id } = useParams<{ id: string }>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(editProduceSchema)
  });

  useEffect(() => {
    const fetchProduce = async () => {
      try {
        const response = await api.get(`/produce/${id}`);
        const data = response.data.data;
        
        // Format date to YYYY-MM-DD for date input
        const date = new Date(data.availableDate);
        const formattedDate = date.toISOString().split('T')[0];
        
        reset({
          name: data.name,
          category: data.category,
          quantity: data.quantity,
          unit: data.unit,
          price: data.price,
          district: data.district,
          availableDate: formattedDate,
          description: data.description || '',
        });
      } catch (error) {
        toast.error('Failed to load produce details');
        navigate('/farmer/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduce();
  }, [id, reset, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.put(`/produce/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Produce updated successfully!');
      navigate(-1);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update produce');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <button 
          onClick={() => navigate(-1)} 
          className="text-primary-600 font-medium hover:underline flex items-center gap-1 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Edit Produce</h1>
        
        <div className="glass rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Produce Name *</label>
                <input type="text" {...register('name')} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="e.g. Tomato" />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                <select {...register('category')} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white">
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity *</label>
                <input type="number" step="0.1" {...register('quantity', { valueAsNumber: true })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="e.g. 500" />
                {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit *</label>
                <select {...register('unit')} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white">
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="ton">Tons</option>
                  <option value="pieces">Pieces</option>
                  <option value="bunches">Bunches</option>
                </select>
                {errors.unit && <p className="mt-1 text-sm text-red-500">{errors.unit.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price per Unit (Rs.) *</label>
                <input type="number" step="1" {...register('price', { valueAsNumber: true })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="e.g. 180" />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Available District *</label>
                <select {...register('district')} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white">
                  <option value="">Select District</option>
                  {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.district && <p className="mt-1 text-sm text-red-500">{errors.district.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Available Date *</label>
              <input type="date" {...register('availableDate')} className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
              {errors.availableDate && <p className="mt-1 text-sm text-red-500">{errors.availableDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Update Produce Image (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
              <textarea {...register('description')} rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Describe your produce (e.g. Freshly harvested, organic...)"></textarea>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Produce'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
