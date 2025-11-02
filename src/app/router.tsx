import { Navigate, createBrowserRouter } from "react-router-dom";

import { App } from "@/app/App";
import { CarNumberLotCreatePage } from "@/features/car-number-lots/pages/CarNumberLotCreatePage";
import { CarNumberLotDetailsPage } from "@/features/car-number-lots/pages/CarNumberLotDetailsPage";
import { CarNumberLotsListPage } from "@/features/car-number-lots/pages/CarNumberLotsListPage";
import { MyCarNumberLotsPage } from "@/features/car-number-lots/pages/MyCarNumberLotsPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { HomePage } from "@/features/home/pages/HomePage";
import { NotFoundPage } from "@/features/not-found/pages/NotFoundPage";
import { AdminDashboardLayout } from "@/features/admin/pages/AdminDashboardLayout";
import { AdminCarNumberLotsPage } from "@/features/admin/pages/AdminCarNumberLotsPage";
import { AdminUsersPage } from "@/features/admin/pages/AdminUsersPage";
import { AdminPostsPage } from "@/features/admin/pages/AdminPostsPage";
import { PostsPage } from "@/features/posts/pages/PostsPage";
import { RequireRole } from "@/shared/components/RequireRole";
import { paths } from "@/shared/routes/paths";

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: paths.carNumberLots.root, element: <CarNumberLotsListPage /> },
      { path: paths.carNumberLots.details(), element: <CarNumberLotDetailsPage /> },
      { path: paths.carNumberLots.create, element: <CarNumberLotCreatePage /> },
      {
        path: paths.carNumberLots.mine,
        element: <RequireRole />,
        children: [{ index: true, element: <MyCarNumberLotsPage /> }],
      },
      { path: paths.posts.root, element: <PostsPage /> },
      { path: paths.auth.login, element: <LoginPage /> },
      { path: paths.auth.register, element: <RegisterPage /> },
      {
        path: paths.admin.root,
        element: <AdminDashboardLayout />,
        children: [
          { path: paths.admin.root, element: <Navigate to={paths.admin.lots} replace /> },
          { path: paths.admin.lots, element: <AdminCarNumberLotsPage /> },
          { path: paths.admin.users, element: <AdminUsersPage /> },
          { path: paths.admin.posts, element: <AdminPostsPage /> },
        ],
      },
      { path: paths.notFound, element: <NotFoundPage /> },
    ],
  },
]);
