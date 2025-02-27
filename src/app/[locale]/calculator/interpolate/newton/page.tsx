"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import NavBar from "@/components/shared/NavBar";
import InputField from "@/components/shared/InputField";
import DividedDiffTable from "@/components/shared/DividedDiffTable";
import GraphFunctions from "@/components/shared/GraphFunctions";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

type Iteration = {
  x: number;
  f_x: number;
  divided_diff: string;
};

export default function Newton() {
  const s = useTranslations("Shared");
  const t = useTranslations("Newton");

  const [inputParams, setInputParams] = useState({
    points: "",
  });

  const [errors, setErrors] = useState({
    points: "",
  });

  const [iterations, setIterations] = useState<Iteration[][]>([]);

  const [polynomial, setPolynomial] = useState(" ");

  const [coefficients, setCoefficients] = useState<
    { index: number; value: string }[]
  >([]);

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

  const parsePoints = (input: string) => {
    return input.split(";").map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return { x, y };
    });
  };

  const expandPolynomial = (
    coefficients: { index: number; value: string }[],
    xValues: number[]
  ) => {
    const expandedTerms: string[] = [];

    expandedTerms.push(coefficients[0].value);

    coefficients.slice(1).forEach(({ value }, i) => {
      let term = value;
      const productTerms: string[] = [];

      for (let j = 0; j <= i; j++) {
        productTerms.push(`(x - ${xValues[j]})`);
      }

      term += ` ${productTerms.join(" ")}`;
      expandedTerms.push(term);
    });

    return expandedTerms.join(" + ");
  };

  const newtonInterpolation = () => {
    if (!validateInputs()) return;
    setIterations([]);

    try {
      const points = parsePoints(inputParams.points);
      if (points.some((p) => isNaN(p.x) || isNaN(p.y))) {
        setErrors({ points: s("errors.pointsFormat") });
        return;
      }

      const n = points.length;
      const table: Iteration[][] = Array(n)
        .fill(null)
        .map(() => []);

      for (let i = 0; i < n; i++) {
        table[i].push({
          x: points[i].x,
          f_x: points[i].y,
          divided_diff: points[i].y.toString(),
        });
      }

      for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
          const diff =
            (parseFloat(table[i + 1][j - 1].divided_diff) -
              parseFloat(table[i][j - 1].divided_diff)) /
            (points[i + j].x - points[i].x);
          table[i].push({
            x: points[i].x,
            f_x: table[i][0].f_x,
            divided_diff: diff.toFixed(6),
          });
        }
      }

      setIterations(table);

      const xValues = table.map((row) => row[0].x);

      const tempCoefficients = table[0].map((col, index) => ({
        index,
        value: col.divided_diff,
      }));

      setCoefficients(tempCoefficients);

      const expandedPolynomial = expandPolynomial(tempCoefficients, xValues);

      setPolynomial(expandedPolynomial);
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
                    href="https://es.wikipedia.org/wiki/Interpolaci%C3%B3n_polin%C3%B3mica_de_Newton"
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
                P_n(x) = f[x_0] + f[x_0, x_1](x - x_0) + f[x_0, x_1, x_2](x - x_0)(x - x_1) + \\dots + f[x_0, x_1, \\dots, x_n](x - x_0)(x - x_1)\\dots(x - x_{n-1})
                \\]
                ${t("formula.2")}
                \\[
                \\begin{align*}
                f[x_i] & : \\text{${t("formula.3")} } x_i \\\\
                f[x_i, x_{i+1}] & : \\text{${t(
                  "formula.4"
                )} } x_i \\text{ y } x_{i+1} \\\\
                f[x_i, x_{i+1}, x_{i+2}] & : \\text{${t(
                  "formula.5"
                )} } x_i, x_{i+1} \\text{ y } x_{i+2} \\\\
                \\vdots & \\\\
                f[x_0, x_1, \\dots, x_n] & : \\text{${t("formula.6")} } n \\\\
                \\end{align*}
                \\]
                ${t("formula.7")}
                \\[
                f[x_i, x_{i+1}, \\dots, x_{i+k}] = \\frac{f[x_{i+1}, x_{i+2}, \\dots, x_{i+k}] - f[x_i, x_{i+1}, \\dots, x_{i+k-1}]}{x_{i+k} - x_i}
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
              placeholder={"1,2;7,6;"}
              onChange={(e) =>
                setInputParams({ ...inputParams, points: e.target.value })
              }
            />
            {errors.points && (
              <p className="text-red-500 text-sm mb-3">{errors.points}</p>
            )}

            <button
              onClick={newtonInterpolation}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md mt-4"
            >
              Calcular
            </button>

            <div className="w-full mt-6 rounded-md p-1">
              <p className="text-sm text-gray-600">
                {s("advice.1")}{" "}
                <a
                  href="https://mathjs.org/docs/reference/functions.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {s("advice.2")}
                </a>{" "}
                {s("advice.3")}{" "}
                <a
                  href="https://mathjs.org/docs/reference/constants.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {s("advice.4")}
                </a>
              </p>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl w-full md:w-2/3 border shadow-lg border-gray-400">
            <h2 className="text-lg font-bold mb-3">{s("resultsTitle")}</h2>
            <div className="max-h-96 overflow-y-auto">
              <DividedDiffTable
                iterations={iterations}
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
