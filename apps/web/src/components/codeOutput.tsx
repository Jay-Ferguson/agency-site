// fallow-ignore-file unused-file
import { Refractor, registerLanguage } from "react-refractor";
import js from "refractor/javascript";
// First, install the package using pnpm:
// pnpm add refractor
registerLanguage(js);

export function Code(props: any) {
  return (
    <Refractor
      // In this example, `props` is the value of a `code` field
      language={props.language}
      value={props.code}
      markers={props.highlightedLines}
    />
  );
}
