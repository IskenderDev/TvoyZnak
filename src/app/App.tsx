import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "@/widgets/layout/Header";
import Footer from "@/widgets/layout/Footer";
import Container from "@/shared/components/Container";
import { UnauthorizedRedirect } from "@/shared/components/UnauthorizedRedirect";

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          <UnauthorizedRedirect />
          <Outlet />
        </Container>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}
