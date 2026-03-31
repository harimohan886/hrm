'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  date: string;
  status: string;
  clock_in: string;
  clock_out: string;
  employee: { user: { name: string } };
}

const statusColors: Record<string, string> = {
  Present: 'bg-green-100 text-green-700',
  Absent: 'bg-red-100 text-red-700',
  Late: 'bg-yellow-100 text-yellow-700',
  'Half Day': 'bg-orange-100 text-orange-700',
  Holiday: 'bg-blue-100 text-blue-700',
  Leave: 'bg-purple-100 text-purple-700',
};

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get(`/attendance?date=${date}`)
      .then((r) => setRecords(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [date]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this record?')) return;
    await api.delete(`/attendance/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <div className="flex items-center gap-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            <Plus size={16} /> Mark Attendance
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No attendance records for this date.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Clock In</th>
                <th className="px-4 py-3">Clock Out</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.employee?.user?.name}</td>
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-gray-100 text-gray-600'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{r.clock_in || '—'}</td>
                  <td className="px-4 py-3">{r.clock_out || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700">
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
