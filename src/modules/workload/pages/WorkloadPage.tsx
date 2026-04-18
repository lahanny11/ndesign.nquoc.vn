'use client'

// src/modules/workload/pages/WorkloadPage.tsx
import { useWorkload } from '../hooks/useWorkload'
import { WorkloadCard } from '../components/WorkloadCard'

export default function WorkloadPage() {
  const { data, isLoading } = useWorkload()

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1D1D1F', marginBottom: 16 }}>
        Workload Designer
      </h2>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 130, borderRadius: 12, background: 'rgba(0,0,0,0.05)', animation: 'pulse 1.5s infinite' }}/>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {(data ?? []).map(designer => (
            <WorkloadCard key={designer.person_id} designer={designer} />
          ))}
        </div>
      )}
    </div>
  )
}
