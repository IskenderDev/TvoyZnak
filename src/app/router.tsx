import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/app/App";
import { paths } from "@/shared/routes/paths";
import { RequireRole } from "@/shared/components/RequireRole";
import { RequireAuth } from "@/shared/components/RequireAuth";

import HomePage from "@/pages/home/HomePage";
import AboutPage from "@/pages/about/AboutPage";
import ServicesPage from "@/pages/services/ServicesPage";
import CarNumberLotsPage from "@/pages/car-number-lots/CarNumberLotsPage";
import CarNumberLotDetailsPage from "@/pages/car-number-lots/CarNumberLotDetailsPage";
import MyCarNumberLotsPage from "@/pages/car-number-lots/MyCarNumberLotsPage";
import NewsListPage from "@/pages/news/NewsListPage";
import NewsDetailsPage from "@/pages/news/NewsDetailsPage";
import ContactsPage from "@/pages/contacts/ContactsPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import SellNumberPage from "@/pages/sellNumber/SellNumber";

import AdminLayout from "@/pages/admin/AdminLayout";
import AdminCarNumberLotsListPage from "@/pages/admin/lots/AdminCarNumberLotsListPage";
import AdminCarNumberLotNewPage from "@/pages/admin/lots/AdminCarNumberLotNewPage";
import AdminCarNumberLotEditPage from "@/pages/admin/lots/AdminCarNumberLotEditPage";
import AdminUsersListPage from "@/pages/admin/users/AdminUsersListPage";
import AdminPostsListPage from "@/pages/admin/posts/AdminPostsListPage";
import AdminPostNewPage from "@/pages/admin/posts/AdminPostNewPage";
import AdminPostEditPage from "@/pages/admin/posts/AdminPostEditPage";

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: paths.about, element: <AboutPage /> },
      { path: paths.services, element: <ServicesPage /> },
      { path: paths.carNumberLots, element: <CarNumberLotsPage /> },
      { path: paths.carNumberLotDetails(), element: <CarNumberLotDetailsPage /> },
      { path: paths.news, element: <NewsListPage /> },
      { path: paths.newsDetails(), element: <NewsDetailsPage /> },
      { path: paths.sellNumber, element: <SellNumberPage /> },
      { path: paths.contacts, element: <ContactsPage /> },
      { path: paths.auth.login, element: <LoginPage /> },
      { path: paths.auth.register, element: <RegisterPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: paths.profile, element: <ProfilePage /> },
          { path: paths.myLots, element: <MyCarNumberLotsPage /> },
        ],
      },
      { path: paths.admin.root, element: <Navigate to={paths.admin.carNumberLots} replace /> },
      {
        path: paths.admin.root,
        element: <AdminLayout />,
        children: [
          {
            element: <RequireRole role="admin" />,
            children: [
              { path: paths.admin.carNumberLots, element: <AdminCarNumberLotsListPage /> },
              { path: paths.admin.carNumberLotNew, element: <AdminCarNumberLotNewPage /> },
              { path: paths.admin.carNumberLotEdit(), element: <AdminCarNumberLotEditPage /> },
              { path: paths.admin.users, element: <AdminUsersListPage /> },
              { path: paths.admin.posts, element: <AdminPostsListPage /> },
              { path: paths.admin.postNew, element: <AdminPostNewPage /> },
              { path: paths.admin.postEdit(), element: <AdminPostEditPage /> },
            ],
          },
        ],
      },
      { path: paths.notFound, element: <NotFoundPage /> },
    ],
  },
]);
