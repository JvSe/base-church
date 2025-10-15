import { cn } from "@base-church/ui/lib/utils";
import { TrendingUp, type LucideIcon } from "lucide-react";

/**
 * StatsCard - Componente unificado para cards de estatísticas
 *
 * Substituiu código duplicado em dashboard/courses/page.tsx
 * Antes: 4 cards quase idênticos (~96 linhas)
 * Depois: Componente reutilizável (~16 linhas de uso)
 *
 * @example
 * <StatsCard
 *   label="Total de Cursos"
 *   value={totalCourses}
 *   icon={BookOpen}
 *   iconBg="dark-primary-subtle-bg"
 *   iconColor="dark-primary"
 *   trend={{
 *     value: "+12%",
 *     label: "vs mês passado",
 *     isPositive: true
 *   }}
 * />
 */

type IconConfig = {
  icon: LucideIcon;
  bgClass: string;
  iconClass: string;
};

type TrendInfo = {
  value: string | number;
  label?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
};

type StatsCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  iconConfig?: IconConfig;
  trend?: TrendInfo;
  className?: string;
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  iconBg = "dark-primary-subtle-bg",
  iconColor = "dark-primary",
  iconConfig,
  trend,
  className,
}: StatsCardProps) {
  // Se iconConfig for fornecido, usa ele ao invés das props individuais
  const FinalIcon = iconConfig?.icon || Icon;
  const finalIconBg = iconConfig?.bgClass || iconBg;
  const finalIconColor = iconConfig?.iconClass || iconColor;
  const TrendIcon = trend?.icon || TrendingUp;

  return (
    <div className={cn("dark-card dark-shadow-sm rounded-xl p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="dark-text-tertiary text-sm font-medium">{label}</p>
          <p className="dark-text-primary text-2xl font-bold">{value}</p>
        </div>
        {FinalIcon && (
          <div className={cn("rounded-xl p-3", finalIconBg)}>
            <FinalIcon className={finalIconColor} size={24} />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center text-sm">
          {TrendIcon && (
            <TrendIcon
              className={cn(
                "mr-1",
                trend.isPositive !== false ? "dark-success" : "dark-warning",
              )}
              size={16}
            />
          )}
          <span
            className={cn(
              "font-medium",
              trend.isPositive !== false ? "dark-success" : "dark-warning",
            )}
          >
            {trend.value}
          </span>
          {trend.label && (
            <span className="dark-text-secondary ml-1">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
