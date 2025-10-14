import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/app/App";
import { paths } from "@/shared/routes/paths";
import { RequireRole } from "@/shared/components/RequireRole";

import HomePage from "@/pages/home/HomePage";
import AboutPage from "@/pages/about/AboutPage";
import ServicesPage from "@/pages/services/ServicesPage";
import NumbersPage from "@/pages/numbers/NumbersPage";
import NumberDetailsPage from "@/pages/numbers/NumberDetailsPage";
import NewsListPage from "@/pages/news/NewsListPage";
import NewsDetailsPage from "@/pages/news/NewsDetailsPage";
import ContactsPage from "@/pages/contacts/ContactsPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";

import AdminLayout from "@/pages/admin/AdminLayout";
import AdminNumbersListPage from "@/pages/admin/numbers/AdminNumbersListPage";
import AdminNumberNewPage from "@/pages/admin/numbers/AdminNumberNewPage";
import AdminNumberEditPage from "@/pages/admin/numbers/AdminNumberEditPage";
import AdminNewsListPage from "@/pages/admin/news/AdminNewsListPage";
import AdminNewsNewPage from "@/pages/admin/news/AdminNewsNewPage";
import AdminNewsEditPage from "@/pages/admin/news/AdminNewsEditPage";
import SellNumber from '@/pages/sellNumber/SellNumber'

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
      { path: paths.sellNumber, element: <SellNumber /> },
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
