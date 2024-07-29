import {
  Card,
  CardHeader,
  CircularProgress,
  CircularProgressLabel,
  Flex,
} from "@chakra-ui/react";

// Define the props interface

import PredictionsProps from "../types/PredictionsProps";

const PredictionCard: React.FC<PredictionsProps> = ({
  predictedLabel,
  confidenceLevel,
  color,
}) => {
  return (
    <Card w="100%" p="5">
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="100%"
      >
        <CardHeader textAlign="center" fontSize="lg" fontWeight={"bold"}>
          {predictedLabel} Prediction Confidence
        </CardHeader>
        <CircularProgress
          value={confidenceLevel}
          color={color}
          size="80px"
          thickness="15px"
        >
          <CircularProgressLabel fontWeight="bold">
            {confidenceLevel}%
          </CircularProgressLabel>
        </CircularProgress>
      </Flex>
    </Card>
  );
};

export default PredictionCard;
