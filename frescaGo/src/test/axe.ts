import axe from "axe-core";

const DISABLED_IN_JSDOM = ["color-contrast", "target-size"];

export const accessibilityViolations = async (
  container: Element = document.body
) => {
  const results = await axe.run(container, {
    iframes: false,
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
    },
    rules: Object.fromEntries(
      DISABLED_IN_JSDOM.map((id) => [id, { enabled: false }])
    ),
  });

  return results.violations.map((violation) => ({
    rule: violation.id,
    help: violation.help,
    targets: violation.nodes.slice(0, 3).map((node) => node.target.join(" ")),
  }));
};
