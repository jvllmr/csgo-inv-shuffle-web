import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { authLink } from "../config";
import { GET } from "../utils/api_requests";
import { is_authenticated } from "../utils/auth";

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
						<b style={{ color: "white" }}>Log out</b>
					</a>
				</>
			)}
		</div>
	);
}
