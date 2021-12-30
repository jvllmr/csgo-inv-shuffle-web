import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { GET } from "../utils/api_requests";
import { setUserID } from "../utils/auth";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Auth() {
  const query = useQuery();
  const steam_id = query.get("openid.identity");
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    if (steam_id)
      GET(`/auth?${query}`).then((resp: Response) => {
        if (resp.status === 200) {
          setUserID(steam_id.split("/")[steam_id.split("/").length - 1]);
          setAuthenticated(true);
        }
      });
  }, [query, steam_id]);

  if (authenticated) return <Navigate to="/" />;
  return <>Authenticating...</>;
}
