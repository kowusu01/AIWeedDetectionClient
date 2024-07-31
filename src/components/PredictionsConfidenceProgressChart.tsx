import PredictionsChartProps from "@/types/PredictionsChartProps";
import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  VStack,
} from "@chakra-ui/react";

////////////////////////////////////////////////////////////////////////////////
// Usage:
// {predictions && predictions.predictionsList.length > 0 && (
//        <PredictionCard
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
      <Flex
        direction="row"
        wrap="wrap"
        justify="center"
        borderWidth={1}
        w={"100%"}
      >
        {predictionsProps.predictionsList.map((prediction: any) => (
          <VStack key={prediction.predictedLabel} m={2} padding={"25"}>
            <Box fontSize={"xl"} fontWeight={"bold"}>
              {prediction.predictedLabel}
            </Box>
            <Box paddingLeft="10%" paddingRight="10%">
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
        <Box>{predictionsProps.summary}</Box>
      </Flex>
    )
  );
};

export default PredictionsConfidenceProgressChart;
