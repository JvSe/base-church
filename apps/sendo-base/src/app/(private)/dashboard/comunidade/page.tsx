"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ArrowRight, Calendar, MessageCircle, Users } from "lucide-react";

export default function ComunidadePage() {
  return (
    <div className="bg-background space-y-6 p-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Comunidade</h1>
        <p className="text-muted-foreground">
          Conecte-se com outros desenvolvedores e participe da comunidade
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users size={20} className="mr-2" />
              Discord
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-400">
              Junte-se ao nosso servidor no Discord e participe de discussões em
              tempo real.
            </p>
            <Button className="w-full">
              <ArrowRight size={16} className="mr-2" />
              Entrar no Discord
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle size={20} className="mr-2" />
              Fórum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-400">
              Faça perguntas, compartilhe conhecimento e ajude outros
              desenvolvedores.
            </p>
            <Button className="w-full" asChild>
              <a href="/dashboard/forum">
                <ArrowRight size={16} className="mr-2" />
                Acessar Fórum
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar size={20} className="mr-2" />
              Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-400">
              Participe de eventos online e presenciais da comunidade.
            </p>
            <Button className="w-full" asChild>
              <a href="/dashboard/eventos">
                <ArrowRight size={16} className="mr-2" />
                Ver Eventos
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
