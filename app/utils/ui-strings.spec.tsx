import Link from "next/link";
import { isValidElement } from "react";
import { expect, it } from "vitest";

import { replaceLinks } from "@/utils/ui-strings";

it("should replace markdown-style links with React nodes", () => {
  const root = replaceLinks(
    "Draft saved in [My visualizations](/profile)",
    (label, link) => {
      return <Link href={link}>{label}</Link>;
    }
  );

  expect(root).toHaveLength(3);
  expect(root[0]).toBe("Draft saved in ");
  expect(root[2]).toBe("");

  const linkNode = root[1];
  expect(isValidElement(linkNode)).toBe(true);

  if (isValidElement(linkNode)) {
    expect(linkNode.props.href).toBe("/profile");
    expect(linkNode.props.children).toBe("My visualizations");
  }
});
