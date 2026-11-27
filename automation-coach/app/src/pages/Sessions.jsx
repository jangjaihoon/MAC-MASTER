import React, { useEffect, useState } from 'react'

const PHASE = {
  discovery: { label: '업무 발굴', color: '#007AFF', bg: '#007AFF18' },
  pattern: { label: '패턴 분석', color: '#FF9500', bg: '#FF950018' },
  automation: { label: '자동화 설계', color: '#34C759', bg: '#34C75918' },
  verification: { label: '검증', color: '#AF52DE', bg: '#AF52DE18' },
}

export default function Sessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/sessions-index.json').then(r => r.json()).then(d => { setSessions(d.sessions || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', color: '#8E8E93', paddingTop: 80 }}>불러오는 중...</div>

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>세션 기록</h1>
      <p style={{ color: '#8E8E93', fontSize: 14, marginBottom: 24 }}>코칭 세션 타임라인 · 세부 내용은 sessions/ 폴더의 Markdown 파일 참조</p>

      {sessions.length > 0 && (
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 1 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[...sessions].reverse().map((s, i) => {
              const phase = PHASE[s.phase] || PHASE.discovery
              return (
                <div key={s.id} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: '50%', background: phase.bg, border: `2px solid ${phase.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: phase.color, zIndex: 1 }}>
                    {sessions.length - i}
                  </div>
                  <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: phase.color, background: phase.bg, padding: '2px 8px', borderRadius: 6 }}>{phase.label}</span>
                      <span style={{ fontSize: 12, color: '#8E8E93' }}>{s.date}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.6 }}>{s.summary}</div>
                    <div style={{ marginTop: 10, fontSize: 12, color: '#007AFF' }}>sessions/{s.id}.md</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>새 세션 추가 방법</div>
        <div style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.8 }}>
          1. <code style={{ background: '#F2F2F7', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>sessions/YYYY-MM-DD-[phase].md</code> 파일 생성<br />
          2. <code style={{ background: '#F2F2F7', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>data/sessions-index.json</code>에 메타데이터 추가
        </div>
      </div>
    </div>
  )
}
