"use client";

import { Button } from "@base-church/ui/components/button";
import { Card } from "@base-church/ui/components/card";
import {
  Archive,
  Download,
  File,
  FileText,
  Image,
  Music,
  Video,
} from "lucide-react";

type Material = {
  id: string;
  name: string;
  type: string;
  url?: string;
  size?: string;
  description?: string;
};

type DownloadMaterialsProps = {
  materials: Material[];
  courseTitle: string;
};

export function DownloadMaterials({
  materials,
  courseTitle,
}: DownloadMaterialsProps) {
  const getFileIcon = (type: string) => {
    const fileType = type.toLowerCase();

    if (fileType.includes("pdf") || fileType.includes("document")) {
      return <FileText size={16} className="dark-text-primary" />;
    } else if (
      fileType.includes("image") ||
      fileType.includes("jpg") ||
      fileType.includes("png")
    ) {
      return <Image size={16} className="dark-text-primary" />;
    } else if (fileType.includes("video") || fileType.includes("mp4")) {
      return <Video size={16} className="dark-text-primary" />;
    } else if (fileType.includes("audio") || fileType.includes("mp3")) {
      return <Music size={16} className="dark-text-primary" />;
    } else if (fileType.includes("zip") || fileType.includes("rar")) {
      return <Archive size={16} className="dark-text-primary" />;
    } else {
      return <File size={16} className="dark-text-primary" />;
    }
  };

  const handleDownload = (material: Material) => {
    if (material.url) {
      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = material.url;
      link.download = material.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback for materials without URL
      console.log("Downloading:", material.name);
      // Here you would implement the actual download logic
    }
  };

  if (!materials || materials.length === 0) {
    return (
      <Card className="dark-bg-primary dark-border p-4">
        <div className="dark-bg-secondary rounded-lg p-6 text-center">
          <div className="dark-bg-tertiary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
            <FileText className="dark-text-tertiary" size={20} />
          </div>
          <h4 className="dark-text-primary mb-2 text-sm font-medium">
            Nenhum material disponível
          </h4>
          <p className="dark-text-tertiary text-xs">
            Este curso não possui materiais para download.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="dark-bg-primary dark-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="dark-text-primary text-lg font-semibold">
          Materiais para Download
        </h3>
        <span className="dark-text-tertiary text-sm">
          {materials.length} {materials.length === 1 ? "arquivo" : "arquivos"}
        </span>
      </div>

      <div className="space-y-3">
        {materials.map((material, index) => (
          <div
            key={material.id || index}
            className="dark-bg-secondary hover:dark-bg-tertiary flex items-center justify-between rounded-lg p-3 transition-all"
          >
            <div className="flex min-w-0 flex-1 items-center space-x-3">
              <div className="dark-bg-tertiary flex-shrink-0 rounded-lg p-2">
                {getFileIcon(material.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="dark-text-primary truncate text-sm font-medium">
                  {material.name}
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="dark-text-tertiary">{material.type}</span>
                  {material.size && (
                    <>
                      <span className="dark-text-tertiary">•</span>
                      <span className="dark-text-tertiary">
                        {material.size}
                      </span>
                    </>
                  )}
                </div>
                {material.description && (
                  <div className="dark-text-secondary mt-1 truncate text-xs">
                    {material.description}
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(material)}
              className="dark-text-secondary hover:dark-text-primary flex-shrink-0"
            >
              <Download size={14} className="mr-1" />
              Baixar
            </Button>
          </div>
        ))}
      </div>

      {/* Course Info Footer */}
      <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
        <div className="dark-text-tertiary text-center text-xs">
          Materiais do curso:{" "}
          <span className="dark-text-primary font-medium">{courseTitle}</span>
        </div>
      </div>
    </Card>
  );
}
