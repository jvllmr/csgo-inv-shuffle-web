import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { removeAuth } from "../redux/auth";
import { setInv } from "../redux/inv";
import { deleteMap } from "../redux/map";
import { useAppDispatch } from "../redux_hooks";
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
