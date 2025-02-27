"use client";

import { useTranslations } from "next-intl";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

type IterationTableProps = {
  iterations: {
    [key: string]: string | number;
  }[];
  variableTranslations: Record<string, string>;
  highlightBestIteration?: boolean;
};

export default function IterationTable({
  iterations,
  variableTranslations,
  highlightBestIteration = true,
}: IterationTableProps) {
  const t = useTranslations("Tables");
  if (iterations.length === 0) {
    return <p className="text-center text-gray-500">{t("noIterations")}.</p>;
  }

  const bestIteration = highlightBestIteration
    ? iterations.reduce((prev, curr) =>
        Object.keys(curr).some(
          (key) =>
            key.includes("error") &&
            parseFloat(curr[key] as string) <= parseFloat(prev[key] as string)
        )
          ? curr
          : prev
      )
    : null;

  const headers = Object.keys(iterations[0]);

  return (
    <div className="max-h-96 overflow-y-auto border border-gray-400 rounded-md shadow-lg">
      {highlightBestIteration && bestIteration && (
        <div className="p-4  rounded-md">
          <p className="text-base font-bold mb-2">{t("bestIteration")}</p>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(bestIteration).map((key) => (
              <p key={key}>
                <Latex>{`$${variableTranslations[key] || key}: ${
                  bestIteration[key]
                }$`}</Latex>
              </p>
            ))}
          </div>
        </div>
      )}
      <table className="w-full border-separate border-spacing-0">
        <thead className="sticky top-0 bg-gray-300">
          <tr>
            {headers.map((key) => (
              <th key={key} className="border border-gray-400 p-2">
                <Latex>{`$${variableTranslations[key] || key}$`}</Latex>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {iterations.map((iteration, index) => (
            <tr
              key={index}
              className={`text-center ${
                highlightBestIteration &&
                bestIteration &&
                iteration === bestIteration
                  ? "bg-green-100"
                  : ""
              }`}
            >
              {headers.map((key) => (
                <td key={key} className="border border-gray-400 p-2">
                  {iteration[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
