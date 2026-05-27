import { io, type Socket } from 'socket.io-client'
import type { EvidenceRecord, Incident, LiveEvent } from '@/types/grc'

const baseUrl = process.env.NEXT_PUBLIC_CREST_BACKEND_URL ?? 'http://localhost:4000'
const token = process.env.NEXT_PUBLIC_CREST_BACKEND_TOKEN ?? ''

type WireEvent = LiveEvent & { id?: string; createdAt?: string }
type WireEvidence = EvidenceRecord & { updatedAt?: string; createdAt?: string }
type WireIncident = Omit<Incident, 'timeline'> & {
  timeline?: Incident['timeline']
  timelineJson?: Incident['timeline']
}

export async function fetchEvents(limit = 30): Promise<LiveEvent[]> {
  const response = await fetch(`${baseUrl}/events?limit=${limit}`, { cache: 'no-store' })
  if (!response.ok) return []

  const payload = (await response.json()) as WireEvent[]
  return payload.map(({ time, layer, msg, severity, auto }) => ({ time, layer, msg, severity, auto }))
}

export async function fetchEvidence(framework?: string): Promise<EvidenceRecord[]> {
  const url = framework && framework !== 'ALL'
    ? `${baseUrl}/evidence?framework=${encodeURIComponent(framework)}`
    : `${baseUrl}/evidence`;

  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) return []
  const payload = (await response.json()) as WireEvidence[]
  return payload.map(({ id, framework: fw, control, status, evidence, lastChecked, nextDue, owner }) => ({
    id,
    framework: fw,
    control,
    status,
    evidence,
    lastChecked,
    nextDue,
    owner,
  }))
}

export async function fetchIncidents(status?: string): Promise<Incident[]> {
  const url = status ? `${baseUrl}/incidents?status=${encodeURIComponent(status)}` : `${baseUrl}/incidents`
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) return []
  
  const payload = (await response.json()) as WireIncident[]
  return payload.map((item) => ({
    id: item.id,
    title: item.title,
    severity: item.severity,
    status: item.status,
    blastRadius: item.blastRadius,
    timeline: item.timeline ?? item.timelineJson ?? [],
    aiSummary: item.aiSummary,
    recommendation: item.recommendation,
  }))
}

export function connectRealtime(): Socket {
  return io(`${baseUrl}/grc`, {
    transports: ['websocket'],
    auth: token ? { token } : undefined,
    extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}
