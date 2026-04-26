'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Ene', clients: 10 },
  { month: 'Feb', clients: 12 },
  { month: 'Mar', clients: 15 },
  { month: 'Abr', clients: 18 },
  { month: 'May', clients: 22 },
  { month: 'Jun', clients: 28 },
]

export function ClientsGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="clients" fill="#000" />
      </BarChart>
    </ResponsiveContainer>
  )
}
