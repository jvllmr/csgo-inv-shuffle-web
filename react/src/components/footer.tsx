import React from "react";

export default class Footer extends React.Component {
  render() {
    return (
      <div className="footer" data-nosnippet>
        <p style={{ marginLeft: "10vw" }}>
          © {new Date().getFullYear()} Created by{" "}
          {
            <a
              style={{ color: "whitesmoke", textDecoration: "none" }}
              href="https://steamcommunity.com/profiles/76561198232352624"
            >
              kreyoo
            </a>
          }
          .
          <a
            style={{ color: "whitesmoke", textDecoration: "none" }}
            href="https://github.com/kreyoo/csgo-inv-shuffle-web/blob/master/LICENSE"
          >
            {" "}
            AGPLv3
          </a>
          . Powered by Steam. Valve, Steam and Counter-Strike are registered
          trademarks of Valve Corporation. csgoinvshuffle.kreyoo.dev is not
          affiliated with Valve in any way.
        </p>
      </div>
    );
  }
}
