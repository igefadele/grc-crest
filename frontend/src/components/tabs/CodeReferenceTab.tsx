/**
 * @file CodeReferenceTab.tsx
 * @description Code Reference tab — displays production rule samples
 * for each of the five GRC layers with individual copy buttons.
 */

'use client'

import { LAYERS } from '@/lib/constants'
import { CodeBlock } from '@/components/ui/CodeBlock'

export function CodeReferenceTab() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
        PRODUCTION RULE SAMPLES — COPY DIRECTLY INTO YOUR PROJECT
      </p>

      <div className="grid grid-cols-2 gap-4">
        {LAYERS.map((layer) => (
          <CodeBlock
            key={layer.id}
            label={`${layer.icon} ${layer.shortLabel.toUpperCase()}`}
            code={layer.exampleRule}
            color={layer.color}
          />
        ))}
      </div>
    </div>
  )
}
