import { IsBoolean, IsIn, IsString } from 'class-validator'

// Allowed severity labels for incoming events
const severityValues = ['blocked', 'healed', 'flagged', 'escalated', 'collected'] as const

/**
 * DTO representing an incoming event payload for ingestion.
 */
export class CreateEventDto {
  @IsString()
  time!: string

  @IsString()
  layer!: string

  @IsString()
  msg!: string

  @IsIn(severityValues)
  severity!: (typeof severityValues)[number]

  @IsBoolean()
  auto!: boolean
}
