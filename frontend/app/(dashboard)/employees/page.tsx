'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface Employee {
  id: number;
  employee_id: string;
  phone: string;
  salary: number;
  user: { name: string; email: string };
  department: { name: string } | null;
  designation: { name: string } | null;
  branch: { name: string } | null;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (q = '') => {
    setLoading(true);
    api.get(`/employees?search=${q}`)
      .then((r) => setEmployees(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this employee?')) return;
    await api.delete(`/employees/${id}`);
    load(search);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <a href="/employees/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <Plus size={16} /> Add Employee
        </a>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); load(e.target.value); }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No employees found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{emp.user?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{emp.user?.email}</td>
                  <td className="px-4 py-3">{emp.department?.name || '—'}</td>
                  <td className="px-4 py-3">{emp.designation?.name || '—'}</td>
                  <td className="px-4 py-3">{emp.branch?.name || '—'}</td>
                  <td className="px-4 py-3">₹{Number(emp.salary).toLocaleString()}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <a href={`/employees/${emp.id}/edit`} className="text-blue-500 hover:text-blue-700">
                      <Pencil size={15} />
                    </a>
                    <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:text-red-700">
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
