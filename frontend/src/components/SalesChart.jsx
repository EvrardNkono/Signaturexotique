// src/components/SalesChart.jsx
import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import './SalesChart.css'; // pour la mise en forme

const salesData = {
  day: [
    { name: 'Lun', ventes: 120 },
    { name: 'Mar', ventes: 200 },
    { name: 'Mer', ventes: 150 },
    { name: 'Jeu', ventes: 220 },
    { name: 'Ven', ventes: 180 },
    { name: 'Sam', ventes: 90 },
    { name: 'Dim', ventes: 130 },
  ],
  week: [
    { name: 'Semaine 1', ventes: 900 },
    { name: 'Semaine 2', ventes: 750 },
    { name: 'Semaine 3', ventes: 1100 },
    { name: 'Semaine 4', ventes: 980 },
  ],
  month: [
    { name: 'Jan', ventes: 3000 },
    { name: 'Fév', ventes: 2800 },
    { name: 'Mars', ventes: 3500 },
    { name: 'Avr', ventes: 3200 },
    { name: 'Mai', ventes: 3700 },
    { name: 'Juin', ventes: 4000 },
  ]
};

export default function SalesChart() {
  const [period, setPeriod] = useState('week');

  return (
    <div className="sales-chart-container">
      <div className="chart-header">
        <h2 className="chart-title">Ventes</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="chart-select"
        >
          <option value="day">Par jour</option>
          <option value="week">Par semaine</option>
          <option value="month">Par mois</option>
        </select>
      </div>

      <ResponsiveContainer width="75%" height={225}>
        <LineChart data={salesData[period]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ventes" stroke="#ff7f00" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
