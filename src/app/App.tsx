import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/app/providers/auth/AuthProvider";
import AuthModal from "@/features/auth/ui/AuthModal";
import Header from "@/widgets/layout/Header";
import Footer from "@/widgets/layout/Footer";
import Container from "@/shared/components/Container";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-dvh flex flex-col md:mx-52 overflow-x-hidden">
        <Header />
            <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          left-1/2 top-0
          -z-10
          -translate-x-1/2 -translate-y-1/2
          md:h-[1000px] md:w-[1800px]
          h-[800px] w-[500px]
          rounded-full
          bg-[radial-gradient(circle,rgba(0,45,104,0.95)_0%,rgba(0,45,104,0.65)_25%,rgba(0,45,104,0.35)_45%,rgba(3,7,18,0.2)_60%,transparent_75%)]
          blur-[160px]
          opacity-100
        "
      />
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
