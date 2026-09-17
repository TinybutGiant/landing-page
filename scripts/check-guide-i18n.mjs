import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const localeFiles = ["en", "zh-CN", "ja"];
const expectedKeys = [
  "submitSuccessTitle",
  "submitSuccessDesc",
];

for (const locale of localeFiles) {
  const path = fileURLToPath(
    new URL(`../src/i18n/locales/${locale}.json`, import.meta.url)
  );
  const messages = JSON.parse(readFileSync(path, "utf8"));
  const toast = messages?.becomeGuide?.toast;

  for (const key of expectedKeys) {
    const value = toast?.[key];
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${locale}: missing becomeGuide.toast.${key}`);
    }
    if (value.includes("becomeGuide.")) {
      throw new Error(`${locale}: becomeGuide.toast.${key} renders a raw message id`);
    }
  }
}

console.log("Guide submission toast translations are valid for en, zh-CN, and ja.");
