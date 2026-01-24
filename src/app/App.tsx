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
        <div
          aria-hidden
          className="
    pointer-events-none
    absolute
    left-1/2
    top-0
    -z-10
    -translate-x-1/2
    translate-y-[10%]
    md:-translate-y-1/3
    lg:-translate-y-1/2
    h-[260px] w-[320px]
    sm:h-[500px] sm:w-[800px]
    md:h-[700px] md:w-[1100px]
    lg:h-[900px] lg:w-[1600px]
    xl:h-[1100px] xl:w-[2000px]
    rounded-full
    bg-[radial-gradient(circle,_rgba(0,45,104,0.95)_0%,_rgba(0,45,104,0.65)_25%,_rgba(0,45,104,0.35)_45%,_rgba(3,7,18,0.2)_60%,_transparent_75%)]
    blur-[80px]
    sm:blur-[120px]
    md:blur-[160px]
    lg:blur-[200px]
  "
        />


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
