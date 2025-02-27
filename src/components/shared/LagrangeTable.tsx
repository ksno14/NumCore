"use client";

import { useTranslations } from "next-intl";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

type LagrangeTableProps = {
  coefficients: number[];
  polynomial: string;
};

export default function LagrangeTable({
  coefficients,
  polynomial,
}: LagrangeTableProps) {
  const t = useTranslations("Tables");
  if (coefficients.length === 0)
    return <p className="text-center text-gray-500">{t("noCoefficients")}</p>;

  return (
    <div className="overflow-auto">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold mb-2">{t("interpolantPolynomial")}:</h3>
        <p className="text-xl">
          <Latex>{`$P(x) = ${polynomial}$`}</Latex>
        </p>
      </div>
      <table className="border-collapse border border-gray-400 w-full text-center">
        <thead>
          <tr>
            {coefficients.map((_, index) => (
              <th key={index} className="border border-gray-400 p-2">
                {t("coefficient")}{" "}
                <Latex>{`$x^${coefficients.length - index - 1}$`}</Latex>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {coefficients.toReversed().map((value, index) => (
              <td key={index} className="border border-gray-400 p-2">
                <Latex>{`$${value.toFixed(6)}$`}</Latex>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
