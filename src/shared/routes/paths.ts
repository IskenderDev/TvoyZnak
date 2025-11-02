export const paths = {
  home: "/",
  carNumberLots: {
    root: "/car-number-lots",
    details: (id = ":id") => `/car-number-lots/${id}`,
    create: "/car-number-lots/create",
    mine: "/my-lots",
  },
  posts: {
    root: "/posts",
  },
  auth: {
    login: "/login",
    register: "/register",
  },
  admin: {
    root: "/admin",
    lots: "/admin/lots",
    users: "/admin/users",
    posts: "/admin/posts",
  },
  notFound: "*",
};
