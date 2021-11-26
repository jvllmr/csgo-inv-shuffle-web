import React, { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import { authLink } from "../config";
import { GET } from "../utils/api_requests";
import { is_authenticated } from "../utils/auth";
import { deleteBackward, deleteForward, setMap } from "../utils/slotmap";

export default function User() {
  const [image, setImage] = useState("");
  const authstate = is_authenticated();
  useEffect(() => {
    if (authstate) {
      GET(`/profile_picture`).then(async (resp: Response) => {
        if (resp.status === 200) {
          const json = await resp.json();
          setImage(json.link);
        }
      });
    }
    if (!is_authenticated()) {
      setMap([]);
      deleteForward();
      deleteBackward();
    }
  }, [authstate]);

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
