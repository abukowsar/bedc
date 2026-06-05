import "./globals.css";
import { Hind_Siliguri } from "next/font/google";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata = {
  title: "Burichang Ershad Degree College | BEDC",
  description:
    "Official website landing page for Burichang Ershad Degree College in Burichang, Cumilla.",
  icons: {
    icon: "/college-mark.svg",
    shortcut: "/college-mark.svg",
    apple: "/college-mark.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={hindSiliguri.variable}>
      <body>{children}</body>
    </html>
  );
}
