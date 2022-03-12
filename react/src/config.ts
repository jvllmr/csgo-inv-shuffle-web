export const api_url =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://api.csgoinvshuffle.kreyoo.dev";
export const site_url =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://csgoinvshuffle.kreyoo.dev";

const OpenIDParams = {
  "openid.ns": "http://specs.openid.net/auth/2.0",
  "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
  "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  "openid.mode": "checkid_setup",
  "openid.return_to": `${site_url}/auth`,
  "openid.realm": `${site_url}`,
};

const SteamOpenIDLink: string = "https://steamcommunity.com/openid/login";

export function authLink(): string {
  return `${SteamOpenIDLink}?${new URLSearchParams(OpenIDParams)}`;
}
