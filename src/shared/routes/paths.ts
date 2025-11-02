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
  admin: {
    root: "/admin",
    numbers: "/admin/numbers",
    numbersNew: "/admin/numbers/new",
    numbersEdit: (id = ":id") => `/admin/numbers/${id}/edit`,
    news: "/admin/news",
    newsNew: "/admin/news/new",
    newsEdit: (id = ":id") => `/admin/news/${id}/edit`
  },
  notFound: "*"
} as const;
