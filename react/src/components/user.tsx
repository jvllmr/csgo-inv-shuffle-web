import React, { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import { authLink } from "../config";
import { useAppDispatch, useAppSelector } from "../redux_hooks";
import { selectAuthenticated } from "../slices/auth";
import { deleteBackward, deleteForward, deleteMap } from "../slices/map";
import { GET } from "../utils/api_requests";

interface UserProps {
  noImage?: boolean;
}

export default function User(props: UserProps) {
  const [image, setImage] = useState("");
  const authenticated = useAppSelector(selectAuthenticated);
  const dispatch = useAppDispatch();
  const { noImage } = props;
  useEffect(() => {
    if (authenticated && !noImage) {
      GET(`/profile_picture`).then(async (resp: Response) => {
        if (resp.status === 200) {
          const json = await resp.json();
          setImage(json.link);
        }
      });
    }
    if (!authenticated) {
      dispatch(deleteMap());
      dispatch(deleteForward());
      dispatch(deleteBackward());
    }
  }, [authenticated, dispatch, noImage]);

  return (
    <div className="userdiv">
      {!authenticated ? (
        <a href={authLink()}>
          <img
            className="no-select"
            src="/img/steam_login_wide.png"
            alt="Steam Login"
          />
        </a>
      ) : (
        <>
          {image && (
            <Image
              style={{ marginRight: 5 }}
              className="no-select"
              src={image}
              alt="PP"
              roundedCircle
            />
          )}

          <a href="/logout">
            <Button className="no-select" variant="dark">
              Log out
            </Button>
          </a>
        </>
      )}
    </div>
  );
}
