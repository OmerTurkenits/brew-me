'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export interface AggregatedOrder {
  label: string
  count: number
  names: string[]
  special: string | null
}

export interface IndividualOrder {
  id: string
  name: string
  oneLiner: string
  drink: string
  milk: string
  temp: string
  sugar: string
  special: string | null
}

interface Props {
  aggregated: AggregatedOrder[]
  individual: IndividualOrder[]
}

export default function SummaryTabs({ aggregated, individual }: Props) {
  const t = useTranslations('groups')
  const [tab, setTab] = useState<'aggregate' | 'individual'>('aggregate')

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex bg-white border border-border-line rounded-xl p-1 gap-1">
        {(['aggregate', 'individual'] as const).map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
              ${tab === id
                ? 'bg-brand-dark text-amber-text'
                : 'text-muted-text hover:text-brand-dark'
              }`}
          >
            {t(id)}
          </button>
        ))}
      </div>

      {/* Aggregate view */}
      {tab === 'aggregate' && (
        <div className="flex flex-col gap-3">
          {aggregated.length === 0 ? (
            <p className="text-sm text-muted-text text-center py-8">{t('noActiveProfile')}</p>
          ) : (
            aggregated.map((item, i) => (
              <div key={i} className="bg-white border border-border-line rounded-[14px] p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-medium text-brand-dark text-sm">{item.label}</p>
                  <span className="shrink-0 text-xs font-semibold bg-brand-accent text-white px-2.5 py-1 rounded-full">
                    ×{item.count}
                  </span>
                </div>
                <p className="text-xs text-muted-text">{item.names.join(', ')}</p>
                {item.special && (
                  <p className="text-xs text-section-label mt-1.5 italic">"{item.special}"</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Individual view */}
      {tab === 'individual' && (
        <div className="flex flex-col gap-3">
          {individual.map((item) => (
            <div key={item.id} className="bg-white border border-border-line rounded-[14px] p-4">
              <p className="font-medium text-brand-dark mb-1">{item.name}</p>
              {item.oneLiner ? (
                <>
                  <p className="text-sm text-muted-text">{item.oneLiner}</p>
                  <div className="mt-2 pt-2 border-t border-border-line grid grid-cols-2 gap-1 text-xs text-muted-text">
                    <span>☕ {item.drink}</span>
                    <span>🥛 {item.milk}</span>
                    <span>🌡 {item.temp}</span>
                    <span>🍬 {item.sugar}</span>
                    {item.special && (
                      <span className="col-span-2 text-section-label italic">"{item.special}"</span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-text">{t('noActiveProfile')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
