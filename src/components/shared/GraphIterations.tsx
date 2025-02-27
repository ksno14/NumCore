import { useTranslations } from "next-intl";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useState } from "react";

Chart.register(...registerables);

type GraphProps = {
  data: { [key: string]: string | number }[];
  xAxisDefaultKey: string;
  yAxisDefaultKey: string;
  variableTranslations: { [key: string]: string };
};

export default function Graph({
  data,
  xAxisDefaultKey,
  yAxisDefaultKey,
  variableTranslations,
}: GraphProps) {
  const g = useTranslations("Graphs");

  const [xAxis, setXAxis] = useState(xAxisDefaultKey);
  const [yAxis, setYAxis] = useState(yAxisDefaultKey);

  const chartData = {
    labels: data.map((it) => it[xAxis] as string),
    datasets: [
      {
        label: `${variableTranslations[yAxis]} vs ${variableTranslations[xAxis]}`,
        data: data.map((it) => parseFloat(it[yAxis] as string)),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
      },
    ],
  };

  return (
    <div className="bg-gray-200 p-6 rounded-xl w-full mt-6 border border-gray-400 shadow-lg">
      <h2 className="text-lg font-bold mb-4">{g("graphTitle")}</h2>
      <div className="flex flex-col xl:flex-row gap-4 items-start">
        <div className="w-full xl:w-3/4 min-h-96">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "right" },
              },
              scales: {
                x: {
                  title: { display: true, text: variableTranslations[xAxis] },
                },
                y: {
                  title: { display: true, text: variableTranslations[yAxis] },
                },
              },
            }}
          />
        </div>
        <div className="w-full xl:w-1/4 flex flex-col items-center">
          <div className="mb-4 w-full">
            <label className="block mb-2">{g("graphXAxis")}:</label>
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="p-2 border rounded-md w-full"
            >
              {Object.keys(variableTranslations).map((v) => (
                <option key={v} value={v} disabled={v === yAxis}>
                  {variableTranslations[v]}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 w-full">
            <label className="block mb-2">{g("graphYAxis")}:</label>
            <select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="p-2 border rounded-md w-full"
            >
              {Object.keys(variableTranslations).map((v) => (
                <option key={v} value={v} disabled={v === xAxis}>
                  {variableTranslations[v]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
