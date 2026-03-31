'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface Leave {
  id: number;
  start_date: string;
  end_date: string;
  total_leave_days: number;
  status: string;
  leave_reason: string;
  employee: { user: { name: string } };
  leaveType: { name: string };
}

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/leaves').then((r) => setLeaves(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const approve = async (id: number) => {
    await api.put(`/leaves/${id}/approve`);
    load();
  };

  const reject = async (id: number) => {
    await api.put(`/leaves/${id}/reject`);
    load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete this leave?')) return;
    await api.delete(`/leaves/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leave Management</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : leaves.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No leave requests found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Days</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{l.employee?.user?.name}</td>
                  <td className="px-4 py-3">{l.leaveType?.name}</td>
                  <td className="px-4 py-3">{l.start_date}</td>
                  <td className="px-4 py-3">{l.end_date}</td>
                  <td className="px-4 py-3">{l.total_leave_days}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[l.status]}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {l.status === 'Pending' && (
                      <>
                        <button onClick={() => approve(l.id)} className="text-green-500 hover:text-green-700" title="Approve">
                          <CheckCircle size={16} />
                        </button>
                        <button onClick={() => reject(l.id)} className="text-red-500 hover:text-red-700" title="Reject">
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    <button onClick={() => del(l.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
