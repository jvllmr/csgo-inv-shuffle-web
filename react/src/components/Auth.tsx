import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  selectAuthenticated,
  setAuthID,
  setAuthenticated,
} from "../redux/auth";
import { useAppDispatch, useAppSelector } from "../redux_hooks";
import { GET } from "../utils/api_requests";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Auth() {
  const query = useQuery();

  const authenticated = useAppSelector(selectAuthenticated);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const steam_id = query.get("openid.identity");
    if (steam_id && !authenticated)
      GET(`/auth?${query}`).then((resp: Response) => {
        if (resp.status === 200) {
          dispatch(setAuthenticated(true));
          dispatch(
            setAuthID(steam_id.split("/")[steam_id.split("/").length - 1]),
          );
        }
      });
  }, [query, dispatch, authenticated]);

  if (authenticated) return <Navigate to="/" />;
  return <>Authenticating...</>;
}
