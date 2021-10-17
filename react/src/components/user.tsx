import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { api_url, authLink } from "../config";
import { getUserID, is_authenticated } from "../utils/auth";
import { getXMLData } from "../utils/misc";
export default function User() {
	const [image, setImage] = useState("");
	const authstate = is_authenticated();
	useEffect(() => {
		if (authstate) {
			fetch(`${api_url}/profile_data/${getUserID()!}`).then(
				async (resp: Response) => {
					if (resp.status === 200) {
						const xml = await resp.text();
						setImage(getXMLData(xml, "avatarIcon")!);
					}
				}
			);
		}
	}, [authstate]);

	return (
		<div className="userdiv">
			{!(authstate && image) ? (
				<a href={authLink()}>
					<img src="/img/steam_login_wide.png" alt="Steam Login" />
				</a>
			) : (
				<>
					<Image src={image} alt="Profile Picture" roundedCircle />
					{"  "}
					<a href="/logout">
						<b style={{ color: "white" }}>Log out</b>
					</a>
				</>
			)}
		</div>
	);
}
