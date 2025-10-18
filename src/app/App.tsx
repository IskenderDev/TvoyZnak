import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "@/widgets/layout/Header";
import Footer from "@/shared/components/Footer";
import Container from "@/shared/components/Container";

export default function App() {
  return (
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
  );
}
