import { api_url } from "../config";

async function basic_request(
	method: string,
	path: string,
	body: string | null = null,
	try_: number = 1
): Promise<Response> {
	const args: RequestInit = {
		method: method,
		credentials: "include",
	};

	if (body) args.body = body;
	if (!path.includes(api_url)) {
		path = api_url + path;
	}

	return await fetch(path, args).then(async (resp: Response) => {
		if (resp.status === 401 && try_ === 1) {
			await GET("/refresh_token");
			return basic_request(method, path, body, try_ + 1);
		}
		return resp;
	});
}

export async function GET(path: string): Promise<Response> {
	return await basic_request("GET", path);
}
