export const paths = {
  home: "/",
  about: "/about",
  services: "/services",
  numbers: "/numbers",
  numberDetails: (id = ":id") => `/numbers/${id}`,
  news: "/news",
  newsDetails: (id = ":id") => `/news/${id}`,
  contacts: "/contacts",
  sell: "/sell",
  sellNew: "/sell/new",
  profile: "/profile",
  profileListing: (id = ":id") => `/profile/listings/${id}`,
  auth: {
    login: "/login",
    register: "/register"
  },
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
