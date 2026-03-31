'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', start_date: '', end_date: '' });

  const load = () => {
    setLoading(true);
    api.get('/announcements').then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/announcements', form);
    setShowForm(false);
    setForm({ title: '', description: '', start_date: '', end_date: '' });
    load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete this announcement?')) return;
    await api.delete(`/announcements/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <Plus size={16} /> Add Announcement
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-800">New Announcement</h2>
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">End Date</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="p-8 text-center text-gray-400 col-span-2">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400 col-span-2">No announcements found.</div>
        ) : items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <button onClick={() => del(item.id)} className="text-gray-300 hover:text-red-500">
                <Trash2 size={15} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">{item.description}</p>
            {item.start_date && (
              <p className="text-xs text-gray-400 mt-3">{item.start_date} → {item.end_date}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
