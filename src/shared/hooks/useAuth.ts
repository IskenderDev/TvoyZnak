import { useAuth as useAuthInternal } from "@/shared/contexts/AuthProvider";
import type {
  AuthContextValue,
  ExtendedAuthUser as AuthUser,
  Role,
} from "@/shared/contexts/AuthProvider";

export type { Role, AuthUser };

export function useAuth(): AuthContextValue {
  return useAuthInternal();
}
