/**
 * @file OverviewTab.tsx
 * @description Architecture Overview tab — interactive five-layer GRC map.
 * Click a layer card to expand metrics, tools, and animated pipeline.
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { LAYERS } from '@/lib/constants'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { GRCLayer } from '@/types/grc'

export function OverviewTab() {
  const [activeId, setActiveId]         = useState<string | null>(null)
  const [pipelineStep, setPipelineStep] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeLayer: GRCLayer | undefined = LAYERS.find((l) => l.id === activeId)

  // Animate the pipeline steps when a layer is selected
  useEffect(() => {
    if (!activeLayer) return
    setPipelineStep(0)
    let step = 0
    const total = activeLayer.pipeline.length

    timerRef.current = setInterval(() => {
      step++
      setPipelineStep(Math.min(step, total))
      if (step >= total && timerRef.current) clearInterval(timerRef.current)
    }, 550)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [activeId]) // eslint-disable-line react-hooks/exhaustive-deps

  function toggleLayer(id: string) {
    setActiveId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
        SELECT A LAYER → DRILL DOWN INTO TOOLS, METRICS, AND AUTOMATION LOGIC
      </p>

      {/* Layer cards grid */}
      <div className="grid grid-cols-2 gap-4">
        {LAYERS.map((layer) => {
          const isActive = activeId === layer.id
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className="text-left p-5 border transition-all duration-200 hover:-translate-y-0.5 focus:outline-none"
              style={{
                borderColor: isActive ? layer.color : 'var(--color-border)',
                background: isActive
                  ? `linear-gradient(135deg, var(--color-surface-alt), ${layer.color}18)`
                  : 'var(--color-surface)',
                boxShadow: isActive ? `0 0 20px ${layer.color}22` : 'none',
              }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[9px] tracking-widest mb-1" style={{ color: 'var(--color-text-dim)' }}>
                    {layer.label}
                  </div>
                  <div className="text-base font-bold" style={{ color: layer.color }}>
                    {layer.icon} {layer.shortLabel}
                  </div>
                </div>
                <StatusBadge value={layer.status} color={layer.color} />
              </div>

              {/* Description */}
              <p className="text-[10px] leading-relaxed mb-3" style={{ color: 'var(--color-text-muted)' }}>
                {layer.description}
              </p>

              {/* Tool chips */}
              <div className="flex flex-wrap gap-1.5">
                {layer.tools.slice(0, 3).map((tool) => (
                  <span
                    key={tool}
                    className="text-[9px] px-2 py-0.5 border"
                    style={{
                      background: 'var(--color-surface-alt)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {tool}
                  </span>
                ))}
                {layer.tools.length > 3 && (
                  <span className="text-[9px]" style={{ color: 'var(--color-text-dim)' }}>
                    +{layer.tools.length - 3}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Expanded layer detail */}
      {activeLayer && (
        <div
          className="animate-slide-in border p-6"
          style={{
            borderColor: activeLayer.color,
            background: 'var(--color-surface)',
            boxShadow: `0 0 28px ${activeLayer.color}18`,
          }}
        >
          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {activeLayer.metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-4 border"
                style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
              >
                <div className="text-[9px] tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  {metric.label}
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: activeLayer.color }}>
                  {metric.value}
                </div>
                <div className="text-[9px]" style={{ color: 'var(--color-text-dim)' }}>
                  {metric.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline animation */}
          <div className="text-[9px] tracking-widest mb-3" style={{ color: 'var(--color-text-dim)' }}>
            AUTOMATION PIPELINE
          </div>
          <div className="flex items-center flex-wrap gap-0">
            {activeLayer.pipeline.map((step, i) => (
              <div key={step.step} className="flex items-center">
                <div
                  className="px-3 py-1.5 text-[10px] border transition-all duration-300"
                  style={{
                    background: i <= pipelineStep
                      ? (step.auto ? `${activeLayer.color}18` : 'var(--color-red-glow)')
                      : 'var(--color-surface-alt)',
                    borderColor: i <= pipelineStep
                      ? (step.auto ? activeLayer.color : 'var(--color-red)')
                      : 'var(--color-border)',
                    color: i <= pipelineStep
                      ? (step.auto ? activeLayer.color : 'var(--color-red)')
                      : 'var(--color-text-dim)',
                  }}
                >
                  {step.icon} {step.step}
                  {!step.auto && (
                    <span className="ml-1 text-[8px] opacity-70">HUMAN</span>
                  )}
                </div>
                {i < activeLayer.pipeline.length - 1 && (
                  <span
                    className="px-1 text-xs transition-opacity duration-300"
                    style={{
                      color: 'var(--color-text-dim)',
                      opacity: i < pipelineStep ? 1 : 0.2,
                    }}
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
