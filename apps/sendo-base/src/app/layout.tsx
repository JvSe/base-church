import { Roboto } from "next/font/google";
import localFont from "next/font/local";

import { Providers } from "@/src/components/providers";
import "../global.css";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-roboto",
});

const belfast = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Belfast-Grotesk-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Belfast-Grotesk-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Belfast-Grotesk-Semi-Bold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Belfast-Grotesk-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Belfast-Grotesk-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-belfast",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${belfast.variable} ${roboto.variable} font-belfast antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
