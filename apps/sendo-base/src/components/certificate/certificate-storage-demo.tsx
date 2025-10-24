"use client";

import { Badge } from "@base-church/ui/components/badge";
import { Button } from "@base-church/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@base-church/ui/components/card";
import {
  AlertCircle,
  CheckCircle,
  Cloud,
  Database,
  Download,
  FileText,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { CertificateManager } from "./certificate-manager";

interface CertificateStorageDemoProps {
  certificateId: string;
  userId: string;
  courseTitle?: string;
  userName?: string;
}

export function CertificateStorageDemo({
  certificateId,
  userId,
  courseTitle = "Curso de Exemplo",
  userName = "Usuário Exemplo",
}: CertificateStorageDemoProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "upload" | "download" | "management"
  >("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold">
          <Cloud className="h-6 w-6 text-blue-600" />
          Supabase Storage para Certificados
        </h2>
        <p className="text-gray-600">
          Sistema integrado para armazenamento e gerenciamento de certificados
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
        {[
          { id: "overview", label: "Visão Geral", icon: Database },
          { id: "upload", label: "Upload", icon: Upload },
          { id: "download", label: "Download", icon: Download },
          { id: "management", label: "Gerenciar", icon: FileText },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="flex-1"
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Benefícios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Benefícios
                </CardTitle>
                <CardDescription>Vantagens do Supabase Storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Escalável</Badge>
                  <span className="text-sm">Suporte a grandes volumes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">CDN Global</Badge>
                  <span className="text-sm">Acesso rápido mundial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Seguro</Badge>
                  <span className="text-sm">Controle de acesso granular</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">URLs Públicas</Badge>
                  <span className="text-sm">Acesso direto aos arquivos</span>
                </div>
              </CardContent>
            </Card>

            {/* Funcionalidades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Funcionalidades
                </CardTitle>
                <CardDescription>Recursos disponíveis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Upload</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Upload de arquivos PDF</li>
                    <li>• Validação de tipo e tamanho</li>
                    <li>• Nomes únicos automáticos</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Download</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Download direto do storage</li>
                    <li>• URLs públicas para visualização</li>
                    <li>• Controle de acesso</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "upload" && (
          <Card>
            <CardHeader>
              <CardTitle>Upload de Certificado</CardTitle>
              <CardDescription>
                Envie um arquivo PDF para o Supabase Storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      Informações do Upload
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Formato aceito: PDF apenas</li>
                    <li>• Tamanho máximo: 10MB</li>
                    <li>• Nome do arquivo será gerado automaticamente</li>
                    <li>• Arquivo será armazenado no Supabase Storage</li>
                  </ul>
                </div>

                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="mb-4 text-gray-600">
                    Use o componente CertificateManager abaixo para fazer upload
                  </p>
                  <Badge variant="outline">
                    Arraste e solte ou clique para selecionar
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "download" && (
          <Card>
            <CardHeader>
              <CardTitle>Download de Certificado</CardTitle>
              <CardDescription>
                Baixe certificados do Supabase Storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <h4 className="mb-2 font-medium text-green-800">
                      Download Direto
                    </h4>
                    <p className="text-sm text-green-700">
                      Baixe o arquivo PDF diretamente do Supabase Storage
                    </p>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h4 className="mb-2 font-medium text-blue-800">
                      Visualização Online
                    </h4>
                    <p className="text-sm text-blue-700">
                      Abra o certificado em uma nova aba para visualização
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium">Como funciona:</h4>
                  <ol className="space-y-1 text-sm text-gray-600">
                    <li>1. O sistema busca o certificado no banco de dados</li>
                    <li>2. Extrai a URL do Supabase Storage</li>
                    <li>3. Faz download do arquivo do storage</li>
                    <li>4. Disponibiliza para download no navegador</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "management" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Certificados</CardTitle>
                <CardDescription>
                  Interface completa para gerenciar certificados com Supabase
                  Storage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CertificateManager
                  certificateId={certificateId}
                  userId={userId}
                  courseTitle={courseTitle}
                  userName={userName}
                  onCertificateChange={() => {
                    console.log("Certificado alterado");
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer com informações técnicas */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div>
              <h4 className="mb-1 font-medium">Storage Bucket</h4>
              <code className="rounded bg-gray-200 px-2 py-1 text-xs">
                certificates
              </code>
            </div>
            <div>
              <h4 className="mb-1 font-medium">Formato de Arquivo</h4>
              <code className="rounded bg-gray-200 px-2 py-1 text-xs">
                application/pdf
              </code>
            </div>
            <div>
              <h4 className="mb-1 font-medium">Tamanho Máximo</h4>
              <code className="rounded bg-gray-200 px-2 py-1 text-xs">
                10MB
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
