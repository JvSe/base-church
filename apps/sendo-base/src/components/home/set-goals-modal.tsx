"use client";

import { useAuth } from "@/src/hooks/auth";
import { setUserGoal } from "@/src/lib/actions";
import { calculateGoalEstimates } from "@/src/lib/helpers/goals-helpers";
import { Button } from "@base-church/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@base-church/ui/components/dialog";
import { BookOpen, Calendar, Clock, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type SetGoalsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentGoal?: {
    dailyStudyHours: number;
  } | null;
};

// Opções fixas de tempo
const TIME_OPTIONS = [
  { label: "15 min", value: 0.25, icon: "⚡" },
  { label: "30 min", value: 0.5, icon: "🔥" },
  { label: "45 min", value: 0.75, icon: "💪" },
  { label: "1 hora", value: 1, icon: "🎯" },
  { label: "1h30", value: 1.5, icon: "⭐" },
  { label: "2 horas", value: 2, icon: "🚀" },
];

export function SetGoalsModal({
  isOpen,
  onClose,
  currentGoal,
}: SetGoalsModalProps) {
  const [isPending, startTransition] = useTransition();
  const [dailyHours, setDailyHours] = useState(
    currentGoal?.dailyStudyHours?.toString() || "1",
  );
  const userId = useAuth((s) => s.user?.id);
  const router = useRouter();

  const estimates = calculateGoalEstimates(Number(dailyHours) || 1);

  function handleQuickSelect(value: number) {
    setDailyHours(value.toString());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const hours = Number(dailyHours);

    if (!hours || hours <= 0 || hours > 24) {
      toast.error("Digite um valor entre 0.5 e 24 horas");
      return;
    }

    if (!userId) {
      toast.error("Usuário não identificado");
      return;
    }

    startTransition(async () => {
      const result = await setUserGoal(userId, hours);

      if (result.success) {
        toast.success("Meta definida com sucesso!");
        onClose();
        // Refresh the page to show updated data
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao definir meta");
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark-glass max-h-[85vh] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="dark-text-primary flex items-center gap-2 text-xl font-bold">
            <Target className="dark-primary" size={24} />
            Definir Metas de Estudo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Time Selection Buttons */}
          <div className="flex flex-col gap-2">
            <label className="dark-text-primary text-sm font-medium">
              Quantas horas por dia você pretende estudar?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleQuickSelect(option.value)}
                  className={`dark-card dark-shadow-sm group flex flex-col items-center justify-center rounded-lg p-4 transition-all hover:scale-[1.02] ${
                    Number(dailyHours) === option.value
                      ? "dark-gradient-primary"
                      : "hover:dark-border-hover"
                  }`}
                >
                  <span className="mb-1 text-2xl">{option.icon}</span>
                  <span
                    className={`text-xs font-semibold ${
                      Number(dailyHours) === option.value
                        ? "text-white"
                        : "dark-text-secondary group-hover:dark-text-primary"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="dark-text-tertiary text-xs">
              💡 Recomendamos entre 1 e 2 horas por dia
            </p>
          </div>

          {/* Estimativas em tempo real */}
          <div className="dark-glass space-y-3 rounded-xl p-4">
            <h3 className="dark-text-primary flex items-center gap-2 text-base font-bold">
              <TrendingUp className="dark-secondary" size={20} />
              Com essa meta você alcançará:
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Horas semanais */}
              <div className="dark-card dark-shadow-sm group relative overflow-hidden rounded-lg p-3 transition-all hover:scale-105">
                <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-br from-purple-500/10 to-transparent" />
                <div className="relative">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="dark-text-tertiary text-xs font-medium">
                      Por semana
                    </span>
                    <div className="dark-primary-subtle-bg rounded p-1.5">
                      <Clock className="dark-primary" size={14} />
                    </div>
                  </div>
                  <p className="dark-text-primary mb-0.5 text-2xl font-bold">
                    {estimates.weeklyHours}h
                  </p>
                  <p className="dark-text-tertiary text-[10px]">
                    de estudo semanal
                  </p>
                </div>
              </div>

              {/* Horas mensais */}
              <div className="dark-card dark-shadow-sm group relative overflow-hidden rounded-lg p-3 transition-all hover:scale-105">
                <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-br from-blue-500/10 to-transparent" />
                <div className="relative">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="dark-text-tertiary text-xs font-medium">
                      Por mês
                    </span>
                    <div className="dark-secondary-subtle-bg rounded p-1.5">
                      <Calendar className="dark-secondary" size={14} />
                    </div>
                  </div>
                  <p className="dark-text-primary mb-0.5 text-2xl font-bold">
                    {estimates.monthlyHours}h
                  </p>
                  <p className="dark-text-tertiary text-[10px]">
                    de estudo mensal
                  </p>
                </div>
              </div>

              {/* Cursos por mês */}
              <div className="dark-card dark-shadow-sm group relative overflow-hidden rounded-lg p-3 transition-all hover:scale-105">
                <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-br from-green-500/10 to-transparent" />
                <div className="relative">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="dark-text-tertiary text-xs font-medium">
                      Cursos/mês
                    </span>
                    <div className="dark-success-bg rounded p-1.5">
                      <BookOpen className="dark-success" size={14} />
                    </div>
                  </div>
                  <p className="dark-text-primary mb-0.5 text-2xl font-bold">
                    {estimates.estimatedCoursesPerMonth}
                  </p>
                  <p className="dark-text-tertiary text-[10px]">
                    curso{estimates.estimatedCoursesPerMonth > 1 ? "s" : ""} por
                    mês
                  </p>
                </div>
              </div>

              {/* Dias por curso */}
              <div className="dark-card dark-shadow-sm group relative overflow-hidden rounded-lg p-3 transition-all hover:scale-105">
                <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-br from-yellow-500/10 to-transparent" />
                <div className="relative">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="dark-text-tertiary text-xs font-medium">
                      Tempo/curso
                    </span>
                    <div className="dark-warning-bg rounded p-1.5">
                      <Target className="dark-warning" size={14} />
                    </div>
                  </div>
                  <p className="dark-text-primary mb-0.5 text-2xl font-bold">
                    ~{estimates.estimatedDaysToCompleteCourse}
                  </p>
                  <p className="dark-text-tertiary text-[10px]">
                    dia{estimates.estimatedDaysToCompleteCourse > 1 ? "s" : ""}{" "}
                    por curso
                  </p>
                </div>
              </div>
            </div>

            <div className="dark-border-t border-t pt-3">
              <div className="dark-primary-subtle-bg rounded-lg p-3">
                <p className="dark-text-primary text-xs">
                  <span className="text-sm">💡</span> <strong>Dica:</strong>{" "}
                  Metas realistas são mais fáceis de manter!
                </p>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              disabled={isPending}
              variant="ghost"
              className="dark-glass dark-border hover:dark-border-hover"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="dark-btn-primary"
            >
              {isPending ? "Salvando..." : "Salvar Meta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
