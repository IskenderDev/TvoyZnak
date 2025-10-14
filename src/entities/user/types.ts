export interface User {
  id: string;
  role: "admin" | "user";
  name: string;
  email: string;
}
