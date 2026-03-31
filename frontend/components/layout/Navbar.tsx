'use client';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ title }: { title?: string }) {
  const { user } = useAuth();
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">{title || 'Dashboard'}</h2>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-700">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
