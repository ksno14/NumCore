"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
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
  error: string;
};

export default function IterativeRooting() {
  const s = useTranslations("Shared");
  const t = useTranslations("IterativeRooting");

  const variableTranslations = {
    iter: s("variables.iter"),
    x_n: "x_n",
    x_n1: "x_{n+1}",
    error: s("variables.error"),
  };

  const [inputParams, setInputParams] = useState({
    index: "",
    number: "",
    tolerance: 0.0001,
    decimalPlaces: 6,
  });

  const [errors, setErrors] = useState({
    index: "",
    number: "",
    tolerance: "",
    decimalPlaces: "",
  });

  const [iterations, setIterations] = useState<Iteration[]>([]);

  const validateInputs = () => {
    const newErrors = {
      index: "",
      number: "",
      tolerance: "",
      decimalPlaces: "",
    };
    let isValid = true;

    if (!inputParams.index.trim()) {
      newErrors.index = s("errors.index");
      isValid = false;
    }

    if (!inputParams.number.trim()) {
      newErrors.number = s("errors.number");
      isValid = false;
    }

    if (isNaN(parseFloat(inputParams.index))) {
      newErrors.index = t("errors.validIndex");
      isValid = false;
    }

    if (isNaN(parseFloat(inputParams.number))) {
      newErrors.number = t("errors.validNumber");
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

  const iterativeRooting = () => {
    if (!validateInputs()) return;
    setIterations([]);

    try {
      const n = parseFloat(inputParams.index);
      const a = parseFloat(inputParams.number);
      const tolerance = inputParams.tolerance;
      const decimalPlaces = inputParams.decimalPlaces;
      let count = 0;
      const maxIter = 100;

      if (n <= 0) {
        setErrors((prev) => ({
          ...prev,
          index: t("errors.negativeIndex"),
        }));
        return;
      }

      if (a < 0 && n % 2 === 0) {
        setErrors((prev) => ({
          ...prev,
          number: t("errors.validOperation"),
        }));
        return;
      }

      let x_k = a / n;
      const iterationsList = [];
      let error = tolerance + 1;
      let iter = 0;

      while (error > tolerance && count < maxIter) {
        const x_k1 = (1 / n) * ((n - 1) * x_k + a / Math.pow(x_k, n - 1));
        error = Math.abs(x_k1 - x_k);

        iterationsList.push({
          iter: iter + 1,
          x_n: x_k.toFixed(decimalPlaces),
          x_n1: x_k1.toFixed(decimalPlaces),
          error: error.toFixed(decimalPlaces),
        });

        x_k = x_k1;
        iter++;
        count++;
      }

      setIterations(iterationsList);
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
                  {t("description")}{" "}
                  <a
                    href="https://es.wikipedia.org/wiki/Radicaci%C3%B3n#C%C3%A1lculo_de_la_ra%C3%ADz_en%C3%A9sima"
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
                ${t("formula.1")} $a$ ${t("formula.2")} 
                \\[
                x_{k+1} = \\frac{1}{n} \\left[ (n-1)x_k + \\frac{a}{x_k^{n-1}} \\right]
                \\]
                ${t("formula.3")}
                \\[
                x_k \\text{ ${t("formula.4")} } k.
                \\]
                ${t("formula.5")}
                \\[
                \\text{${t("formula.6")}} = |x_{k+1} - x_n| < \\text{${t(
                    "formula.7"
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
              label={t("numberLabel")}
              type={"text"}
              value={inputParams.number}
              placeholder={"16989"}
              onChange={(e) =>
                setInputParams({ ...inputParams, number: e.target.value })
              }
            />
            {errors.number && (
              <p className="text-red-500 text-sm mb-3">{errors.number}</p>
            )}
            <InputField
              label={s("indexLabel")}
              type={"text"}
              value={inputParams.index}
              placeholder={t("indexPlaceholder")}
              onChange={(e) =>
                setInputParams({ ...inputParams, index: e.target.value })
              }
            />
            {errors.index && (
              <p className="text-red-500 text-sm mb-3">{errors.index}</p>
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
              onClick={iterativeRooting}
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
