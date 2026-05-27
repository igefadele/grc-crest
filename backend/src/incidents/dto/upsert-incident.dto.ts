import { IsArray, IsBoolean, IsIn, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

const severityValues = ['P1', 'P2', 'P3'] as const
const statusValues = ['OPEN', 'CONTAINED', 'RESOLVED'] as const

class TimelineEntryDto {
  @IsString()
  ts!: string

  @IsString()
  event!: string

  @IsBoolean()
  auto!: boolean
}

export class UpsertIncidentDto {
  @IsString()
  id!: string

  @IsString()
  title!: string

  @IsIn(severityValues)
  severity!: (typeof severityValues)[number]

  @IsIn(statusValues)
  status!: (typeof statusValues)[number]

  @IsString()
  blastRadius!: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimelineEntryDto)
  timeline!: TimelineEntryDto[]

  @IsString()
  aiSummary!: string

  @IsString()
  recommendation!: string
}
