import { Card, CardHeader, Flex } from "@chakra-ui/react";
import { ChartConfig, ChartContainer } from "./ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  LabelProps,
  XAxis,
  YAxis,
} from "recharts";

const TestPredictionsChartCard: React.FC<any> = () => {
  const chartData = [
    { predicted: "Grass", confidence: 86 },
    { predicted: "Weed", confidence: 45 },
  ];
  const CustomLabel = ({
    x,
    y,
    width,
    value,
  }: {
    x: string | number | undefined;
    y: string | number | undefined;
    width: string | number;
    value: string | number;
  }) => {
    // Render label with passed parameters
    return (
      <g>
        <text
          x={(x as number) + (width as number) / 2}
          y={y as number}
          dy={-6}
          fill="#666"
          textAnchor="middle"
        >
          {value}%
        </text>
      </g>
    );
  };

  const chartConfig = {
    Grass: {
      label: "Grass",
      color: "#2563eb",
    },
    Weed: {
      label: "Weed",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <Card w="100%" p="5">
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="100%"
      >
        <CardHeader textAlign="center" fontSize="lg" fontWeight={"bold"}>
          Prediction Confidence
        </CardHeader>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            layout="vertical"
            accessibilityLayer
            data={chartData}
            barCategoryGap="30%"
            barGap={20}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickCount={3} />
            <YAxis type="category" dataKey="predicted" hide />
            <Bar dataKey="confidence" isAnimationActive={false}>
              <LabelList
                dataKey="confidence"
                position="right"
                content={(props: LabelProps) => {
                  // Now TypeScript knows the structure of props, including the payload property
                  const { x, y, width, value } = props;
                  return (
                    <CustomLabel
                      x={x}
                      y={y}
                      width={width ?? 0}
                      value={Number(value) ?? 0}
                    />
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </Flex>
    </Card>
  );
};

export default TestPredictionsChartCard;
