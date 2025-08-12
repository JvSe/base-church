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
    },
    {
      path: "../../public/assets/fonts/Belfast-Grotesk-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../public/assets/fonts/Belfast-Grotesk-Semi-Bold.ttf",
      weight: "600",
    },
    {
      path: "../../public/assets/fonts/Belfast-Grotesk-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../public/assets/fonts/Belfast-Grotesk-Black.ttf",
      weight: "900",
    },
  ],
  variable: "--font-belfast",
});

const surgena = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Surgena-Light.ttf",
      weight: "300",
    },
    {
      path: "../../public/assets/fonts/Surgena-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/assets/fonts/Surgena-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../public/assets/fonts/Surgena-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/assets/fonts/Surgena-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../public/assets/fonts/Surgena-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/assets/fonts/Surgena-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../../public/assets/fonts/Surgena-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/assets/fonts/Surgena-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../public/assets/fonts/Surgena-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-surgena",
});

const helvetica = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Helvetica-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-helvetica",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${belfast.variable} ${roboto.variable} ${surgena.variable} ${helvetica.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
