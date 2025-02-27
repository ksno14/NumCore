"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { evaluate, derivative } from "mathjs";
import NavBar from "@/components/shared/NavBar";
import InputField from "@/components/shared/InputField";
import IterationTable from "@/components/shared/IterationTable";
import GraphIterations from "@/components/shared/GraphIterations";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

type Iteration = {
  iter: number;
  x_n: string;
  x_n1: string;
  f_x_n: string;
  f_prime_x_n: string;
  error: string;
};

export default function NewtonRaphson() {
  const s = useTranslations("Shared");
  const t = useTranslations("NewtonRaphson");

  const variableTranslations = {
    iter: s("variables.iter"),
    x_n: "x_n",
    x_n1: "x_{n+1}",
    f_x_n: "f(x_n)",
    f_prime_x_n: "f'(x_n)",
    error: s("variables.error"),
  };

  const [inputParams, setInputParams] = useState({
    func: "",
    x0: "1",
    tolerance: 0.0001,
    decimalPlaces: 6,
  });

  const [errors, setErrors] = useState({
    func: "",
    x0: "",
    tolerance: "",
    decimalPlaces: "",
  });

  const [iterations, setIterations] = useState<Iteration[]>([]);

  const validateInputs = () => {
    const newErrors = { func: "", x0: "", tolerance: "", decimalPlaces: "" };
    let isValid = true;

    if (!inputParams.func.trim()) {
      newErrors.func = s("errors.func");
      isValid = false;
    }

    const x0Number = parseFloat(inputParams.x0);
    if (isNaN(x0Number)) {
      newErrors.x0 = t("errors.initialValue");
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

  const newtonRaphson = () => {
    if (!validateInputs()) return;
    setIterations([]);

    try {
      let x = parseFloat(inputParams.x0);
      const iter = [];
      let error = 1;
      let count = 0;
      const maxIter = 30;
      const decimalPlaces = inputParams.decimalPlaces;

      while (error > inputParams.tolerance && count < maxIter) {
        let f_x, f_prime_x;
        try {
          f_x = evaluate(inputParams.func, { x });
          f_prime_x = evaluate(derivative(inputParams.func, "x").toString(), {
            x,
          });
        } catch (error) {
          if (error) {
            setErrors((prev) => ({
              ...prev,
              func: t("errors.funcError"),
            }));
            return;
          }
        }

        if (f_prime_x === 0) {
          setErrors((prev) => ({
            ...prev,
            func: t("errors.derivativeZero"),
          }));
          return;
        }

        const x_new = x - f_x / f_prime_x;
        error = Math.abs(x_new - x);
        const formattedError = error.toFixed(decimalPlaces);

        iter.push({
          iter: count + 1,
          x_n: x.toFixed(decimalPlaces),
          x_n1: x_new.toFixed(decimalPlaces),
          f_x_n: f_x.toFixed(decimalPlaces),
          f_prime_x_n: f_prime_x.toFixed(decimalPlaces),
          error: formattedError,
        });

        if (formattedError === "0.".padEnd(decimalPlaces + 2, "0")) {
          break;
        }

        x = x_new;
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
                  {t("description.1")}
                  <Latex>{` $x_0$`}</Latex>
                  {t("description.2")}{" "}
                  <a
                    href="https://es.wikipedia.org/wiki/M%C3%A9todo_de_Newton"
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
                x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}
                \\]
                ${t("formula.2")}
                \\[
                \\begin{align*}
                x_n & : \\text{${t("formula.3")}} \\\\
                x_{n+1} & : \\text{${t("formula.4")}} \\\\
                f(x_n) & : \\text{${t("formula.5")}} x_n \\\\
                f'(x_n) & : \\text{${t("formula.6")} } x_n \\\\
                \\end{align*}
                \\]
                ${t("formula.7")}
                \\[
                \\text{${t("formula.8")}} = |x_{n+1} - x_n| < \\text{${t(
                    "formula.9"
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
              placeholder={"x^2"}
              onChange={(e) =>
                setInputParams({ ...inputParams, func: e.target.value })
              }
            />
            {errors.func && (
              <p className="text-red-500 text-sm mb-3">{errors.func}</p>
            )}
            <InputField
              label={<Latex>{`${s("initialValueLabel")} $x_0$`}</Latex>}
              type={"text"}
              value={inputParams.x0}
              onChange={(e) =>
                setInputParams({ ...inputParams, x0: e.target.value })
              }
            />
            {errors.x0 && (
              <p className="text-red-500 text-sm mb-3">{errors.x0}</p>
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
              onClick={newtonRaphson}
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
            <GraphIterations
              data={iterations}
              xAxisDefaultKey={"iter"}
              yAxisDefaultKey={"x_n1"}
              variableTranslations={variableTranslations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
