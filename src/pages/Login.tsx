import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, User, Lock, Coffee } from 'lucide-react';
import { usersData } from '../mocks/userData';
import { setCurrentUser, type CurrentUser } from '../utils/auth';

// Mock passwords for demo purposes (in real app, these would be hashed)
const mockPasswords: Record<string, string> = {
    "admin": "admin123",
    "cashier": "cashier123", 
    "barista": "barista123",
    "carlos.rodriguez": "cashier123",
    "lisa.martinez": "barista123",
    "michael.tan": "admin123"
};

interface LoginFormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({ username: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  
  // --- NEW: State for general authentication errors ---
  const [authError, setAuthError] = useState<string>('');
  
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // --- NEW: Clear errors on input change ---
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (authError) setAuthError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setAuthError(''); // Clear previous auth errors
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user in our centralized user data
    const matchedUser = usersData.find(
      user => user.username === formData.username && 
              user.status === 'active' &&
              mockPasswords[user.username] === formData.password
    );
    setIsLoading(false);
    if (matchedUser) {
      // Store user info using auth utility
      const currentUser: CurrentUser = {
        id: matchedUser.id,
        username: matchedUser.username,
        firstName: matchedUser.firstName,
        lastName: matchedUser.lastName,
        role: matchedUser.role
        // permissions: matchedUser.permissions // Temporarily removed for testing
      };
      
      setCurrentUser(currentUser);
      
      // Update last login time (in real app, this would be done on the server)
      // Note: In a real application, this would update the database
      console.log('User logged in:', matchedUser.username, 'at', new Date());
      
      navigate('/dashboard');
    } else {
      // --- NEW: Set a general authentication error ---
      setAuthError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="flex bg-[#F3EEEA] w-full min-h-screen text-[#776B5D]">
      {/* --- Section 1: Image Panel (Visible on large screens) --- */}
      <div className="hidden lg:block bg-cover bg-center lg:w-1/2" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop')" }}>
        <div className="flex justify-center items-end bg-black/40 h-full">
            <h1 className="p-12 font-bold text-white text-4xl text-center leading-tight">Welcome to the Future of Your Cafe Management</h1>
        </div>
      </div>

      {/* --- Section 2: Form Panel --- */}
      <div className="flex justify-center items-center p-4 w-full lg:w-1/2">
        <div className="bg-white shadow-2xl mx-4 p-8 rounded-2xl w-full max-w-md">
          <header className="mb-8 text-center">
            <div className="flex justify-center items-center gap-3 mb-3">
                <Coffee className="w-8 h-8 text-[#776B5D]" />
                <h1 className="font-bold text-[#776B5D] text-3xl">Coffee Win</h1>
            </div>
            <p className="text-[#776B5D]/75">Please sign in to continue</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- NEW: General Authentication Error Display --- */}
            {authError && (
                <div className="bg-red-50 p-3 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                    {authError}
                </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block font-medium text-[#776B5D] text-sm">Username</label>
              <div className="relative">
                <User className="top-1/2 left-3 absolute w-5 h-5 text-[#776B5D]/40 -translate-y-1/2" />
                <input
                  type="text" id="username" name="username" value={formData.username} onChange={handleInputChange}
                  className="bg-[#F3EEEA] py-3 pr-4 pl-10 border border-[#B0A695] focus:border-[#776B5D] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#776B5D] w-full text-[#776B5D] placeholder:text-[#776B5D]/50"
                  placeholder="e.g., admin"
                />
              </div>
              {errors.username && <p className="mt-1 text-red-500 text-sm">{errors.username}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block font-medium text-[#776B5D] text-sm">Password</label>
              <div className="relative">
                <Lock className="top-1/2 left-3 absolute w-5 h-5 text-[#776B5D]/40 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleInputChange}
                  className="bg-[#F3EEEA] py-3 pr-12 pl-10 border border-[#B0A695] focus:border-[#776B5D] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#776B5D] w-full text-[#776B5D] placeholder:text-[#776B5D]/50"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="top-1/2 right-3 absolute text-[#776B5D]/50 hover:text-[#776B5D] -translate-y-1/2">
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* --- NEW: Remember Me & Forgot Password --- */}
            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember-me" className="border-gray-300 rounded focus:ring-[#776B5D] w-4 h-4 text-[#776B5D]"/>
                    <label htmlFor="remember-me" className="text-[#776B5D]/80">Remember me</label>
                </div>
                <a href="#" className="font-medium text-[#776B5D] hover:underline">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit" disabled={isLoading}
              className="flex justify-center items-center gap-2 bg-[#776B5D] hover:bg-[#776B5D]/90 disabled:bg-[#776B5D]/50 py-3 rounded-lg w-full font-semibold text-[#F3EEEA] transition-colors duration-200"
            >
              {isLoading ? (
                <div className="border-2 border-t-[#F3EEEA] border-[#F3EEEA]/30 rounded-full w-5 h-5 animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;