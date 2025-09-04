import { useState } from 'react';
import {  Clapperboard } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: เชื่อม backend login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-backgroundStart to-backgroundEnd text-text">
      <div className="bg-surface p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <div className="flex flex-col items-center">
          < Clapperboard className="text-primary w-10 h-10 mb-2" />
          <h1 className="text-3xl font-bold text-primary">Movie Management</h1>
          <p className="text-sm text-muted mt-1 text-center">
            Sign in to keep your movie collection safe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-accent py-2 rounded font-semibold text-white"
          >
            Sign In
          </button>
        </form>

        <div className="text-sm text-muted mt-4">
          <h3 className="font-semibold text-text mb-1">Demo accounts:</h3>
          <ul className="space-y-1">
            <li>Manager: <span className="text-orange-300">manager01 / 123456</span></li>
            <li>Regular: <span className="text-orange-300">moviebuff01 / 123456</span></li>
            <li>Staff: <span className="text-orange-300">staff01 / 123456</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
