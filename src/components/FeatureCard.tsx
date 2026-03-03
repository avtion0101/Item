import React from 'react'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  desc: string
}

export function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="clay-card p-8 text-center hover:bg-orange-50/50">
      <div className="inline-block p-4 rounded-full bg-orange-100 text-[var(--color-primary)] mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-black text-[var(--color-text-main)] mb-3">{title}</h3>
      <p className="text-gray-600 font-medium">{desc}</p>
    </div>
  )
}
