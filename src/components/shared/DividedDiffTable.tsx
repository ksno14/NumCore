"use client";

import { useTranslations } from "next-intl";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

type Iteration = {
  x: number;
  f_x: number;
  divided_diff: string;
};

type DividedDiffTableProps = {
  iterations: Iteration[][];
  coefficients: { index: number; value: string }[];
  polynomial: string;
};

export default function DividedDiffTable({
  iterations,
  coefficients,
  polynomial,
}: DividedDiffTableProps) {
  const t = useTranslations("Tables");
  if (iterations.length === 0)
    return <p className="text-center text-gray-500">{t("noIterations")}.</p>;

  return (
    <div className="overflow-auto">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold mb-2">{t("coefficients")}:</h3>
        <p className="text-xl">
          <Latex>
            {coefficients
              .map(({ index, value }) => `$a_{${index}} = ${value}$`)
              .join(", ")}
          </Latex>
        </p>
      </div>

      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold mb-2">
          {t("interpolantPolynomial")}:
        </h3>
        <p className="text-xl">
          <Latex>{`$P(x) = ${polynomial}$`}</Latex>
        </p>
      </div>
      <table className="border-collapse border border-gray-400 w-full text-center">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">x</th>
            <th className="border border-gray-400 p-2">y / f(x)</th>
            {iterations[0].slice(1).map((_, index) => (
              <th key={index} className="border border-gray-400 p-2">
                {t("difference")} {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {iterations.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-400 p-2">{row[0].x}</td>
              {row.map((col, colIndex) => {
                const isCoef = rowIndex === 0 && colIndex >= 0;
                return (
                  <td
                    key={colIndex}
                    className={`border border-gray-400 p-2 ${
                      isCoef ? "bg-green-100 font-bold" : ""
                    }`}
                  >
                    {isCoef ? (
                      <Latex>{`${col.divided_diff} $(a_${colIndex})$`}</Latex>
                    ) : (
                      col.divided_diff
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
