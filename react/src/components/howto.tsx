import { useEffect, useState } from "react";

import { Text } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import Shell from "./shell";
export default function HowTo() {
  const [text, setText] = useState("");
  useEffect(() => {
    fetch("/markdown/howto.md").then(async (resp: Response) => {
      setText(await resp.text());
    });
  });
  return (
    <>
      <Shell>
        <Text>
          <ReactMarkdown>{text}</ReactMarkdown>
        </Text>
      </Shell>
    </>
  );
}
