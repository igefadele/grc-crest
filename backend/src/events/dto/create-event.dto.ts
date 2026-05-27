import { IsBoolean, IsIn, IsString } from 'class-validator'

const severityValues = ['blocked', 'healed', 'flagged', 'escalated', 'collected'] as const

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
