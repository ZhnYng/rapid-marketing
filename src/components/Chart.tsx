"use client"

import { faker } from "@faker-js/faker";
import { Calendar } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

export default function Chart() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Impressions & clicks',
      },
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Views',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgb(168 85 247)',
      },
      {
        label: 'Clicks',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgb(216 180 254)',
      },
    ],
  };

  return (
    <div className="my-6 flex-[1]">
      <h2 className="text-2xl my-4">Traction over time</h2>
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="bg-white rounded-lg p-6">
          <Bar options={options} data={data} />
        </div>
        <p className="flex gap-2 justify-end mt-4"><Calendar />Last 12 months</p>
      </div>
    </div>
  )
}