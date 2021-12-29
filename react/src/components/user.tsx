import React, { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import { authLink } from "../config";
import { useAppDispatch } from "../redux_hooks";
import { GET } from "../utils/api_requests";
import { is_authenticated } from "../utils/auth";
import { setMap, deleteBackward, deleteForward } from "../slices/map";

interface UserProps {
  noImage?: boolean
}

export default function User(props: UserProps) {
  const [image, setImage] = useState("");
  const authstate = is_authenticated();
  const dispatch = useAppDispatch();
  const {noImage} = props;
  useEffect(() => {
    if (authstate && noImage) {
      GET(`/profile_picture`).then(async (resp: Response) => {
        if (resp.status === 200) {
          const json = await resp.json();
          setImage(json.link);
        }
      });
    }
    if (!is_authenticated()) {
      dispatch(setMap([]));
      dispatch(deleteForward());
      dispatch(deleteBackward());
    }
  }, [authstate, dispatch, noImage]);

  return (
    <div className="userdiv">
      {!authstate ? (
        <a href={authLink()}>
          <img src="/img/steam_login_wide.png" alt="Steam Login" />
        </a>
      ) : (
        <>
          {image && <Image src={image} alt="PP" roundedCircle />}
          {"  "}
          <a href="/logout">
            <Button variant="dark">Log out</Button>
          </a>
        </>
      )}
    </div>
  );
}
