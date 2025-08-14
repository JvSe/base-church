"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import {
  ChevronRight,
  Code,
  Edit,
  GraduationCap,
  Plus,
  Rocket,
  Share,
} from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app this would come from server actions
  const user = {
    id: "1",
    name: "Pr. João Vitor Soares Egidio Nunes",
    username: "@jvsen",
    email: "joaovitorsoares12@gmail.com",
    image: "/api/placeholder/150/150",
    role: "Pastor e Líder Ministerial",
    bio: "Pastor apaixonado por criar bases ministeriais sólidas com princípios bíblicos e liderança eficaz.",
    location: null,
    skills: null,
    academicBackground: null,
    highlights: null,
    joinDate: new Date("2019-08-22"),
    profileCompletion: 25,
  };

  const certificates = [
    {
      id: "1",
      title: "NLW Journey - Nodejs",
      course: "NLW Journey",
      issuedAt: new Date("2024-07-12"),
      icon: "🚀",
    },
  ];

  const badges = [
    {
      id: "1",
      name: "Pastor",
      icon: "✝️",
      color: "bg-gradient-to-br from-primary to-primary-2",
    },
    {
      id: "2",
      name: "BASE CHURCH JOURNEY",
      icon: "B",
      color: "bg-gradient-to-br from-secondary to-secondary-1",
    },
    {
      id: "3",
      name: "Líder",
      icon: "🏆",
      color: "bg-gradient-to-br from-dark-2 to-primary/20",
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-background flex flex-1 gap-6 px-6">
      {/* Left Column - Profile Info */}
      <div className="w-80 space-y-6">
        {/* Profile Card */}
        <Card className="border-dark-1 bg-dark-1/50 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardContent className="p-6">
            <div className="mb-4 flex justify-end space-x-2">
              <Button variant="ghost" size="sm">
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share size={16} />
              </Button>
            </div>

            <div className="text-center">
              <Avatar className="ring-primary/20 mx-auto mb-4 h-24 w-24 ring-4">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-foreground mb-1 text-xl font-bold">
                {user.name}
              </h2>
              <p className="text-muted-foreground mb-2 font-medium">
                {user.username}
              </p>
              <p className="text-primary mb-4 font-semibold">{user.role}</p>

              <div className="mb-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-dark-2 hover:bg-dark-2/50 hover:border-primary/50 w-full transition-all duration-200"
                >
                  <Plus size={16} className="mr-2" />
                  Localização
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-dark-2 hover:bg-dark-2/50 hover:border-primary/50 w-full transition-all duration-200"
                >
                  <Plus size={16} className="mr-2" />
                  Destacar ministérios
                </Button>
              </div>

              <p className="text-muted-foreground bg-dark-1/30 rounded-lg px-3 py-2 text-sm">
                Membro da Base Church desde {formatDate(user.joinDate)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Links Section */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground text-base">Links</CardTitle>
              <Button variant="ghost" size="sm" className="hover:bg-dark-2/50">
                <Edit size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="border-dark-2 hover:bg-dark-2/50 hover:border-primary/50 h-12 w-12 p-0 transition-all duration-200"
                >
                  <Plus size={16} />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-base">
              Insígnias • {badges.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`${badge.color} text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full font-bold shadow-lg transition-all duration-200 hover:scale-110`}
                >
                  {badge.icon}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Profile Details */}
      <div className="flex-1 space-y-6">
        {/* Profile Completion */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground text-base">
                Complete seu perfil
              </CardTitle>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              Perfis completos atraem mais oportunidades!
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">Progresso</span>
                <span className="text-primary font-semibold">
                  {user.profileCompletion}% completo
                </span>
              </div>
              <Progress
                value={user.profileCompletion}
                className="bg-dark-2 h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground text-base">Sobre</CardTitle>
              <Button variant="ghost" size="sm" className="hover:bg-dark-2/50">
                <Edit size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
          </CardContent>
        </Card>

        {/* Highlights Section */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground text-base">
                Destaques
              </CardTitle>
              <Button variant="ghost" size="sm" className="hover:bg-dark-2/50">
                <Plus size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <Rocket size={48} className="text-primary mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Compartilhe o link dos seus melhores ministérios para se
                destacar e conquistar oportunidades
              </p>
              <Button className="bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg">
                <Plus size={16} className="mr-2" />
                Adicionar destaques
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Academic Background */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground text-base">
                Formação ministerial
              </CardTitle>
              <Button variant="ghost" size="sm" className="hover:bg-dark-2/50">
                <Plus size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <GraduationCap
                size={48}
                className="text-secondary mx-auto mb-4"
              />
              <p className="text-muted-foreground mb-4">
                Compartilhe sua formação ministerial para se destacar.
              </p>
              <Button className="bg-secondary hover:bg-secondary/90 hover:shadow-secondary/25 text-secondary-foreground shadow-lg">
                <Plus size={16} className="mr-2" />
                Formação ministerial
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground text-base">
                Habilidades
              </CardTitle>
              <Button variant="ghost" size="sm" className="hover:bg-dark-2/50">
                <Edit size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <Code size={48} className="text-primary mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Adicione suas habilidades ministeriais para se destacar.
              </p>
              <Button className="bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg">
                <Plus size={16} className="mr-2" />
                Adicionar habilidades
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
