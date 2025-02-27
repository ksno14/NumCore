"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import NavBar from "@/components/shared/NavBar";
import InputField from "@/components/shared/InputField";
import GraphFunctions from "@/components/shared/GraphFunctions";
import LagrangeTable from "@/components/shared/LagrangeTable";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

type Point = {
  x: number;
  y: number;
};

export default function Lagrange() {
  const s = useTranslations("Shared");
  const t = useTranslations("Lagrange");

  const [inputParams, setInputParams] = useState({
    points: "",
  });

  const [errors, setErrors] = useState({
    points: "",
  });

  const [polynomial, setPolynomial] = useState(" ");

  const [coefficients, setCoefficients] = useState<number[]>([]);

  const validateInputs = () => {
    const newErrors = { points: "" };
    let isValid = true;

    if (!inputParams.points.trim()) {
      newErrors.points = s("errors.points");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const parsePoints = (input: string): Point[] => {
    return input.split(";").map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return { x, y };
    });
  };

  const multiplyPoly = (poly: number[], term: number[]) => {
    const result = new Array(poly.length + 1).fill(0);

    for (let i = 0; i < poly.length; i++) {
      result[i] += poly[i] * term[0];
      result[i + 1] += poly[i] * term[1];
    }

    return result;
  };

  const lagrangeInterpolation = () => {
    if (!validateInputs()) return;

    try {
      const points = parsePoints(inputParams.points);
      if (points.some((p) => isNaN(p.x) || isNaN(p.y))) {
        setErrors({ points: s("errors.pointsFormat") });
        return;
      }

      const n = points.length;
      const coefficients = new Array(n).fill(0);

      for (let i = 0; i < n; i++) {
        const xi = points[i].x,
          yi = points[i].y;
        let Li = [1];

        for (let j = 0; j < n; j++) {
          if (i !== j) {
            const xj = points[j].x;

            Li = multiplyPoly(Li, [-xj, 1]);

            Li = Li.map((c) => c / (xi - xj));
          }
        }

        for (let k = 0; k < Li.length; k++) {
          coefficients[k] += Li[k] * yi;
        }
      }

      setPolynomial(
        coefficients
          .map((c, i) => `${c.toFixed(6)}x^${i}`)
          .reverse()
          .join(" + ")
      );

      setCoefficients(coefficients);
    } catch (error) {
      if (error) {
        setErrors({ points: s("errors.unexpected") });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="pr-9 pl-2 pb-9">
        <NavBar />
        <div className="bg-gray-100 rounded-xl p-6 mt-9 mx-auto max-w-full border shadow-lg border-gray-400">
          <div className="flex justify-center h-16 items-center text-2xl">
            <h1>{t("title")}</h1>
          </div>
          <div className="mt-4 p-4 bg-white rounded-md border shadow-lg border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {s("descriptionTitle")}
                </h3>
                <p className="text-justify">
                  {t("description")}{" "}
                  <a
                    href="https://es.wikipedia.org/wiki/Interpolaci%C3%B3n_de_Lagrange"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {s("descriptionLink")}
                  </a>
                </p>
              </div>
              <div className="ml-6 overflow-auto">
                <h3 className="font-bold text-lg mb-2">{s("formulaTitle")}</h3>
                <Latex>
                  {`
                ${t("formula.1")}
                \\[
                P_n(x) = \\sum_{i=0}^{n} L_i(x) f(x_i)
                \\]
                ${t("formula.2")} \\( L_i(x) \\) ${t("formula.3")}
                \\[
                L_i(x) = \\prod_{j=0, j \\neq i}^{n} \\frac{x - x_j}{x_i - x_j}
                \\]
                ${t("formula.4")}
                \\[
                \\begin{align*}
                x_i & : \\text{${t("formula.5")}} \\\\
                f(x_i) & : \\text{${t("formula.6")} } x_i \\\\
                L_i(x) & : \\text{${t("formula.7")}} \\\\
                P_n(x) & : \\text{${t("formula.8")}}
                \\end{align*}
                \\]
                `}
                </Latex>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-start gap-6 mt-6">
          <div className="flex flex-col md:w-1/3 bg-gray-100 p-6 rounded-xl border shadow-lg border-gray-400">
            <h2 className="text-lg font-bold mb-4">{s("paramsTitle")}</h2>
            <InputField
              label={s("pointsLabel")}
              type={"text"}
              value={inputParams.points}
              placeholder={"1,2 ; 7,6;"}
              onChange={(e) =>
                setInputParams({ ...inputParams, points: e.target.value })
              }
            />
            {errors.points && (
              <p className="text-red-500 text-sm mb-3">{errors.points}</p>
            )}

            <button
              onClick={lagrangeInterpolation}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md mt-4"
            >
              {s("calculateButton")}
            </button>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl w-full md:w-2/3 border shadow-lg border-gray-400">
            <h2 className="text-lg font-bold mb-3">{s("resultsTitle")}</h2>
            <div className="max-h-96 overflow-y-auto">
              <LagrangeTable
                coefficients={coefficients}
                polynomial={polynomial}
              />
            </div>
            <GraphFunctions func={polynomial} points={inputParams.points} />
          </div>
        </div>
      </div>
    </div>
  );
}
