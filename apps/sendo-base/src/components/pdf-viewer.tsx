"use client";

import { Button } from "@base-church/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@base-church/ui/components/dialog";
import { Download, Eye } from "lucide-react";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";

type PdfViewerProps = PropsWithChildren<{
  pdfBase64?: string | null;
  certificateUrl?: string;
  title?: string;
  fileName?: string;
}>;

export function PdfViewer({
  pdfBase64,
  certificateUrl,
  title = "Visualizar Certificado",
  fileName = "certificado.pdf",
  children,
}: PdfViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const pdfUrl = useMemo(() => {
    if (!pdfBase64) return null;
    
    // Se já tem o prefixo data:, usar diretamente
    if (pdfBase64.startsWith("data:")) {
      return pdfBase64;
    }
    
    // Criar blob URL para melhor compatibilidade
    try {
      const base64Data = pdfBase64.includes(",")
        ? pdfBase64.split(",")[1]
        : pdfBase64;
      
      if (!base64Data) {
        return null;
      }
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Erro ao criar URL do PDF:", error);
      // Fallback para data URI
      return `data:application/pdf;base64,${pdfBase64}`;
    }
  }, [pdfBase64]);

  // Limpar blob URL quando componente desmontar ou URL mudar
  useEffect(() => {
    return () => {
      if (pdfUrl && pdfUrl.startsWith("blob:")) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleDownload = () => {
    if (pdfBase64) {
      // Download do PDF em base64
      try {
        const base64Data = pdfBase64?.includes(",")
          ? pdfBase64.split(",")[1]
          : pdfBase64;
        
        if (!base64Data) {
          console.error("Dados base64 inválidos");
          return;
        }
        
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erro ao fazer download:", error);
      }
    } else if (certificateUrl) {
      // Download do PDF por URL
      const link = document.createElement("a");
      link.href = certificateUrl;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenUrl = () => {
    if (certificateUrl) {
      window.open(certificateUrl, "_blank");
    }
  };

  if (!pdfBase64 && !certificateUrl) {
    return (
      <div className="dark-bg-tertiary/20 dark-border rounded-lg border p-4 text-center">
        <p className="dark-text-tertiary text-sm">
          Nenhum documento disponível
        </p>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="dark-border dark-text-tertiary hover:dark-bg-tertiary"
          >
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-2xl md:min-w-7xl">
        <DialogHeader>
          <DialogTitle className="dark-text-primary flex items-center justify-between">
            {title}
            <div className="flex gap-2">
              {certificateUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenUrl}
                  className="dark-border dark-text-tertiary hover:dark-bg-tertiary"
                >
                  Abrir URL
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="dark-border dark-text-tertiary hover:dark-bg-tertiary"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {pdfBase64 && pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="h-[800px] w-full rounded-lg border"
              title="Visualização do PDF"
              style={{ border: "none" }}
            />
          ) : certificateUrl ? (
            <div className="dark-bg-tertiary/20 rounded-lg p-8 text-center">
              <p className="dark-text-secondary mb-4">
                Clique no botão abaixo para visualizar o certificado
              </p>
              <Button
                onClick={handleOpenUrl}
                className="dark-bg-primary hover:dark-bg-primary/90"
              >
                <Eye className="mr-2 h-4 w-4" />
                Abrir Certificado
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
