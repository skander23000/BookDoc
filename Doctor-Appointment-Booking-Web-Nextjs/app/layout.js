import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { Toaster } from "sonner";
import { RoleProvider } from "./_context/RoleContext";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={outfit.className}>
        <div>
          <RoleProvider>
            <Header />
            {children}
            <Toaster />
          </RoleProvider>
        </div>
        {/* <Footer/> */}
      </body>
    </html>
  );
}
