import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function formatWeek(w) {
  const [year, week] = w.split('-W')
  const d = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7)
  return `${d.getMonth() + 1}월 ${Math.ceil(d.getDate() / 7)}주`
}

export default function Savings() {
  const [metrics, setMetrics] = useState({ records: [] })
  const [automations, setAutomations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/data/metrics.json').then(r => r.json()),
      fetch('/data/automations.json').then(r => r.json()),
    ]).then(([m, a]) => { setMetrics(m); setAutomations(a.automations || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', color: '#8E8E93', paddingTop: 80 }}>불러오는 중...</div>

  const weekMap = {}
  metrics.records.forEach(r => {
    if (!weekMap[r.week]) weekMap[r.week] = { week: r.week, total: 0 }
    weekMap[r.week].total += r.minutesSaved
  })
  const weekData = Object.values(weekMap).sort((a, b) => a.week.localeCompare(b.week))
  const totalActual = metrics.records.reduce((s, r) => s + (r.minutesSaved || 0), 0)
  const totalEst = automations.reduce((s, a) => s + (a.estimatedMinutesSaved || 0), 0)
  const isEmpty = metrics.records.length === 0

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>절감 추적</h1>
      <p style={{ color: '#8E8E93', fontSize: 14, marginBottom: 24 }}>자동화 전후 소요시간 비교 및 실제 절감 시간 기록</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 12, color: '#8E8E93', marginBottom: 4 }}>누적 실제 절감</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#34C759' }}>{Math.floor(totalActual/60)}시간 {totalActual%60}분</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 12, color: '#8E8E93', marginBottom: 4 }}>월 예상 절감 (목표)</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#007AFF' }}>{Math.floor(totalEst/60)}시간 {totalEst%60}분</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>주별 절감 시간 (분)</div>
        {isEmpty ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 14, marginBottom: 6 }}>아직 기록된 데이터가 없습니다</div>
            <div style={{ fontSize: 12 }}>metrics.json의 records 배열에 절감 기록을 추가하세요</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weekData.map(w => ({ ...w, name: formatWeek(w.week) }))} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v}분`, '절감 시간']} />
              <Bar dataKey="total" fill="#007AFF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>기록 방법</div>
        <div style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.8 }}>
          <code style={{ background: '#F2F2F7', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>data/metrics.json</code>의{' '}
          <code style={{ background: '#F2F2F7', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>records</code> 배열에 추가:
        </div>
        <pre style={{ background: '#F2F2F7', borderRadius: 10, padding: '12px 16px', fontSize: 12, marginTop: 12, color: '#3C3C43' }}>
{`{ "week": "2026-W25", "automationId": "auto-001", "minutesSaved": 20 }`}
        </pre>
      </div>
    </div>
  )
}
