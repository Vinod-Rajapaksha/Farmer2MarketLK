import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-heading font-bold text-primary-600 inline-block mb-2">
            🌾 Farmer2MarketLK
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">Create Account</h1>
          <p className="text-slate-500 mt-1">Join the marketplace directly connecting farmers and buyers.</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <RegisterForm />
          
          <p className="text-center text-slate-600 mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}