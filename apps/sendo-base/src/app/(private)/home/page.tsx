import { getEvents, getUserProfile } from "@/src/lib/actions";
import { getSessionFromCookies } from "@/src/lib/helpers/session.helper";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { HomeClientWrapper } from "./components/home-client-wrapper";

export const metadata: Metadata = {
  title: "Início",
};

export default async function DashboardPage() {
  // Get session from cookies
  const cookieStore = await cookies();
  const session = getSessionFromCookies(cookieStore);

  // Fetch user data and events in parallel
  const [userDataResult, eventsResult] = await Promise.all([
    session?.userId
      ? getUserProfile(session.userId)
      : Promise.resolve({ success: true, user: null }),
    getEvents(),
  ]);

  const userData = userDataResult?.user || null;
  const eventsData = eventsResult.events || [];

  return <HomeClientWrapper userData={userData} eventsData={eventsData} />;
}
