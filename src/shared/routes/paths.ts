export const paths = {
  home: "/",
  about: "/about",
  services: "/services",
  numbers: "/numbers",
  numberDetails: (id = ":id") => `/numbers/${id}`,
  news: "/news",
  newsDetails: (slug = ":slug") => `/news/${slug}`,
  contacts: "/contacts",
  sellNumber:"/sellNumber",
  auth: {
    login: "/auth/login",
    register: "/auth/register"
  },
  admin: {
    root: "/admin",
    numbers: "/admin/numbers",
    numbersNew: "/admin/numbers/new",
    numbersEdit: (id = ":id") => `/admin/numbers/${id}/edit`,
    news: "/admin/news",
    newsNew: "/admin/news/new",
    newsEdit: (slug = ":slug") => `/admin/news/${slug}/edit`
  },
  notFound: "*"
} as const;
