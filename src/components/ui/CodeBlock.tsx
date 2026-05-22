/**
 * @file CodeBlock.tsx
 * @description Labelled code block with a copy-to-clipboard button.
 * Used in the Code Reference tab and OPA Generator output.
 */

'use client'

import { useState } from 'react'
import { GlowButton } from './GlowButton'

interface CodeBlockProps {
  label: string
  code: string
  /** Accent colour for the label and copy button. */
  color: string
}

export function CodeBlock({ label, code, color }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
      >
        <span className="text-[9px] tracking-widest font-semibold" style={{ color }}>
          {label}
        </span>
        <GlowButton
          color={copied ? 'var(--color-green)' : 'var(--color-text-dim)'}
          onClick={handleCopy}
          className="!px-2 !py-0.5 !text-[9px]"
        >
          {copied ? '✓ COPIED' : 'COPY'}
        </GlowButton>
      </div>

      {/* Code content */}
      <pre
        className="p-4 text-[10px] leading-7 overflow-x-auto max-h-52 overflow-y-auto whitespace-pre-wrap break-words"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}
