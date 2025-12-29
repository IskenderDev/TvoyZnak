import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import { AuthProvider } from "@/app/providers/auth/AuthProvider";
import AuthModal from "@/features/auth/ui/AuthModal";
import Header from "@/widgets/layout/Header";
import Footer from "@/widgets/layout/Footer";
import Container from "@/shared/components/Container";

export default function App() {
  useEffect(() => {
    const updateVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--app-vh", `${vh}px`)
    }

    updateVh()
    window.addEventListener("resize", updateVh)
    window.addEventListener("orientationchange", updateVh)

    return () => {
      window.removeEventListener("resize", updateVh)
      window.removeEventListener("orientationchange", updateVh)
    }
  }, [])

  return (
    <AuthProvider>
      <div className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1">
          <Container>
            <Outlet />
          </Container>
        </main>
        <Footer />
        <AuthModal />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}
