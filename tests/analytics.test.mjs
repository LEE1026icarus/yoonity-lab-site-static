import assert from "node:assert/strict";
import test from "node:test";
import { Children } from "react";

import { GoogleTagManager } from "../src/components/google-tag-manager.tsx";

test("Google Tag Manager waits until the page is interactive", () => {
  const element = GoogleTagManager({ containerId: "GTM-ABC123" });
  const [script, noscript] = Children.toArray(element.props.children);

  assert.equal(script.props.id, "google-tag-manager");
  assert.equal(script.props.strategy, "afterInteractive");
  assert.equal(
    noscript.props.children.props.src,
    "https://www.googletagmanager.com/ns.html?id=GTM-ABC123",
  );
});
