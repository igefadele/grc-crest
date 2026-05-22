/**
 * @file layout.tsx
 * @description Layout for authentication pages (/login).
 *
 * Deliberately minimal — no sidebar, no navigation, no GRC chrome.
 * The auth pages must feel deliberately separate from the application.
 */

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-bg)' }}
    >
      {children}
    </div>
  )
}
