import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../redux_hooks";
import { removeAuth } from "../slices/auth";
import { setInv } from "../slices/inv";
import { deleteMap } from "../slices/map";
import { GET } from "../utils/api_requests";

export default function Logout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(removeAuth());
    dispatch(deleteMap());
    dispatch(setInv([]));
    GET("/logout");
  }, [dispatch]);

  return <Navigate to="/" />;
}
