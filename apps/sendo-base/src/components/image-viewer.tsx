"use client";

import { Button } from "@base-church/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@base-church/ui/components/dialog";
import { Download, Eye, ZoomIn, ZoomOut } from "lucide-react";
import { PropsWithChildren, useState } from "react";

type ImageViewerProps = PropsWithChildren<{
  imageBase64?: string | null;
  imageUrl?: string;
  title?: string;
  fileName?: string;
}>;

export function ImageViewer({
  imageBase64,
  imageUrl,
  title = "Visualizar Certificado",
  fileName = "certificado.png",
  children,
}: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(75);

  const handleDownload = () => {
    if (imageBase64) {
      // Download da imagem em base64
      const link = document.createElement("a");
      link.href = imageBase64;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (imageUrl) {
      // Download da imagem por URL
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenUrl = () => {
    if (imageUrl) {
      window.open(imageUrl, "_blank");
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  if (!imageBase64 && !imageUrl) {
    return (
      <div className="dark-bg-tertiary/20 dark-border rounded-lg border p-4 text-center">
        <p className="dark-text-tertiary text-sm">Nenhuma imagem disponível</p>
      </div>
    );
  }

  const imageSrc = imageBase64 || imageUrl;

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
      <DialogContent className="max-h-[calc(100vh-2rem)] min-w-2xl overflow-hidden md:min-w-7xl">
        <DialogHeader>
          <DialogTitle className="dark-text-primary flex items-center justify-between">
            {title}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="dark-border dark-text-tertiary hover:dark-bg-tertiary"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="dark-text-tertiary flex items-center px-2 text-sm">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="dark-border dark-text-tertiary hover:dark-bg-tertiary"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              {imageUrl && (
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

        <div className="mt-4 overflow-auto">
          {imageSrc ? (
            <div className="flex justify-center">
              <img
                src={imageSrc}
                alt={title}
                className="rounded-lg border"
                style={{
                  width: `${zoom}%`,
                  maxWidth: "none",
                }}
              />
            </div>
          ) : (
            <div className="dark-bg-tertiary/20 rounded-lg p-8 text-center">
              <p className="dark-text-secondary mb-4">Imagem não disponível</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
