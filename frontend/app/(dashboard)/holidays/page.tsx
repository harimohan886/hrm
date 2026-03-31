'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Holiday {
  id: number;
  title: string;
  date: string;
  color: string;
}

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', color: '#e11d48' });

  const load = () => {
    setLoading(true);
    api.get('/holidays').then((r) => setHolidays(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/holidays', form);
    setShowForm(false);
    setForm({ title: '', date: '', color: '#e11d48' });
    load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete this holiday?')) return;
    await api.delete(`/holidays/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Holidays</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <Plus size={16} /> Add Holiday
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-800">New Holiday</h2>
          <div className="flex gap-4 flex-wrap">
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="flex-1 min-w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
            <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="h-10 w-16 border border-gray-200 rounded-lg cursor-pointer" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading…</div>
          : holidays.length === 0 ? <div className="p-8 text-center text-gray-400">No holidays found.</div>
          : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Color</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {holidays.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{h.title}</td>
                  <td className="px-4 py-3">{h.date}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block w-5 h-5 rounded-full" style={{ backgroundColor: h.color }} />
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => del(h.id)} className="text-red-500 hover:text-red-700">
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
