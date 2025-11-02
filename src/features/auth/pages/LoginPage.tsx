import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthForm } from "@/features/auth/components/AuthForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { paths } from "@/shared/routes/paths";

export function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={paths.carNumberLots.root} replace />;
  }

  return (
    <section className="flex flex-col items-center gap-6 py-10">
      <AuthForm
        title="Вход"
        submitText="Войти"
        loading={loading}
        onSubmit={async (values) => {
          try {
            await login(values);
            toast.success("Добро пожаловать");
          } catch (error) {
            console.error(error);
            toast.error("Неверный email или пароль");
          }
        }}
      />
      <p className="text-sm text-zinc-400">
        Нет аккаунта?{" "}
        <Link to={paths.auth.register} className="text-emerald-400 hover:text-emerald-300">
          Зарегистрируйтесь
        </Link>
      </p>
    </section>
  );
}

export default LoginPage;
