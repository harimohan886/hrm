'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

interface Payslip {
  id: number;
  month: number;
  year: number;
  salary: number;
  net_payble: number;
  status: string;
  employee: { user: { name: string } };
}

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const statusColors: Record<string, string> = {
  Generated: 'bg-blue-100 text-blue-700',
  Sent: 'bg-yellow-100 text-yellow-700',
  Paid: 'bg-green-100 text-green-700',
};

export default function PayslipsPage() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/payslips').then((r) => setPayslips(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const del = async (id: number) => {
    if (!confirm('Delete this payslip?')) return;
    await api.delete(`/payslips/${id}`);
    load();
  };

  const updateStatus = async (id: number, status: string) => {
    await api.put(`/payslips/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payslips</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <Plus size={16} /> Generate Payslip
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : payslips.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No payslips found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Net Payable</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payslips.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.employee?.user?.name}</td>
                  <td className="px-4 py-3">{months[p.month - 1]} {p.year}</td>
                  <td className="px-4 py-3">₹{Number(p.salary).toLocaleString()}</td>
                  <td className="px-4 py-3">₹{Number(p.net_payble).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${statusColors[p.status]}`}
                    >
                      <option>Generated</option>
                      <option>Sent</option>
                      <option>Paid</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => del(p.id)} className="text-red-500 hover:text-red-700">
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
