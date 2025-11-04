import type { Location } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";

import { paths } from "@/shared/routes/paths";

const AUTH_PARAM = "auth";
const REDIRECT_PARAM = "redirectTo";

const toLocationString = (value: Location | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }
  return `${value.pathname}${value.search}${value.hash}`;
};

export default function LoginPage() {
  const location = useLocation();
  const state = location.state as { from?: Location } | undefined;

  const params = new URLSearchParams(location.search);
  params.set(AUTH_PARAM, "login");

  const redirectFromState = toLocationString(state?.from);
  const redirectFromQuery = params.get(REDIRECT_PARAM);
  const redirectTo = redirectFromQuery || redirectFromState;

  if (redirectTo) {
    params.set(REDIRECT_PARAM, redirectTo);
  } else {
    params.delete(REDIRECT_PARAM);
  }

  return <Navigate to={{ pathname: paths.home, search: `?${params.toString()}` }} replace state={state} />;
}
