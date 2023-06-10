import { Avatar, Button, Group, Image } from "@mantine/core";
import { useEffect, useState } from "react";

import { authLink } from "../config";
import { selectAuthenticated } from "../redux/auth";
import { deleteBackward, deleteForward, deleteMap } from "../redux/map";
import { useAppDispatch, useAppSelector } from "../redux_hooks";
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
          <Image
            m="xs"
            height={25}
            className="no-select"
            src="/img/steam_login_wide.png"
            alt="Steam Login"
          />
        </a>
      ) : (
        <Group>
          {image && (
            <Avatar
              radius="xl"
              className="no-select"
              src={image}
              alt="PP"
              size="md"
            />
          )}

          <a href="/logout">
            <Button variant="light" className="no-select">
              Log out
            </Button>
          </a>
        </Group>
      )}
    </div>
  );
}
