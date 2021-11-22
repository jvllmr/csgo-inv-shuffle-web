import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { GET } from "../utils/api_requests";
import { deleteUserID } from "../utils/auth";

export default function Logout() {
  useEffect(() => {
    deleteUserID();
    localStorage.removeItem("inv");
    localStorage.removeItem("map");
    GET("/logout");
  }, []);

  return <Navigate to="/" />;
}
