"use client";

import type { UserGoal } from "@/src/lib/types/goals";
import { Button } from "@base-church/ui/components/button";
import { Activity, Pen, Plus, Target } from "lucide-react";
import { useState } from "react";
import { SetGoalsModal } from "./set-goals-modal";

type GoalsCardProps = {
  goal: UserGoal | null;
  hoursStudiedThisWeek: number;
  coursesCompletedThisMonth: number;
};

export function GoalsCard({
  goal,
  hoursStudiedThisWeek,
  coursesCompletedThisMonth,
}: GoalsCardProps) {
  const [showModal, setShowModal] = useState(false);

  if (!goal) {
    return (
      <>
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="dark-bg-secondary rounded-xl p-8 text-center">
            <div className="dark-primary-subtle-bg mx-auto mb-4 w-fit rounded-full p-4">
              <Target className="dark-primary" size={32} />
            </div>
            <h3 className="dark-text-primary mb-2 text-lg font-semibold">
              Defina suas metas
            </h3>
            <p className="dark-text-secondary mb-6 text-sm">
              Estabeleça objetivos de estudo e acompanhe seu progresso
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className="dark-btn-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Meta
            </Button>
          </div>
        </div>

        <SetGoalsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          currentGoal={null}
        />
      </>
    );
  }

  // Calculate progress
  const weeklyProgress = Math.min(
    (hoursStudiedThisWeek / goal.weeklyStudyHours) * 100,
    100,
  );
  const monthlyProgress = Math.min(
    (coursesCompletedThisMonth / goal.monthlyCoursesTarget) * 100,
    100,
  );

  return (
    <>
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="dark-text-primary flex items-center gap-2 font-semibold">
            <Target className="dark-warning" size={20} />
            Metas da Semana
          </h3>
        </div>

        <div className="space-y-4">
          {/* Meta de horas semanais */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="dark-text-secondary text-sm font-medium">
                Estudar {goal.weeklyStudyHours}h/semana
              </span>
              <span className="dark-primary text-sm font-semibold">
                {hoursStudiedThisWeek.toFixed(1)}/{goal.weeklyStudyHours}h
              </span>
            </div>
            <div className="dark-bg-tertiary h-2 w-full rounded-full">
              <div
                className="dark-gradient-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${weeklyProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-1">
              <Activity
                className={
                  weeklyProgress >= 100 ? "dark-success" : "dark-secondary"
                }
                size={12}
              />
              <span
                className={`text-xs font-medium ${weeklyProgress >= 100 ? "dark-success" : "dark-secondary"}`}
              >
                {weeklyProgress >= 100
                  ? "Meta atingida! 🎉"
                  : `${Math.round(weeklyProgress)}% completo`}
              </span>
            </div>
          </div>

          {/* Meta de cursos mensais */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="dark-text-secondary text-sm font-medium">
                Concluir {goal.monthlyCoursesTarget} curso
                {goal.monthlyCoursesTarget > 1 ? "s" : ""}/mês
              </span>
              <span className="dark-primary text-sm font-semibold">
                {coursesCompletedThisMonth}/{goal.monthlyCoursesTarget}
              </span>
            </div>
            <div className="dark-bg-tertiary h-2 w-full rounded-full">
              <div
                className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${monthlyProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-1">
              <Target
                className={
                  monthlyProgress >= 100 ? "dark-success" : "dark-warning"
                }
                size={12}
              />
              <span
                className={`text-xs font-medium ${monthlyProgress >= 100 ? "dark-success" : "dark-warning"}`}
              >
                {monthlyProgress >= 100
                  ? "Meta atingida! 🎉"
                  : `${goal.monthlyCoursesTarget - coursesCompletedThisMonth} curso${goal.monthlyCoursesTarget - coursesCompletedThisMonth > 1 ? "s" : ""} restante${goal.monthlyCoursesTarget - coursesCompletedThisMonth > 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="w-full">
            <Button
              variant="info"
              className="dark-text-tertiary hover:dark-text-primary w-full"
              onClick={() => setShowModal(true)}
            >
              <Pen className="mr-2 h-4 w-4" />
              Editar Metas
            </Button>
          </div>
        </div>
      </div>

      <SetGoalsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        currentGoal={goal}
      />
    </>
  );
}
