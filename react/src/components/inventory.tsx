import React, { useEffect, useState } from "react";
import { GET } from "../utils/api_requests";
import { getUserID } from "../utils/auth";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  useEffect(() => {
    if (getUserID())
      GET(`/inventory`).then(async (resp: Response) => {
        const json = await resp.json();
        if (resp.status === 200) {
          console.log(json);
        }
      });
  }, []);

  return <></>;
}
