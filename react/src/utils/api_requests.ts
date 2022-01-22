import { api_url } from "../config";
import { deleteUserID } from "./auth";
import store from "../redux";
import { deleteBackward, deleteForward, setMap } from "../slices/map";

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

  if (body) {
    args.body = body;
    args.headers = {
      "Content-Type": "application/json",
    };
  }
  if (!path.includes(api_url)) {
    path = api_url + path;
  }
  return await fetch(path, args).then(async (resp: Response) => {
    if (resp.status === 401 && try_ === 1) {
      await fetch(`${api_url}/refresh_token`, {
        ...args,
        body: null,
        method: "GET",
      }).then((resp: Response) => {
        if (resp.status !== 200) {
          localStorage.removeItem("inv");
          deleteUserID();
          store.dispatch(setMap([]));
          store.dispatch(deleteForward());
          store.dispatch(deleteBackward());
          window.location.reload();
        }
      });
      return basic_request(method, path, body, try_ + 1);
    }
    return resp;
  });
}

export async function GET(path: string): Promise<Response> {
  return await basic_request("GET", path);
}

export async function POST(path: string, body: string): Promise<Response> {
  return await basic_request("POST", path, body);
}
