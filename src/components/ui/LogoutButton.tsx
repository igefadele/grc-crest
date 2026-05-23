'use client'
import { handleLogout } from "@/actions/auth"

export function LogoutButton() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 border text-[9px] tracking-widest"
         style={{ borderColor: 'var(--color-red)', color: 'var(--color-red)' }}
    >
      <form action={handleLogout}>
        <button type="submit">Log Out</button>
      </form>
    </div>
  )
}
