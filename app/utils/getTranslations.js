import { promises as fs } from "fs";
import path from "path";

export const getTranslations = async (locale, fileName) => {
  const defaultLocale = "sr";
  const translationsPath = path.join(
    process.cwd(),
    `public/locales/${fileName}.json`
  );

  try {
    const fileContents = await fs.readFile(translationsPath, "utf-8");
    const translations = JSON.parse(fileContents);

    return translations[locale] || translations[defaultLocale];
  } catch (error) {
    console.error("Error loading translations:", error);
    return {};
  }
};
