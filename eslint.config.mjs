import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 忽略使用 <img> 标签的警告
      "@next/next/no-img-element": "off",
      // 忽略 React Hook 依赖项的警告
      "react-hooks/exhaustive-deps": "warn",
      // 忽略未使用变量的警告
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;
