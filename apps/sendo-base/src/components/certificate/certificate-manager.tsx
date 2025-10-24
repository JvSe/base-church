"use client";

import { Button } from "@base-church/ui/components/button";
import { Download, ExternalLink, FileText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  deleteCertificateFromStorage,
  downloadCertificateFromStorage,
  getCertificatePublicUrl,
} from "../../lib/actions/certificate";
import { CertificateUpload } from "./certificate-upload";

interface CertificateManagerProps {
  certificateId: string;
  userId: string;
  courseTitle?: string;
  userName?: string;
  onCertificateChange?: () => void;
}

export function CertificateManager({
  certificateId,
  userId,
  courseTitle,
  userName,
  onCertificateChange,
}: CertificateManagerProps) {
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar URL do certificado ao montar o componente
  useEffect(() => {
    loadCertificateUrl();
  }, [certificateId]);

  const loadCertificateUrl = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getCertificatePublicUrl(certificateId);

      if (result.success) {
        setCertificateUrl(result.url || null);
      } else if (result.error !== "Certificado não possui arquivo associado") {
        setError(result.error || "Erro ao carregar certificado");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const result = await downloadCertificateFromStorage(certificateId);

      if (result.success && result.data) {
        const blob = new Blob([result.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `certificado-${courseTitle || "curso"}-${userName || "usuario"}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError(result.error || "Erro no download");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no download");
    }
  };

  const handleView = () => {
    if (certificateUrl) {
      window.open(certificateUrl, "_blank");
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este certificado? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    try {
      const result = await deleteCertificateFromStorage(certificateId);

      if (result.success) {
        setCertificateUrl(null);
        onCertificateChange?.();
        console.log("✅ Certificado excluído com sucesso");
      } else {
        setError(result.error || "Erro na exclusão");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na exclusão");
    }
  };

  const handleUploadSuccess = (url: string) => {
    setCertificateUrl(url);
    setError(null);
    onCertificateChange?.();
  };

  const handleUploadError = (error: string) => {
    setError(error);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-1/4 rounded bg-gray-200"></div>
          <div className="h-8 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informações do Certificado */}
      <div className="rounded-lg border bg-gray-50 p-4">
        <h3 className="mb-2 text-lg font-semibold">Certificado</h3>
        {courseTitle && (
          <p className="mb-1 text-sm text-gray-600">
            <strong>Curso:</strong> {courseTitle}
          </p>
        )}
        {userName && (
          <p className="mb-1 text-sm text-gray-600">
            <strong>Aluno:</strong> {userName}
          </p>
        )}
        <p className="text-sm text-gray-600">
          <strong>Status:</strong> {certificateUrl ? "Emitido" : "Pendente"}
        </p>
      </div>

      {/* Erro */}
      {error && (
        <div className="rounded border border-red-300 bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {/* Certificado Existe */}
      {certificateUrl ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                Certificado Disponível
              </span>
            </div>
            <p className="text-sm text-green-700">
              O certificado foi emitido e está disponível para download.
            </p>
          </div>

          {/* Ações do Certificado */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleView} variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visualizar
            </Button>

            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
            </Button>

            <Button onClick={handleDelete} variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      ) : (
        /* Upload de Certificado */
        <CertificateUpload
          certificateId={certificateId}
          userId={userId}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      )}
    </div>
  );
}
