"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ArrowRight, BookOpen, Mail, MessageCircle } from "lucide-react";

export default function AjudaPage() {
  return (
    <div className="bg-background space-y-6 p-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Central de Ajuda</h1>
        <p className="text-muted-foreground">
          Encontre respostas para suas dúvidas e obtenha suporte
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen size={20} className="mr-2" />
              FAQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-400">
              Perguntas frequentes sobre a plataforma e cursos.
            </p>
            <Button className="w-full">
              <ArrowRight size={16} className="mr-2" />
              Ver FAQ
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle size={20} className="mr-2" />
              Suporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-400">
              Entre em contato com nossa equipe de suporte.
            </p>
            <Button className="w-full">
              <ArrowRight size={16} className="mr-2" />
              Abrir Ticket
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail size={20} className="mr-2" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-400">
              Envie um email diretamente para nossa equipe.
            </p>
            <Button className="w-full">
              <ArrowRight size={16} className="mr-2" />
              Enviar Email
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
