import React, { useEffect, useState } from 'react'

const STATUS = {
  planned: { label: '계획중', color: '#8E8E93', bg: '#8E8E9318' },
  'in-progress': { label: '진행중', color: '#FF9500', bg: '#FF950018' },
  done: { label: '완료', color: '#34C759', bg: '#34C75918' },
  abandoned: { label: '중단', color: '#FF3B30', bg: '#FF3B3018' },
}
const LEVEL = { template: '템플릿', checklist: '체크리스트', skill: '스킬 등록', script: '스크립트' }

export default function Automations() {
  const [automations, setAutomations] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/data/automations.json').then(r => r.json()),
      fetch('/data/task-map.json').then(r => r.json()),
    ]).then(([a, t]) => { setAutomations(a.automations || []); setTasks(t.tasks || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', color: '#8E8E93', paddingTop: 80 }}>불러오는 중...</div>

  const taskMap = Object.fromEntries(tasks.map(t => [t.id, t]))
  const totalEst = automations.reduce((s, a) => s + (a.estimatedMinutesSaved || 0), 0)
  const doneCount = automations.filter(a => a.status === 'done').length

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>자동화 현황</h1>
      <p style={{ color: '#8E8E93', fontSize: 14, marginBottom: 24 }}>설계·구현·검증 중인 자동화 항목</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: '전체 자동화', value: `${automations.length}개` },
          { label: '완료', value: `${doneCount}개` },
          { label: '예상 월 절감', value: `${Math.floor(totalEst/60)}시간 ${totalEst%60}분`, accent: true },
        ].map(item => (
          <div key={item.label} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 12, color: '#8E8E93', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: item.accent ? '#007AFF' : '#1C1C1E' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {automations.map(a => {
          const s = STATUS[a.status] || STATUS.planned
          const task = taskMap[a.taskId]
          return (
            <div key={a.id} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#8E8E93', background: '#F2F2F7', padding: '2px 8px', borderRadius: 6 }}>{LEVEL[a.level] || a.level}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.color, background: s.bg, padding: '2px 8px', borderRadius: 6 }}>{s.label}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{a.name}</div>
              {task && <div style={{ fontSize: 12, color: '#8E8E93', marginBottom: 8 }}>대상 업무: {task.name}</div>}
              <div style={{ fontSize: 13, color: '#3C3C43', marginBottom: 12, lineHeight: 1.5 }}>{a.description}</div>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 10 }}>
                <div style={{ fontSize: 11, color: '#8E8E93' }}>예상 절감</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#007AFF' }}>월 {a.estimatedMinutesSaved}분</div>
              </div>
            </div>
          )
        })}
        <div style={{ background: 'rgba(0,122,255,0.04)', borderRadius: 16, padding: '18px 20px', border: '1.5px dashed rgba(0,122,255,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 140, gap: 8 }}>
          <div style={{ fontSize: 28, color: '#007AFF' }}>+</div>
          <div style={{ fontSize: 13, color: '#007AFF', fontWeight: 600 }}>새 자동화 추가</div>
          <div style={{ fontSize: 11, color: '#8E8E93', textAlign: 'center' }}>automations.json에 항목 추가</div>
        </div>
      </div>
    </div>
  )
}
