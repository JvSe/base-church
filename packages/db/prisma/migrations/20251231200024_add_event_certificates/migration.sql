-- CreateTable
CREATE TABLE "event_certificates" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT,
    "status" "CertificateStatus" NOT NULL DEFAULT 'PENDING',
    "issuedAt" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "certificateBase64" TEXT,
    "verificationCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_certificates_verificationCode_key" ON "event_certificates"("verificationCode");

-- AddForeignKey
ALTER TABLE "event_certificates" ADD CONSTRAINT "event_certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_certificates" ADD CONSTRAINT "event_certificates_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_certificates" ADD CONSTRAINT "event_certificates_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "event_certificate_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
