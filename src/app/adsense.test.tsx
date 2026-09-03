import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootLayout from "./layout";

function layoutElements() {
  const elements: ReactElement<Record<string, unknown>>[] = [];
  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (!isValidElement<{ children?: ReactNode }>(child)) return;
      elements.push(child);
      visit(child.props.children);
    });
  }
  visit(RootLayout({ children: <p>Page content</p> }));
  return elements;
}

describe("AdSense site ownership verification", () => {
  it("includes the supplied async, anonymous script in server-rendered head HTML", () => {
    const head = layoutElements().find((element) => element.type === "head");
    expect(head).toBeDefined();
    const document = new DOMParser().parseFromString(renderToStaticMarkup(head), "text/html");
    const scripts = document.head.querySelectorAll('script[src*="adsbygoogle.js"]');
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute("src")).toBe("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7698014065206574");
    expect(scripts[0].hasAttribute("async")).toBe(true);
    expect(scripts[0].getAttribute("crossorigin")).toBe("anonymous");
  });

  it("declares one global loader without ad slots or inline ad initialization", () => {
    const elements = layoutElements();
    expect(elements.filter((element) => String(element.props.src ?? "").includes("adsbygoogle.js"))).toHaveLength(1);
    expect(elements.filter((element) => element.type === "ins" && String(element.props.className).includes("adsbygoogle"))).toHaveLength(0);
    expect(elements.filter((element) => typeof element.props.children === "string" && element.props.children.includes("adsbygoogle"))).toHaveLength(0);
  });
});
