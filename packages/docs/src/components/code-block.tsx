import type { JSX } from "react";
import type { BundledLanguage } from "shiki";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { codeToHast } from "shiki";
import { cn } from "../lib/utils";

interface Props {
  className?: string;
  children: string;
  lang: BundledLanguage;
}

export default async function CodeBlock(props: Props) {
  const { className } = props;
  const out = await codeToHast(props.children, {
    lang: props.lang,
    theme: "github-dark",
  });

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
    components: {
      // your custom `pre` element
      pre: (props) => (
        <pre
          data-custom-codeblock
          {...props}
          className={cn(props.className, className)}
        />
      ),
    },
  }) as JSX.Element;
}
