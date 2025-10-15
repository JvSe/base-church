"use client";

import { ImageViewer } from "@/src/components/image-viewer";
import { Award, CheckCircle, Lock } from "lucide-react";

type CertificateCardProps = {
  course: any;
  certificate: any;
};

export function CertificateCard({ course, certificate }: CertificateCardProps) {
  if (!course.certificateTemplate) return null;

  return (
    <div className="dark-border mt-auto mb-6 border-t">
      <div className="p-4 transition-all duration-300 hover:-translate-y-1">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h4 className="dark-text-primary font-medium">
              Certificado de Conclusão
            </h4>
            {certificate ? (
              <Award size={14} className="dark-success" />
            ) : (
              <Lock size={14} className="dark-text-tertiary" />
            )}
          </div>
        </div>

        {certificate ? (
          <ImageViewer
            imageBase64={certificate.template?.templateUrl || undefined}
            imageUrl={certificate.template?.templateUrl || undefined}
            title={`Certificado: ${course.title}`}
            fileName={`certificado-${course.title.replace(/\s+/g, "-").toLowerCase()}.png`}
          >
            <div className="cursor-pointer space-y-3">
              <div className="rounded-lg bg-green-500/10 p-3">
                <div className="mb-2 flex items-center space-x-2">
                  <CheckCircle size={16} className="dark-success" />
                  <span className="dark-text-success text-sm font-medium">
                    🎉 Certificado Disponível!
                  </span>
                </div>
                <p className="dark-text-secondary text-xs">
                  Parabéns! Você concluiu o curso e pode baixar seu certificado.
                </p>
              </div>
            </div>
          </ImageViewer>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-yellow-500/10 p-3">
              <div className="mb-2 flex items-center space-x-2">
                <Lock size={16} className="dark-text-yellow" />
                <span className="dark-text-yellow text-sm font-medium">
                  🔒 Certificado Bloqueado
                </span>
              </div>
              <p className="dark-text-secondary text-xs">
                Complete todas as aulas do curso para desbloquear seu
                certificado.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
