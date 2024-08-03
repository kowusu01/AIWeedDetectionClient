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
  LabelList,
  LabelProps,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import PredictionsProps from "@/types/PredictionsProps";
import PredictionsChartProps from "@/types/PredictionsChartProps";
import { Box } from "@chakra-ui/react";

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//{predictions && predictions.predictionsList.length > 0 && (
//        <PredictionsConfidenceChart predictionsList={predictions.predictionsList} summary={predictions.summary} />
//     )}
//
//      {predictions && predictions.predictionsList.length > 0 && (
//        <Box
//          width="100%"
//          paddingTop={"15px"}
//          textAlign={"center"}
//          fontSize={"l"}
//          fontWeight={"bold"}
//          fontFamily="Menlo, monospace"
//          color={"gray.400"}
//        >
//          {predictionsSummary}
//        </Box>
//      )}
//
////////////////////////////////////////////////////////////////////////////////////////////////////////

const PredictionsConfidenceChart: React.FC<PredictionsChartProps> = (
  predictionsProps: PredictionsChartProps
) => {
  console.log("In PredictionsChartCard...");
  console.log(predictionsProps.predictionsList.length);

  //1. get the chart config so we can update the colors from the api call
  let chartConfig = new PredictionsChartConfig().getChartConfig();

  //2. create the chart data in a format that the chart component can understand
  let chartData: any[] = [];
  let chartDataObject: any = {};

  // map the predictions to the chart data
  predictionsProps.predictionsList.map((prediction: PredictionsProps) => {
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

  const CustomLabel = ({
    x = 0,
    y,
    width,
    value,
  }: {
    x?: string | number | undefined;
    y: string | number | undefined;
    width: string | number | undefined;
    value: string | number | undefined;
  }) => {
    // Render label with passed parameters
    return (
      <g>
        <text
          x={Number(x) + Number(width) / 2}
          y={Number(y)}
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
    <Box
      display={"flex"}
      flexDir={"column"}
      height={"100%"}
      w={"100%"}
      alignItems={"center"}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        fontSize={"xl"}
        fontWeight={"bold"}
        p={5}
      >
        Prediction confidence levels
      </Box>
      <ChartContainer config={chartConfig} className="h-[200px] min-h-[100px] ">
        <ResponsiveContainer width="100%">
          <BarChart
            layout="vertical"
            accessibilityLayer
            data={chartData}
            barCategoryGap="30%"
            barGap={12}
            height={100}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickCount={3} />
            <YAxis type="category" hide />
            <Legend wrapperStyle={{ position: "relative" }} />
            <Bar
              dataKey="Grass"
              fill="var(--color-Grass)"
              radius={4}
              barSize={30}
            >
              <LabelList
                dataKey="Grass"
                content={(props: LabelProps) => {
                  // Now TypeScript knows the structure of props, including the payload property
                  const { x, y, width, value } = props;
                  return (
                    <CustomLabel x={x} y={y} width={width} value={value} />
                  );
                }}
              />
            </Bar>

            <Bar
              dataKey="Weed"
              fill="var(--color-Weed)"
              radius={4}
              barSize={30}
            >
              <LabelList
                dataKey="Weed"
                content={(props: LabelProps) => {
                  // Now TypeScript knows the structure of props, including the payload property
                  const { x, y, width, value } = props;
                  return (
                    <CustomLabel x={x} y={y} width={width} value={value} />
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Box>
  );
};

export default PredictionsConfidenceChart;
