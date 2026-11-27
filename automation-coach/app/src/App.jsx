import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import TaskMap from './pages/TaskMap'
import Automations from './pages/Automations'
import Savings from './pages/Savings'
import Sessions from './pages/Sessions'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#F2F2F7' }}>
      <NavBar />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 16px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/task-map" replace />} />
          <Route path="/task-map" element={<TaskMap />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/sessions" element={<Sessions />} />
        </Routes>
      </div>
    </div>
  )
}
