import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/app/App";
import { paths } from "@/shared/routes/paths";
import { RequireAuth, RequireRole } from "@/app/providers/router/guards";

import HomePage from "@/pages/main/home/HomePage";
import AboutPage from "@/pages/main/about/AboutPage";
import ServicesPage from "@/pages/main/services/ServicesPage";
import NumbersPage from "@/pages/main/numbers/NumbersPage";
import NumberDetailsPage from "@/pages/main/numbers/NumberDetailsPage";
import NewsListPage from "@/pages/main/news/NewsListPage";
import NewsDetailsPage from "@/pages/main/news/NewsDetailsPage";
import ContactsPage from "@/pages/main/contacts/ContactsPage";
import LoginPage from "@/pages/main/auth/LoginPage";
import RegisterPage from "@/pages/main/auth/RegisterPage";
import NotFoundPage from "@/pages/main/not-found/NotFoundPage";
import ProfilePage from "@/pages/main/profile/ProfilePage";

import AdminLayout from "@/pages/admin/AdminLayout";
import AdminNumbersListPage from "@/pages/admin/numbers/AdminNumbersListPage";
import AdminNumberNewPage from "@/pages/admin/numbers/AdminNumberNewPage";
import AdminNumberEditPage from "@/pages/admin/numbers/AdminNumberEditPage";
import AdminNewsListPage from "@/pages/admin/news/AdminNewsListPage";
import AdminNewsNewPage from "@/pages/admin/news/AdminNewsNewPage";
import AdminNewsEditPage from "@/pages/admin/news/AdminNewsEditPage";
import SellNumberPage from "@/pages/main/sellNumber/SellNumber";

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: paths.about, element: <AboutPage /> },
      { path: paths.services, element: <ServicesPage /> },
      { path: paths.numbers, element: <NumbersPage /> },
      { path: paths.numberDetails(), element: <NumberDetailsPage /> },
      { path: paths.news, element: <NewsListPage /> },
      { path: paths.newsDetails(), element: <NewsDetailsPage /> },
      { path: paths.sellNumber, element: <SellNumberPage /> },
      {
        element: <RequireAuth />,
        children: [{ path: paths.profile, element: <ProfilePage /> }],
      },
      { path: paths.contacts, element: <ContactsPage /> },
      { path: paths.auth.login, element: <LoginPage /> },
      { path: paths.auth.register, element: <RegisterPage /> },

      { path: paths.admin.root, element: <Navigate to={paths.admin.numbers} replace /> },

      {
        path: paths.admin.root,
        element: <AdminLayout />,
        children: [
          {
            element: <RequireRole role="admin" />,
            children: [
              { path: paths.admin.numbers, element: <AdminNumbersListPage /> },
              { path: paths.admin.numbersNew, element: <AdminNumberNewPage /> },
              { path: paths.admin.numbersEdit(), element: <AdminNumberEditPage /> },
              { path: paths.admin.news, element: <AdminNewsListPage /> },
              { path: paths.admin.newsNew, element: <AdminNewsNewPage /> },
              { path: paths.admin.newsEdit(), element: <AdminNewsEditPage /> }
            ]
          }
        ]
      },

      { path: paths.notFound, element: <NotFoundPage /> }
    ]
  }
]);
