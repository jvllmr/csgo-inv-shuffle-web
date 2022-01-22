import React, { useEffect } from "react";

import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../redux_hooks";
import { deleteMap } from "../slices/map";
import { GET } from "../utils/api_requests";
import { deleteUserID } from "../utils/auth";

export default function Logout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    deleteUserID();
    localStorage.removeItem("inv");
    dispatch(deleteMap());
    GET("/logout");
  }, [dispatch]);

  return <Navigate to="/" />;
}
