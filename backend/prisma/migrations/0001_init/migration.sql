-- CreateTable
CREATE TABLE "GrcEvent" (
  "id" TEXT NOT NULL,
  "time" TEXT NOT NULL,
  "layer" TEXT NOT NULL,
  "msg" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "auto" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GrcEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrcEvidenceRecord" (
  "id" TEXT NOT NULL,
  "framework" TEXT NOT NULL,
  "control" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "evidence" TEXT NOT NULL,
  "lastChecked" TIMESTAMP(3) NOT NULL,
  "nextDue" TEXT NOT NULL,
  "owner" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GrcEvidenceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrcIncident" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "blastRadius" TEXT NOT NULL,
  "timelineJson" JSONB NOT NULL,
  "aiSummary" TEXT NOT NULL,
  "recommendation" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GrcIncident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GrcEvent_createdAt_idx" ON "GrcEvent"("createdAt" DESC);
CREATE INDEX "GrcEvidenceRecord_framework_idx" ON "GrcEvidenceRecord"("framework");
CREATE INDEX "GrcEvidenceRecord_status_idx" ON "GrcEvidenceRecord"("status");
CREATE INDEX "GrcEvidenceRecord_updatedAt_idx" ON "GrcEvidenceRecord"("updatedAt" DESC);
CREATE INDEX "GrcIncident_status_idx" ON "GrcIncident"("status");
CREATE INDEX "GrcIncident_severity_idx" ON "GrcIncident"("severity");
CREATE INDEX "GrcIncident_updatedAt_idx" ON "GrcIncident"("updatedAt" DESC);
