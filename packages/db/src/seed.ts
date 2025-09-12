import { prisma } from "./client";

import type { User } from "@prisma/client";

const DEFAULT_NOTIFICATION_SETTINGS = {
  email: {
    courseUpdates: true,
    newCourses: true,
    eventReminders: true,
    communityPosts: false,
    achievements: true,
    weeklyDigest: true,
  },
  push: {
    courseUpdates: true,
    newCourses: false,
    eventReminders: true,
    communityPosts: false,
    achievements: true,
  },
  sms: {
    eventReminders: false,
    urgentUpdates: false,
  },
};

const DEFAULT_USERS = [
  // Add your own user to pre-populate the database with
  {
    name: "Tim Apple",
    email: "tim@apple.com",
    cpf: "123.456.789-00",
    birthDate: new Date("1990-01-01"),
    phone: "(11) 99999-9999",
    notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
  },
] as Array<Partial<User>>;

(async () => {
  try {
    await Promise.all(
      DEFAULT_USERS.map((user) =>
        prisma.user.upsert({
          where: {
            email: user.email!,
          },
          update: {
            ...user,
          },
          create: {
            ...user,
          },
        })
      )
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
