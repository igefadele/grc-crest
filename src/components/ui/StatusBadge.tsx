/**
 * @file StatusBadge.tsx
 * @description Small bordered label badge used for status indicators,
 * severity levels, AUTO/HUMAN labels, and provider names throughout the UI.
 */

interface StatusBadgeProps {
  value: string
  /** Hex colour string — sets border and text colour. */
  color: string
  className?: string
}

export function StatusBadge({ value, color, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[9px] tracking-widest border font-medium ${className}`}
      style={{ color, borderColor: color, backgroundColor: `${color}18` }}
    >
      {value}
    </span>
  )
}
