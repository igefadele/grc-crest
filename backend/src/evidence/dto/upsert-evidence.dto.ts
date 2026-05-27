import { IsIn, IsString } from 'class-validator'

const frameworkValues = ['SOC 2', 'ISO 27001', 'NIST 800-53', 'GDPR'] as const
const statusValues = ['PASS', 'FAIL', 'WARN', 'COLLECTING'] as const
const ownerValues = ['AUTO', 'HUMAN'] as const

export class UpsertEvidenceDto {
  @IsString()
  id!: string

  @IsIn(frameworkValues)
  framework!: (typeof frameworkValues)[number]

  @IsString()
  control!: string

  @IsIn(statusValues)
  status!: (typeof statusValues)[number]

  @IsString()
  evidence!: string

  @IsString()
  lastChecked!: string

  @IsString()
  nextDue!: string

  @IsIn(ownerValues)
  owner!: (typeof ownerValues)[number]
}
