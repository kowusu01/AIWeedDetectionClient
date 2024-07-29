/////////////////////////////////////////////////////////////////////////////////////
//  PredictionsConfidenceChart.tsx
//  This component displays the confidence level of the predictions in a bar chart
//  It uses Recharts library from shadcn library.
/////////////////////////////////////////////////////////////////////////////////////
import PredictionsChartConfig from "../configs/PredictionChartConfigs";
import { ChartContainer } from "./ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Dot,
  LabelList,
  LabelProps,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import PredictionsProps from "@/types/PredictionsProps";

const PredictionsConfidenceChartV3: React.FC<any> = ({ predictions }) => {
  console.log("In PredictionsChartCard...");
  console.log(predictions);

  //1. get the chart config so we can update the colors from the api call
  let chartConfig = new PredictionsChartConfig().getChartConfig();

  //2. create the chart data in a format that the chart component can understand
  let chartData: any[] = [];
  let chartDataObject: any = {};

  // map the predictions to the chart data
  predictions.map((prediction: PredictionsProps) => {
    // set the chart data object
    chartDataObject[prediction.predictedLabel] = prediction.confidenceLevel;

    // set the color of the prediction
    if (prediction.predictedLabel === "Grass") {
      chartConfig.Grass.color = prediction.color;
    } else if (prediction.predictedLabel === "Weed") {
      chartConfig.Weed.color = prediction.color;
    } else {
      console.log("Unknown prediction label: " + prediction.predictedLabel);
    }
  });

  chartData.push(chartDataObject);
  console.log("newly built chartData");
  console.log(chartData);

  const CustomLabel = ({ x, y, width, value }) => {
    // Render label with passed parameters
    return (
      <g>
        <text
          x={x + width / 2}
          y={y}
          dy={-6}
          textAnchor="middle"
          fill="grey"
          fontSize="12px"
          fontWeight="bold"
          fontFamily="Menlo, monospace"
        >
          {value}%
        </text>
      </g>
    );
  };

  //const test_chartData = [{ Grass: 90, Weed: 45 }];

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[150px] min-h-[100px] w-[50%]"
    >
      <ResponsiveContainer width="100%">
        <LineChart data={predictions}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />
          <Line
            type="monotone"
            dataKey="confidence"
            stroke="#8884d8"
            dot={false}
          />
          {predictions.map((entry, index) => (
            <Dot
              key={`dot-${index}`}
              cx={entry.cx}
              cy={entry.cy}
              r={5}
              fill="#8884d8"
              stroke="#8884d8"
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PredictionsConfidenceChartV3;
