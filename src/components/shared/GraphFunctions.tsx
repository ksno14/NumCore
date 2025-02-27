import { useTranslations } from "next-intl";
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { evaluate } from "mathjs";

Chart.register(...registerables);

type GraphProps = {
  func: string;
  points: string;
};

export default function GraphFunctions({ func, points }: GraphProps) {
  const g = useTranslations("Graphs");
  const parsedPoints = points.split(";").map((point) => {
    const [x, y] = point.split(",").map(Number);
    return { x, y };
  });

  parsedPoints.sort((a, b) => a.x - b.x);

  const labels = parsedPoints.map((p) => p.x);

  const dataPoints = labels.map((x) => {
    try {
      return evaluate(func.replace(/x/g, `(${x})`));
    } catch {
      return NaN;
    }
  });

  const data = {
    labels,
    datasets: [
      {
        label: `y = ${func}`,
        data: dataPoints,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        pointRadius: 0,
      },
      {
        label: "Puntos",
        data: parsedPoints.map((p) => p.y),
        borderColor: "red",
        backgroundColor: "red",
        pointRadius: 5,
        showLine: false,
      },
    ],
  };

  return (
    <div className="bg-gray-200 p-6 rounded-xl w-full mt-6 border border-gray-400 shadow-lg">
      <h2 className="text-lg font-bold mb-4">{g("graphTitle")}</h2>
      <div className="flex flex-col xl:flex-row gap-4 items-start">
        <div className="w-full xl:w-3/4 min-h-96">
          <Line data={data} />
        </div>
      </div>
    </div>
  );
}
