import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { API_URL } from '../config';
import { format, parseISO } from 'date-fns';
import fr from 'date-fns/locale/fr';

export default function UserStatsChart() {
  const [period, setPeriod] = useState('month'); // 'day', 'week', 'month', 'year'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchAndGroupUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();

        const filtered = users.filter(user => {
          const created = new Date(user.created_at);
          return created >= new Date(startDate) && created <= new Date(endDate);
        });

        const grouped = {};

        filtered.forEach(user => {
          const date = new Date(user.created_at);
          let key = '';

          switch (period) {
            case 'day':
              key = format(date, 'dd MMM yyyy', { locale: fr });
              break;
            case 'week':
              key = `S${format(date, 'I')} ${format(date, 'yyyy')}`; // Semaine + année
              break;
            case 'month':
              key = format(date, 'MMM yyyy', { locale: fr });
              break;
            case 'year':
              key = format(date, 'yyyy');
              break;
            default:
              key = format(date, 'MMM yyyy', { locale: fr });
          }

          grouped[key] = (grouped[key] || 0) + 1;
        });

        const result = Object.entries(grouped)
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) => new Date(a.label) - new Date(b.label));

        setChartData(result);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAndGroupUsers();
  }, [period, startDate, endDate]);

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h3>📊 Évolution des inscriptions</h3>

      <div className="d-flex gap-3 align-items-center mb-3">
        <label>
          Intervalle :
          <select value={period} onChange={e => setPeriod(e.target.value)} className="form-select ms-2">
            <option value="day">Par jour</option>
            <option value="week">Par semaine</option>
            <option value="month">Par mois</option>
            <option value="year">Par année</option>
          </select>
        </label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
