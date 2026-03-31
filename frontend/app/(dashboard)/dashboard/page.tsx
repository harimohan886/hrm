'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Users, Clock, Calendar, CheckCircle } from 'lucide-react';

interface Summary {
  totalEmployees: number;
  todayPresent: number;
  pendingLeaves: number;
  activeUsers: number;
}

const StatCard = ({
  label, value, icon: Icon, color,
}: { label: string; value: number; icon: React.ElementType; color: string }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/summary')
      .then((r) => setSummary(r.data))
      .catch(() => setError('Could not load dashboard data'));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Employees" value={summary?.totalEmployees ?? 0} icon={Users} color="bg-blue-500" />
        <StatCard label="Present Today" value={summary?.todayPresent ?? 0} icon={Clock} color="bg-green-500" />
        <StatCard label="Pending Leaves" value={summary?.pendingLeaves ?? 0} icon={Calendar} color="bg-yellow-500" />
        <StatCard label="Active Users" value={summary?.activeUsers ?? 0} icon={CheckCircle} color="bg-purple-500" />
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Welcome to HRM System</h2>
        <p className="text-gray-500 text-sm">
          Manage your employees, attendance, leaves, payslips and more from this dashboard.
        </p>
      </div>
    </div>
  );
}
