import React, { useEffect, useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts'

const PC = { high: '#007AFF', medium: '#FF9500', low: '#8E8E93' }
const PL = { high: '높음', medium: '중간', low: '낮음' }

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 180 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{d.name}</div>
      <div style={{ fontSize: 13, color: '#8E8E93', marginBottom: 4 }}>{d.category}</div>
      <div style={{ fontSize: 13 }}>월 {d.frequencyPerMonth}회 · 회당 {d.minutesPerOccurrence}분</div>
      <div style={{ fontSize: 13 }}>월 총 {d.frequencyPerMonth * d.minutesPerOccurrence}분</div>
      {d.painPoint && <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 6, fontStyle: 'italic' }}>{d.painPoint}</div>}
      <div style={{ marginTop: 8, display: 'inline-block', padding: '2px 8px', borderRadius: 6, background: PC[d.automationPotential] + '22', color: PC[d.automationPotential], fontSize: 12, fontWeight: 600 }}>
        자동화 가능성 {PL[d.automationPotential]}
      </div>
    </div>
  )
}

export default function TaskMap() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/task-map.json').then(r => r.json()).then(d => { setTasks(d.tasks || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', color: '#8E8E93', paddingTop: 80 }}>불러오는 중...</div>

  const totalMin = tasks.reduce((s, t) => s + t.frequencyPerMonth * t.minutesPerOccurrence, 0)
  const savingsMin = tasks.filter(t => t.automationPotential === 'high').reduce((s, t) => s + t.frequencyPerMonth * t.minutesPerOccurrence, 0)

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>업무 지도</h1>
      <p style={{ color: '#8E8E93', fontSize: 14, marginBottom: 24 }}>반복 빈도와 소요시간 기준 업무 분포 · 오른쪽 위로 갈수록 자동화 우선순위 높음</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: '전체 업무 수', value: `${tasks.length}개` },
          { label: '월 총 소요 시간', value: `${Math.floor(totalMin/60)}시간 ${totalMin%60}분` },
          { label: '자동화 절감 가능', value: `월 ${Math.floor(savingsMin/60)}시간+`, accent: true },
        ].map(item => (
          <div key={item.label} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 12, color: '#8E8E93', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: item.accent ? '#007AFF' : '#1C1C1E' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ top: 10, right: 30, bottom: 40, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis type="number" dataKey="x" domain={[0, 'auto']} tick={{ fontSize: 12 }}>
              <Label value="월 빈도 (회)" offset={-10} position="insideBottom" style={{ fontSize: 12, fill: '#8E8E93' }} />
            </XAxis>
            <YAxis type="number" dataKey="y" domain={[0, 'auto']} tick={{ fontSize: 12 }}>
              <Label value="소요시간 (분)" angle={-90} position="insideLeft" style={{ fontSize: 12, fill: '#8E8E93' }} />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              data={tasks.map(t => ({ ...t, x: t.frequencyPerMonth, y: t.minutesPerOccurrence }))}
              shape={(props) => {
                const { cx, cy, payload } = props
                const color = PC[payload.automationPotential] || '#007AFF'
                const r = Math.min(Math.sqrt(payload.frequencyPerMonth * payload.minutesPerOccurrence / 10) + 8, 28)
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={2} />
                    <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fill={color} fontWeight={600}>
                      {payload.name.length > 6 ? payload.name.slice(0, 6) + '…' : payload.name}
                    </text>
                  </g>
                )
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {Object.entries(PC).map(([k, color]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            자동화 가능성 {PL[k]}
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', fontWeight: 600, fontSize: 15 }}>전체 업무 목록</div>
        {tasks.map((t, i) => (
          <div key={t.id} style={{ padding: '14px 20px', borderBottom: i < tasks.length-1 ? '1px solid rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: '#8E8E93' }}>{t.category} · 월 {t.frequencyPerMonth}회 · 회당 {t.minutesPerOccurrence}분</div>
            </div>
            <div style={{ padding: '3px 10px', borderRadius: 8, background: PC[t.automationPotential]+'18', color: PC[t.automationPotential], fontSize: 12, fontWeight: 600 }}>
              {PL[t.automationPotential]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
