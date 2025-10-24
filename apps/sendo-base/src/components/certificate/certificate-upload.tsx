"use client";

import { Button } from "@base-church/ui/components/button";
import { Download, ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  deleteCertificateFromStorage,
  downloadCertificateFromStorage,
  getCertificatePublicUrl,
  uploadCertificateToStorage,
} from "../../lib/actions/certificate";

interface CertificateUploadProps {
  certificateId: string;
  userId: string;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export function CertificateUpload({
  certificateId,
  userId,
  onUploadSuccess,
  onUploadError,
}: CertificateUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (file.type !== "application/pdf") {
      setError("Apenas arquivos PDF são permitidos");
      return;
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Arquivo muito grande. Máximo 10MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadCertificateToStorage(
        certificateId,
        file,
        userId,
        file.name,
      );

      if (result.success) {
        setCertificateUrl(result.storageUrl || null);
        onUploadSuccess?.(result.storageUrl || "");
        console.log("✅ Certificado enviado com sucesso:", result.storageUrl);
      } else {
        setError(result.error || "Erro no upload");
        onUploadError?.(result.error || "Erro no upload");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const result = await downloadCertificateFromStorage(certificateId);

      if (result.success && result.data) {
        // Criar blob e fazer download
        const blob = new Blob([result.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `certificado-${certificateId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError(result.error || "Erro no download");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGetPublicUrl = async () => {
    try {
      const result = await getCertificatePublicUrl(certificateId);

      if (result.success) {
        setCertificateUrl(result.url || null);
        // Abrir em nova aba
        window.open(result.url, "_blank");
      } else {
        setError(result.error || "Erro ao obter URL");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este certificado?")) return;

    try {
      const result = await deleteCertificateFromStorage(certificateId);

      if (result.success) {
        setCertificateUrl(null);
        console.log("✅ Certificado excluído com sucesso");
      } else {
        setError(result.error || "Erro na exclusão");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Gerenciar Certificado</h3>

      {error && (
        <div className="rounded border border-red-300 bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {/* Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Enviar Certificado (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
          {isUploading && (
            <p className="mt-1 text-sm text-blue-600">Enviando...</p>
          )}
        </div>

        {/* Status e ações */}
        {certificateUrl && (
          <div className="rounded border border-green-300 bg-green-100 p-3 text-green-700">
            <p className="text-sm font-medium">Certificado disponível</p>
            <p className="text-xs break-all text-green-600">{certificateUrl}</p>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleGetPublicUrl}
            variant="outline"
            size="sm"
            disabled={!certificateUrl}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Certificado
          </Button>

          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            disabled={!certificateUrl || isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Baixando..." : "Baixar PDF"}
          </Button>

          <Button
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            disabled={!certificateUrl}
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
