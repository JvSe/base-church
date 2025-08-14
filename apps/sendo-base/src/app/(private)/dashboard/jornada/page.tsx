"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  Flame,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function JornadaPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock data - in real app this would come from server actions
  const userStats = {
    totalCourses: 12,
    completedCourses: 8,
    totalLessons: 156,
    completedLessons: 124,
    totalHours: 89,
    currentStreak: 7,
    longestStreak: 21,
    totalPoints: 15420,
    level: 15,
    rank: "Ouro",
    achievements: 23,
  };

  const achievements = [
    {
      id: "1",
      title: "Primeiro Passo",
      description: "Complete sua primeira aula",
      icon: "🎯",
      isUnlocked: true,
      unlockedAt: new Date("2024-01-01"),
      points: 100,
    },
    {
      id: "2",
      title: "Estudioso",
      description: "Complete 10 aulas",
      icon: "📚",
      isUnlocked: true,
      unlockedAt: new Date("2024-01-05"),
      points: 250,
    },
    {
      id: "3",
      title: "Maratona",
      description: "Mantenha uma sequência de 7 dias",
      icon: "🔥",
      isUnlocked: true,
      unlockedAt: new Date("2024-01-10"),
      points: 500,
    },
    {
      id: "4",
      title: "Especialista",
      description: "Complete um curso completo",
      icon: "🏆",
      isUnlocked: true,
      unlockedAt: new Date("2024-01-12"),
      points: 1000,
    },
    {
      id: "5",
      title: "Mestre",
      description: "Complete 5 cursos",
      icon: "👑",
      isUnlocked: false,
      progress: 3,
      target: 5,
      points: 2000,
    },
    {
      id: "6",
      title: "Comunidade",
      description: "Faça 10 comentários no fórum",
      icon: "💬",
      isUnlocked: false,
      progress: 7,
      target: 10,
      points: 300,
    },
  ];

  const recentActivity = [
    {
      id: "1",
      type: "lesson_completed",
      title: "Aula concluída: Introdução ao React Native",
      description: "Você completou a aula 'O Que Você Vai Aprender'",
      course: "React Native com Expo",
      points: 50,
      timestamp: new Date("2024-01-15T14:30:00"),
    },
    {
      id: "2",
      type: "course_enrolled",
      title: "Novo curso: Node.js - API REST",
      description: "Você se matriculou no curso de Node.js",
      course: "Node.js - API REST com Express",
      points: 25,
      timestamp: new Date("2024-01-14T10:15:00"),
    },
    {
      id: "3",
      type: "achievement_unlocked",
      title: "Conquista desbloqueada: Maratona",
      description: "Você manteve uma sequência de 7 dias de estudo",
      points: 500,
      timestamp: new Date("2024-01-13T09:45:00"),
    },
    {
      id: "4",
      type: "lesson_completed",
      title: "Aula concluída: Configurando o ambiente",
      description: "Você completou a aula 'Configurando o ambiente'",
      course: "React Native com Expo",
      points: 50,
      timestamp: new Date("2024-01-12T16:20:00"),
    },
    {
      id: "5",
      type: "forum_post",
      title: "Nova publicação no fórum",
      description: "Você criou uma publicação sobre React Native",
      points: 10,
      timestamp: new Date("2024-01-11T11:30:00"),
    },
  ];

  const weeklyProgress = [
    { day: "Seg", lessons: 3, hours: 2.5 },
    { day: "Ter", lessons: 5, hours: 4.0 },
    { day: "Qua", lessons: 2, hours: 1.5 },
    { day: "Qui", lessons: 4, hours: 3.0 },
    { day: "Sex", lessons: 6, hours: 4.5 },
    { day: "Sáb", lessons: 3, hours: 2.0 },
    { day: "Dom", lessons: 1, hours: 0.5 },
  ];

  const monthlyProgress = [
    { week: "Sem 1", lessons: 15, hours: 12.5 },
    { week: "Sem 2", lessons: 18, hours: 14.0 },
    { week: "Sem 3", lessons: 22, hours: 16.5 },
    { week: "Sem 4", lessons: 20, hours: 15.0 },
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return "Agora mesmo";
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d atrás`;
    }
  };

  const getProgressPercentage = () => {
    return Math.round(
      (userStats.completedCourses / userStats.totalCourses) * 100,
    );
  };

  const getLevelProgress = () => {
    return (userStats.totalPoints % 1000) / 10; // Progress within current level
  };

  return (
    <div className="bg-background space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Minha Jornada</h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e conquistas na plataforma
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-dark-2 hover:bg-dark-2/50 hover:border-primary/50"
          >
            <Calendar size={16} className="mr-2" />
            Exportar relatório
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="from-primary to-primary-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg">
                <BookOpen size={24} className="text-primary-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Cursos Concluídos
                </p>
                <p className="text-foreground text-2xl font-bold">
                  {userStats.completedCourses}/{userStats.totalCourses}
                </p>
              </div>
            </div>
            <Progress
              value={getProgressPercentage()}
              className="bg-dark-2 mt-4"
            />
          </CardContent>
        </Card>

        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="from-secondary to-secondary-1 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg">
                <Clock size={24} className="text-secondary-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Horas Estudadas</p>
                <p className="text-foreground text-2xl font-bold">
                  {userStats.totalHours}h
                </p>
              </div>
            </div>
            <div className="text-muted-foreground mt-4 flex items-center text-sm">
              <Flame size={14} className="text-secondary mr-1" />
              <span>Sequência atual: {userStats.currentStreak} dias</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="from-dark-2 to-primary/20 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg">
                <Trophy size={24} className="text-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Nível</p>
                <p className="text-foreground text-2xl font-bold">
                  {userStats.level}
                </p>
              </div>
            </div>
            <Progress value={getLevelProgress()} className="bg-dark-2 mt-4" />
            <p className="text-primary mt-2 text-sm font-semibold">
              {userStats.totalPoints} pontos
            </p>
          </CardContent>
        </Card>

        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="from-primary to-primary-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg">
                <Award size={24} className="text-primary-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Conquistas</p>
                <p className="text-foreground text-2xl font-bold">
                  {userStats.achievements}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground mt-4 flex items-center text-sm">
              <Crown size={14} className="text-secondary mr-1" />
              <span>Rank: {userStats.rank}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Progresso Semanal</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedPeriod === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("week")}
                className={
                  selectedPeriod === "week"
                    ? "bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg"
                    : "border-dark-2 hover:bg-dark-2/50 hover:border-primary/50"
                }
              >
                Semana
              </Button>
              <Button
                variant={selectedPeriod === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("month")}
                className={
                  selectedPeriod === "month"
                    ? "bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg"
                    : "border-dark-2 hover:bg-dark-2/50 hover:border-primary/50"
                }
              >
                Mês
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedPeriod === "week" ? (
              <div className="grid grid-cols-7 gap-4">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="text-center">
                    <p className="text-muted-foreground mb-2 text-sm">
                      {day.day}
                    </p>
                    <div className="bg-dark-2 flex h-32 flex-col justify-end rounded-lg p-2">
                      <div
                        className="from-primary to-primary-2 rounded-t bg-gradient-to-t"
                        style={{ height: `${(day.hours / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {day.hours}h
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {monthlyProgress.map((week, index) => (
                  <div key={index} className="text-center">
                    <p className="text-muted-foreground mb-2 text-sm">
                      {week.week}
                    </p>
                    <div className="bg-dark-2 flex h-32 flex-col justify-end rounded-lg p-2">
                      <div
                        className="from-primary to-primary-2 rounded-t bg-gradient-to-t"
                        style={{ height: `${(week.hours / 20) * 100}%` }}
                      />
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {week.hours}h
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="bg-dark-1/30 border-dark-1 grid w-full grid-cols-3">
          <TabsTrigger
            value="achievements"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            <Trophy size={16} className="mr-2" />
            Conquistas
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            <Clock size={16} className="mr-2" />
            Atividade Recente
          </TabsTrigger>
          <TabsTrigger
            value="goals"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            <Target size={16} className="mr-2" />
            Metas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${achievement.isUnlocked ? "" : "opacity-60"}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 text-4xl">{achievement.icon}</div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    {achievement.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {achievement.description}
                  </p>

                  {achievement.isUnlocked ? (
                    <div className="space-y-2">
                      <Badge
                        variant="secondary"
                        className="from-secondary to-secondary-1 text-secondary-foreground bg-gradient-to-r shadow-lg"
                      >
                        <CheckCircle size={12} className="mr-1" />
                        Desbloqueado
                      </Badge>
                      <p className="text-muted-foreground bg-dark-1/30 rounded-lg px-3 py-2 text-xs">
                        {achievement.unlockedAt?.toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="text-primary font-semibold">
                          {achievement.progress}/{achievement.target}
                        </span>
                      </div>
                      <Progress
                        value={
                          ((achievement?.progress ?? 0) /
                            (achievement?.target ?? 0)) *
                          100
                        }
                        className="bg-dark-2"
                      />
                    </div>
                  )}

                  <div className="text-primary mt-4 flex items-center justify-center text-sm font-semibold">
                    <Star size={14} className="text-secondary mr-1" />
                    <span>{achievement.points} pontos</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <Card
                key={activity.id}
                className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="from-primary to-primary-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg">
                      {activity.type === "lesson_completed" && (
                        <CheckCircle
                          size={20}
                          className="text-primary-foreground"
                        />
                      )}
                      {activity.type === "course_enrolled" && (
                        <BookOpen
                          size={20}
                          className="text-primary-foreground"
                        />
                      )}
                      {activity.type === "achievement_unlocked" && (
                        <Trophy size={20} className="text-primary-foreground" />
                      )}
                      {activity.type === "forum_post" && (
                        <Users size={20} className="text-primary-foreground" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="text-foreground font-semibold">
                        {activity.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {activity.description}
                      </p>
                      {activity.course && (
                        <p className="text-primary text-sm">
                          {activity.course}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-secondary flex items-center text-sm font-semibold">
                        <Star size={14} className="mr-1" />
                        <span>+{activity.points}</span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Target size={20} className="mr-2" />
                  Metas Diárias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Aulas por dia</span>
                  <span className="text-primary font-semibold">3/5</span>
                </div>
                <Progress value={60} className="bg-dark-2" />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Horas por dia</span>
                  <span className="text-primary font-semibold">2.5/3</span>
                </div>
                <Progress value={83} className="bg-dark-2" />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Sequência de dias
                  </span>
                  <span className="text-primary font-semibold">7/30</span>
                </div>
                <Progress value={23} className="bg-dark-2" />
              </CardContent>
            </Card>

            <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Trophy size={20} className="mr-2" />
                  Metas Mensais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Cursos completos
                  </span>
                  <span className="text-primary font-semibold">2/3</span>
                </div>
                <Progress value={67} className="bg-dark-2" />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Conquistas</span>
                  <span className="text-primary font-semibold">5/8</span>
                </div>
                <Progress value={63} className="bg-dark-2" />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nível</span>
                  <span className="text-primary font-semibold">15/20</span>
                </div>
                <Progress value={75} className="bg-dark-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
