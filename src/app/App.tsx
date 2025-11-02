import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import Container from "@/shared/components/layout/Container";

export function App() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0b0b0c] text-white">
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

export default App;
