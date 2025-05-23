"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  LayoutGridIcon,
  ListIcon,
  MenuIcon,
  MountainIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Component() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week");
  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
        <div className="flex items-center gap-2 px-4 py-6">
          <MountainIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">Agendify</span>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <HomeIcon className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <CalendarIcon className="h-5 w-5" />
            Calendar
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <UsersIcon className="h-5 w-5" />
            Clients
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <SettingsIcon className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <h1 className="text-lg font-semibold">
              {currentMonth} {currentYear}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4" />
              New Event
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <UserIcon className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>John Doe</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Week
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                Month
              </Button>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-7 gap-4">
              <div className="col-span-7 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePreviousMonth}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </Button>
                  <span className="text-lg font-semibold">
                    {currentMonth} {currentYear}
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                    <ChevronRightIcon className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <CalendarIcon className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ListIcon className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <LayoutGridIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {viewMode === "week" ? (
                daysOfWeek.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center py-2 text-sm font-medium"
                  >
                    {day}
                  </div>
                ))
              ) : (
                <>
                  {daysOfWeek.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center py-2 text-sm font-medium"
                    >
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div
                      key={index}
                      className="flex h-20 items-center justify-center rounded-md bg-muted/20 text-sm font-medium"
                    >
                      {new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        -(firstDayOfMonth - index)
                      ).getDate()}
                    </div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, index) => (
                    <div
                      key={index + firstDayOfMonth}
                      className={`flex h-20 items-center justify-center rounded-md ${
                        index + 1 === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth()
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/20"
                      } text-sm font-medium`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </>
              )}
              <div className="col-span-7 grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Meeting</CardTitle>
                    <CardDescription>10:00 AM - 11:00 AM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Avatar className="border">
                        <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">John Doe</div>
                        <div className="text-sm text-muted-foreground">
                          Client
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Design Review</CardTitle>
                    <CardDescription>2:00 PM - 3:00 PM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Avatar className="border">
                        <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Jane Doe</div>
                        <div className="text-sm text-muted-foreground">
                          Designer
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
