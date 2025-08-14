"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  GraduationCap,
  Users,
} from "lucide-react";

export default function PosGraduacaoPage() {
  return (
    <div className="bg-background space-y-6 p-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Pós-Graduação</h1>
        <p className="text-muted-foreground">
          Programas de pós-graduação em parceria com universidades renomadas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap size={20} className="mr-2" />
              MBA em Tecnologia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-400">
              Especialização em gestão de tecnologia e inovação.
            </p>
            <div className="mb-4 space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <Calendar size={14} className="mr-2" />
                <span>Duração: 18 meses</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Users size={14} className="mr-2" />
                <span>Modalidade: Híbrida</span>
              </div>
            </div>
            <Button className="w-full">
              <ArrowRight size={16} className="mr-2" />
              Saiba Mais
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen size={20} className="mr-2" />
              Especialização em IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-400">
              Pós-graduação em Inteligência Artificial e Machine Learning.
            </p>
            <div className="mb-4 space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <Calendar size={14} className="mr-2" />
                <span>Duração: 12 meses</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Users size={14} className="mr-2" />
                <span>Modalidade: Online</span>
              </div>
            </div>
            <Button className="w-full">
              <ArrowRight size={16} className="mr-2" />
              Saiba Mais
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
