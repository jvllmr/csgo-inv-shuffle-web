import React from "react";


export default class Footer extends React.Component {
  render() {
    return <div className="footer" >
      <p style={{marginLeft: "10vw"}}>
      © {new Date().getFullYear()} Created by {<a color="whitesmoke" href="https://steamcommunity.com/profiles/76561198232352624">kreyoo</a>}. 
      All rights reserved. Powered by Steam. Valve and Steam are registered trademarks of Valve Corporation. csgoinvshuffle.kreyoo.dev is not affiliated with Valve in any way.
      </p>
    </div>;
  }
}
