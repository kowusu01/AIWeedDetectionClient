import React from "react";
import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  VStack,
} from "@chakra-ui/react";
import PredictionsChartProps from "@/types/PredictionsChartProps";

////////////////////////////////////////////////////////////////////////////////
//
// This component displays the predictions in a circular progress chart.
// The predictions are passed as props to the component.
//
// It uses Chakra UI component CircularProgressBar to display the predictions.
//  - no external dependencies are required.
//
// The component takes the following props:
//  - predictionsList: array of predictions
//  - summary: summary of the predictions
//
//   Structure of the props passed to the component:
//    PredictionsChartProps {
//      predictionsList: [
//      {
//         predictedLabel: "Grass",
//         confidenceLevel: 89,
//         color: "#FFA500"
//      },
//      {
//         predictedLabel: "Weed",
//         confidenceLevel: 10,
//         color: "#FF0000"
//       }
//      ],
//      summary: string
//    }
//
// Usage:
// {predictions && predictions.predictionsList.length > 0 && (
//        <PredictionsConfidenceProgressChart
//          predictionsList={predictions.predictionsList}
//          summary={predictions.summary}
//        />
//      )}
//
////////////////////////////////////////////////////////////////////////////////

const PredictionsConfidenceProgressChart: React.FC<PredictionsChartProps> = (
  predictionsProps: PredictionsChartProps
) => {
  console.log(predictionsProps.predictionsList.length);

  return (
    predictionsProps && (
      <Box
        display={"flex"}
        flexDir={"column"}
        height={"100%"}
        borderWidth={1}
        w={"100%"}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          fontSize={"2xl"}
          fontWeight={"bold"}
        >
          Prediction confidence levels
        </Box>
        <Box
          display={"flex"}
          flexGrow={1}
          justifyContent="center"
          alignItems="center"
        >
          {predictionsProps.predictionsList.map((prediction: any) => (
            <VStack
              key={prediction.predictedLabel}
              m={2}
              paddingLeft={"25px"}
              paddingRight={"25px"}
            >
              <Box fontSize={"xl"} fontWeight={"bold"}>
                {prediction.predictedLabel}
              </Box>
              <Box flexGrow={1}>
                <CircularProgress
                  value={prediction.confidenceLevel}
                  color={prediction.color}
                  size="100px"
                  thickness="15px"
                >
                  <CircularProgressLabel
                    fontWeight="bold"
                    position="absolute"
                    textAlign="center"
                    fontSize="15px"
                  >
                    {prediction.confidenceLevel}%
                  </CircularProgressLabel>
                </CircularProgress>
              </Box>
            </VStack>
          ))}
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          paddingBottom={"10px"}
        >
          {predictionsProps.summary}
        </Box>
      </Box>
    )
  );
};

export default PredictionsConfidenceProgressChart;
