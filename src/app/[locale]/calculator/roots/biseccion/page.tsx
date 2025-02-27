"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { evaluate } from "mathjs";
import NavBar from "@/components/shared/NavBar";
import InputField from "@/components/shared/InputField";
import IterationTable from "@/components/shared/IterationTable";
import Graph from "@/components/shared/GraphIterations";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

type Iteration = {
  iter: number;
  a: string;
  b: string;
  c: string;
  f_a: string;
  f_b: string;
  f_c: string;
  error: string;
};

export default function Biseccion() {
  const s = useTranslations("Shared");
  const t = useTranslations("Biseccion");

  const variableTranslations = {
    iter: s("variables.iter"),
    a: "a",
    b: "b",
    c: "c",
    f_a: "f(a)",
    f_b: "f(b)",
    f_c: "f(c)",
    error: s("variables.error"),
  };

  const [inputParams, setInputParams] = useState({
    func: "",
    a: "-5",
    b: "5",
    tolerance: 0.0001,
    decimalPlaces: 6,
  });

  const [errors, setErrors] = useState({
    func: "",
    a: "",
    b: "",
    tolerance: "",
    decimalPlaces: "",
  });

  const [iterations, setIterations] = useState<Iteration[]>([]);

  const validateInputs = () => {
    const newErrors = {
      func: "",
      a: "",
      b: "",
      tolerance: "",
      decimalPlaces: "",
    };
    let isValid = true;

    if (!inputParams.func.trim()) {
      newErrors.func = s("errors.func");
      isValid = false;
    }

    const aNumber = parseFloat(inputParams.a);
    const bNumber = parseFloat(inputParams.b);
    if (isNaN(aNumber) || isNaN(bNumber) || aNumber >= bNumber) {
      newErrors.a = t("errors.a");
      newErrors.b = t("errors.b");
      isValid = false;
    }

    if (
      isNaN(inputParams.tolerance) ||
      inputParams.tolerance < 0.000001 ||
      inputParams.tolerance > 0.1
    ) {
      newErrors.tolerance = s("errors.tolerance");
      isValid = false;
    }

    if (
      !Number.isInteger(inputParams.decimalPlaces) ||
      inputParams.decimalPlaces < 1 ||
      inputParams.decimalPlaces > 10
    ) {
      newErrors.decimalPlaces = s("errors.decimal");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const bisectionMethod = () => {
    if (!validateInputs()) return;
    setIterations([]);

    try {
      let a = parseFloat(inputParams.a);
      let b = parseFloat(inputParams.b);
      const f_a = evaluate(inputParams.func, { x: a });
      const f_b = evaluate(inputParams.func, { x: b });

      if (f_a * f_b > 0) {
        setErrors((prev) => ({
          ...prev,
          func: t("errors.signs"),
        }));
        return;
      }

      const iter = [];
      let error = 1;
      let count = 0;
      const maxIter = 30;
      const decimalPlaces = inputParams.decimalPlaces;

      while (error > inputParams.tolerance && count < maxIter) {
        const c = (a + b) / 2;
        const f_c = evaluate(inputParams.func, { x: c });

        iter.push({
          iter: count + 1,
          a: a.toFixed(decimalPlaces),
          b: b.toFixed(decimalPlaces),
          c: c.toFixed(decimalPlaces),
          f_a: f_a.toFixed(decimalPlaces),
          f_b: f_b.toFixed(decimalPlaces),
          f_c: f_c.toFixed(decimalPlaces),
          error: error.toFixed(decimalPlaces),
        });

        if (Math.abs(f_c) < inputParams.tolerance) break;

        if (f_a * f_c < 0) {
          b = c;
        } else {
          a = c;
        }

        error = Math.abs(b - a) / 2;
        count++;
      }
      setIterations(iter);
    } catch (error) {
      if (error) {
        setErrors((prev) => ({
          ...prev,
          func: s("errors.unexpected"),
        }));
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
                  {t("description.1")} <Latex>{`$f(x)$`}</Latex>{" "}
                  {t("description.2")}
                  <Latex>{` $[a, b]$`}</Latex> {t("description.3")}{" "}
                  <a
                    href="https://es.wikipedia.org/wiki/M%C3%A9todo_de_bisecci%C3%B3n"
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
                c = \\frac{a + b}{2}
                \\]
                ${t("formula.2")}
                \\[
                \\begin{align*}
                a, b & : \\text{${t("formula.3")}} \\\\
                c & : \\text{${t("formula.4")}} \\\\
                \\end{align*}
                \\]
            
                ${t("formula.5")} $f(c) $:

                \\[
                \\begin{align*}
                \\text{- ${t("formula.6")} } & f(a) \\cdot f(c) < 0, \\text{${t(
                    "formula.7"
                  )} } [a, c], \\text{${t("formula.8")} } b = c . \\\\
                \\text{- ${t("formula.6")} } & f(c) \\cdot f(b) < 0, \\text{${t(
                    "formula.7"
                  )} } [c, b], \\text{${t("formula.8")} } a = c . \\\\
                \\text{- ${t("formula.6")} } & f(c) = 0, \\text{${t(
                    "formula.9"
                  )} } c, \\text{${t("formula.10")} }. \\\\
                \\end{align*}
                \\]

                ${t("formula.11")}
                \\[
                \\text{${t("formula.12")}} = \\frac{|b - a|}{2} < \\text{${t(
                    "formula.13"
                  )}}
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
              label={s("funcLabel")}
              type={"text"}
              value={inputParams.func}
              placeholder={"x^3+3x^2+12x+8"}
              onChange={(e) =>
                setInputParams({ ...inputParams, func: e.target.value })
              }
            />
            {errors.func && (
              <p className="text-red-500 text-sm mb-3">{errors.func}</p>
            )}
            <InputField
              label={<Latex>{`a`}</Latex>}
              type={"text"}
              value={inputParams.a}
              onChange={(e) =>
                setInputParams({ ...inputParams, a: e.target.value })
              }
            />
            {errors.a && (
              <p className="text-red-500 text-sm mb-3">{errors.a}</p>
            )}
            <InputField
              label={<Latex>{`b`}</Latex>}
              type={"text"}
              value={inputParams.b}
              onChange={(e) =>
                setInputParams({ ...inputParams, b: e.target.value })
              }
            />
            {errors.b && (
              <p className="text-red-500 text-sm mb-3">{errors.b}</p>
            )}
            <InputField
              label={s("decimalLabel")}
              type={"number"}
              value={inputParams.decimalPlaces}
              placeholder="1-10"
              onChange={(e) =>
                setInputParams({
                  ...inputParams,
                  decimalPlaces: Number(e.target.value),
                })
              }
            />
            {errors.decimalPlaces && (
              <p className="text-red-500 text-sm mb-3">
                {errors.decimalPlaces}
              </p>
            )}
            <InputField
              label={s("toleranceLabel")}
              type={"number"}
              step={"any"}
              value={inputParams.tolerance}
              onChange={(e) =>
                setInputParams({
                  ...inputParams,
                  tolerance: Number(e.target.value),
                })
              }
            />
            {errors.tolerance && (
              <p className="text-red-500 text-sm mb-3">{errors.tolerance}</p>
            )}
            <button
              onClick={bisectionMethod}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md mt-4"
            >
              {s("calculateButton")}
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
              <IterationTable
                iterations={iterations}
                variableTranslations={variableTranslations}
                highlightBestIteration={true}
              />
            </div>
            <Graph
              data={iterations}
              xAxisDefaultKey={"iter"}
              yAxisDefaultKey={"c"}
              variableTranslations={variableTranslations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
