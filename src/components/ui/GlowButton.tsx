/**
 * @file GlowButton.tsx
 * @description Primary action button with coloured border glow.
 * Used for AI trigger buttons, copy actions, and primary CTAs.
 */

interface GlowButtonProps {
  color: string
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export function GlowButton({
  color,
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: GlowButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 text-[10px] tracking-widest border
        transition-all duration-150 cursor-pointer
        hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed
        font-mono
        ${className}
      `}
      style={{
        color,
        borderColor: color,
        backgroundColor: `${color}18`,
      }}
    >
      {children}
    </button>
  )
}
