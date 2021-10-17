import React from "react";
import { Redirect } from "react-router-dom";
import { deleteUserID } from "../utils/auth";

export default function Logout() {
  deleteUserID();
  return <Redirect to="/" />;
}
