import { Outlet } from "react-router-dom";
import Header from "@/shared/components/Header";
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
    </div>
  );
}
