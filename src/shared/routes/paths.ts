export const paths = {
  home: "/",
  about: "/about",
  services: "/services",
  numbers: "/numbers",
  numberDetails: (id = ":id") => `/numbers/${id}`,
  news: "/news",
  newsDetails: (id = ":id") => `/news/${id}`,
  contacts: "/contacts",
  sellNumber: "/sellNumber",
  profile: "/profile",
  auth: {
    login: "/auth/login",
    register: "/auth/register"
  },
  admin: {
    root: "/admin",
    lots: "/admin/lots",
    news: "/admin/news",
    newsNew: "/admin/news/new",
    newsEdit: (id = ":id") => `/admin/news/${id}/edit`
  },
  notFound: "*"
} as const;
