import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 border border-slate-200 rounded-3xl shadow-sm">
      <h2 className="text-2xl font-black mb-6 text-center text-slate-900">Create Account</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700">Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1 p-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="Rahul Sharma" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1 p-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="rahul@example.com" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mt-1 p-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full bg-amber-500 text-slate-900 font-bold py-3.5 rounded-xl hover:bg-amber-400 transition shadow-md">Register</button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-amber-600 font-bold hover:underline">Sign In</Link>
      </p>
    </div>
  );
}