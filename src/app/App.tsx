import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import { AuthProvider } from "@/app/providers/auth/AuthProvider"
import AuthModal from "@/features/auth/ui/AuthModal"
import Header from "@/widgets/layout/Header"
import Footer from "@/widgets/layout/Footer"
import Container from "@/shared/components/Container"

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-dvh flex flex-col md:mx-52 overflow-x-hidden">
        <Header />
      


        <main className="flex-1">
          <Container>
            <Outlet />
          </Container>
        </main>
        <AuthModal />
        <Toaster position="top-right" />
      </div>
      <div className="flex flex-col overflow-hidden"><Footer /></div>

    </AuthProvider>
  )
}
