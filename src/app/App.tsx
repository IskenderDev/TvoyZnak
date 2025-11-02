import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/app/providers/auth/AuthProvider";
import { AuthDialogProvider } from "@/app/providers/auth-dialog/AuthDialogContext";
import Header from "@/widgets/layout/Header";
import Footer from "@/widgets/layout/Footer";
import Container from "@/shared/components/Container";

export default function App() {
  return (
    <AuthDialogProvider>
      <AuthProvider>
        <div className="min-h-dvh flex flex-col">
          <Header />
          <main className="flex-1">
            <Container>
              <Outlet />
            </Container>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </AuthDialogProvider>
  );
}
