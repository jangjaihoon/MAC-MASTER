import React from 'react'
import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/task-map', label: '업무 지도' },
  { to: '/automations', label: '자동화 현황' },
  { to: '/savings', label: '절감 추적' },
  { to: '/sessions', label: '세션 기록' },
]

export default function NavBar() {
  return (
    <nav style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 17, color: '#007AFF', padding: '14px 12px 14px 0', marginRight: 8, borderRight: '1px solid rgba(0,0,0,0.1)' }}>
          자동화 코칭
        </span>
        {tabs.map(tab => (
          <NavLink key={tab.to} to={tab.to} style={({ isActive }) => ({
            padding: '14px 12px', fontSize: 14,
            fontWeight: isActive ? 600 : 400,
            color: isActive ? '#007AFF' : '#3C3C43',
            borderBottom: isActive ? '2px solid #007AFF' : '2px solid transparent',
          })}>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
