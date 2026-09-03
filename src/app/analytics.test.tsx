import { runInNewContext } from "node:vm";
import Script from "next/script";
import { Children, isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import RootLayout from "./layout";

type ScriptProps = {
  id?: string;
  src?: string;
  strategy?: string;
  children?: ReactNode;
};

function getGlobalScripts() {
  const scripts: ScriptProps[] = [];
  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (!isValidElement<ScriptProps>(child)) return;
      if (child.type === Script) scripts.push(child.props);
      visit(child.props.children);
    });
  }
  visit(RootLayout({ children: <p>Page content</p> }));
  return scripts;
}

function getBootstrap() {
  const scripts = getGlobalScripts().filter((script) => script.id === "ga4-init");
  expect(scripts).toHaveLength(1);
  expect(scripts[0].strategy).toBe("afterInteractive");
  expect(typeof scripts[0].children).toBe("string");
  return scripts[0].children as string;
}

describe("sitewide GA4", () => {
  it("loads the supplied property once, after hydration, from the root layout", () => {
    const scripts = getGlobalScripts().filter((script) => script.src?.includes("googletagmanager.com/gtag/js"));
    expect(scripts).toEqual([expect.objectContaining({
      id: "ga4-loader",
      src: "https://www.googletagmanager.com/gtag/js?id=G-8MR0VLN6L5",
      strategy: "afterInteractive"
    })]);
  });

  it("queues one configuration without adding duplicate manual page views", () => {
    const context: Record<string, unknown> = {};
    context.window = context;
    runInNewContext(getBootstrap(), context);
    const commands = (context.dataLayer as IArguments[]).map((entry) => Array.from(entry));
    expect(commands).toHaveLength(2);
    expect(commands[0][0]).toBe("js");
    expect(commands[1]).toEqual(["config", "G-8MR0VLN6L5", {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    }]);
  });

  it("preserves any existing data layer entries", () => {
    const existingEvent = { event: "existing-event" };
    const dataLayer = [existingEvent];
    const context: Record<string, unknown> = { dataLayer };
    context.window = context;
    runInNewContext(getBootstrap(), context);
    expect(context.dataLayer).toBe(dataLayer);
    expect(dataLayer[0]).toBe(existingEvent);
    expect(dataLayer).toHaveLength(3);
  });
});
