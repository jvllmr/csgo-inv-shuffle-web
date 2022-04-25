import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import SimpleBar from "simplebar-react";
import Header from "./header";

export default function Privacy() {
  const [text, setText] = useState("");
  useEffect(() => {
    fetch("/markdown/privacy.md").then(async (resp: Response) => {
      setText(await resp.text());
    });
  });

  return (
    <>
      <Header />
      <SimpleBar className="scrollDiv" id="scrollDiv" autoHide={false}>
        <Container style={{ marginTop: 100, color: "whitesmoke" }}>
          <ReactMarkdown>{text}</ReactMarkdown>
        </Container>
      </SimpleBar>
    </>
  );
}

export {};
