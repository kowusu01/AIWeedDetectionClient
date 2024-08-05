import {
  Box,
  Image,
  VStack,
  Button,
  Input,
  Center,
  useToast,
  Flex,
  FormLabel,
  FormControl,
  Select,
  Spinner,
  HStack,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";

import PredictionsConfidenceProgressChart from "./PredictionsConfidenceProgressChart";
import PredictionsConfidenceChart from "./PredictionsConfidenceChart";

import PredictionsChartProps from "../types/PredictionsChartProps";
import AppComponentProps from "@/types/AppComponentProps";

import { Constants } from "../configs/common/constants";

export const MainComponent: React.FC<AppComponentProps> = ({
  testDataStorageContainerUrl,
  apiBaseUrl,
}) => {
  // for displaying toast messages
  const toast = useToast();

  const VISUALIZATION_TYPE_BAR_CHART = "1";
  const VISUALIZATION_TYPE_CIRCULAR_CHART = "2";

  const [visualization, setVisualization] = useState(
    VISUALIZATION_TYPE_CIRCULAR_CHART
  );

  // state object stores image as url - this is what is displayed on th screen
  const [image, setImage] = useState<string | undefined>();

  // stores the uploaded file as object - this is what is sent to the api
  const [fileUpload, setFileUpload] = useState<any | null>();

  // or if a file name is selected from the list, send the file name to the server
  const [fileName, setFileName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean | false>();
  const [predictions, setPredictions] =
    useState<PredictionsChartProps | null>();
  const [predictionsSummary, setPredictionsSummary] = useState<string>("");

  const loadSelectedFile = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!event.target.value) {
      setFileName("");
      setImage("");
      return;
    }
    console.log("file selected: " + event.target.value);
    let url = testDataStorageContainerUrl + event.target.value;
    https: axios
      .get(url, {
        responseType: "blob",
      })
      .then((response) => {
        const imageUrl = URL.createObjectURL(response.data);

        // set image for display to user
        setImage(imageUrl);

        //clear the image that was loaded previously
        setFileUpload(null);
        // clear the predictions that were displayed previously
        setPredictions(null);
      })
      .then(() => {
        console.log("test image " + event.target.value + " loaded from azure.");
        // if a new file is selected, clear the current predictions
        setPredictions(null);
        setFileName(event.target.value);
      })
      .catch((error) => {
        console.log(error);
        toast({
          status: "error",
          title: "Error",
          description: error.message,
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      });
  };

  const processResponse = (response: any) => {
    setIsLoading(false);

    try {
      // proceed to read the analyzed image back from the server

      console.log(response.data);
      let predictions_json = response.data;
      console.log(predictions_json.detected_details.length);
      console.log(predictions_json.detected_details);
      console.log(predictions_json.summary);
      setPredictionsSummary(predictions_json.summary);
      const predictionsList = predictions_json.detected_details.map(
        (detail: any) => ({
          predictedLabel: detail.predictedLabel,
          confidenceLevel: Math.round(detail.confidenceLevel * 100),
          color: detail.color,
        })
      );
      // sort the predictions by confidence level
      predictionsList.sort(
        (a: any, b: any) => b.confidenceLevel - a.confidenceLevel
      );

      const predictionsProps: PredictionsChartProps = {
        predictionsList: predictionsList,
        summary: predictionsSummary,
      };
      setPredictions(predictionsProps);
      console.log(predictionsProps);
      loadAnalyzedImageWithPredictions(response.data);
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: "Error",
        description: "Failed to process response.",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }
  };

  /////////////////////////////////////////////////////////////////////////
  // - after the call to analyze an image has been made,
  // - the server saves a copy of the analyzed with predictions
  // - it returns the filename/url of the image with predictions
  // - this function reads the image back from the server
  // - and displays it on the screen
  const loadAnalyzedImageWithPredictions = (data: any) => {
    console.log("reading prediction image from server...");

    console.log(data);
    console.log(data.prediction_image_url);

    let url =
      apiBaseUrl +
      Constants.PREDICTIONS_IMAGE_ENDPOINT +
      data.prediction_image_url;
    axios
      .get(url, {
        responseType: "blob",
      })
      .then((response) => {
        console.log("image received");
        const imageUrl = URL.createObjectURL(response.data);
        // Now you can use `imageUrl` as the `src` attribute of an `img` element
        setImage(imageUrl);
        toast({
          status: "success",
          title: "Success",
          description: "Analysis complete.",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
        console.log("done reading prediction image from server.");
      })
      .catch((error) => {
        console.log(error);
        toast({
          status: "error",
          title: "Error",
          description: error.message,
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      });
  };

  const handleFileRead = (event: ProgressEvent<FileReader>) => {
    const reader = event.target as FileReader;
    if (reader.readyState === FileReader.DONE) {
      setImage(reader.result as string);
      setPredictions(null);
    }
  };

  /////////////////////////////////////////////////////////////////////////
  // called when a user selects a file to upload
  // this function reads the file and stores it in the state object 'image'
  // the state object 'image' is bound to a ui object for display
  // the same image is sent to the server for analysis upon submission
  const handleUploadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("uploading file...");
    const file = event.target.files?.[0];

    try {
      if (file) {
        // Check if file size is greater than 2MB
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 2) {
          toast({
            title: "Error",
            description: "File size exceeds 2MB limit.",
            status: "error",
            duration: 5000,
            position: "top-right",
            isClosable: true,
          });
          console.log("file size exceeds 2MB limit, file not uploaded.");
          return;
        }

        // this is what is sent to the api
        setFileUpload(file);
        console.log("selected file has been set: name: " + file.name);
        let file_name = file.name.replace(/\s/g, "_");
        console.log(file_name);
        const reader = new FileReader();
        reader.onloadend = handleFileRead;
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: "Error",
        description: "Failed to upload file.",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  useEffect(() => {}, [image]);

  const handleSubmit = () => {
    try {
      // if a user uploads a file. it always takes precedence over a selected file
      if (fileUpload) {
        submitUploadedFile();
      } else if (fileName) {
        submitSelectedFile();
      }
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: "Error",
        description: "Failed to submit file.",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  /////////////////////////////////////////////////////////////////////////////////
  // - called when the submit button is clicked
  // - it is assumed that a file has been selected and displayed for the user to see
  // - this function sends the file to the server for analysis
  // - the server in this case is an api that interfaces with Azure AI Vision model
  // - the server returns the result of the analysis including the filename/url
  //  of the analysed which has aread marked grass/weed if grtass or wee were detected.
  const submitUploadedFile = () => {
    if (fileUpload) {
      // if a file has been selected:
      // and has been stored in the state object 'fileUpload'
      // now send the file to the server for analysis

      // create a FormData object to hold the file content
      const formData = new FormData();
      formData.append("file", fileUpload);
      setIsLoading(true);

      console.log(
        "submitting uploaded file " +
          apiBaseUrl +
          Constants.PREDICTIONS_ANALYZE_BY_FILE_ENDPOINT
      );
      // attempt to send the file content to the server
      axios({
        method: "post",
        url: apiBaseUrl + Constants.PREDICTIONS_ANALYZE_BY_FILE_ENDPOINT,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          responseType: "json",
        },
      })
        .then((response) => {
          // post was successful - image analysis was done
          // the server has returned the url of the image that has been marked with
          // the detected areas of grass and/or weeds
          // the filename should have been returned
          // make a call back to server read the image back and display it
          processResponse(response);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          toast({
            status: "error",
            title: "Error",
            description: error.message,
            duration: 5000,
            position: "top-right",
            isClosable: true,
          });

          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error data:", error.response.data);
            console.error("Error status:", error.response.status);
            console.error("Error headers:", error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.error("Error request:", error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error message:", error.message);
          }
        });
    }
  };

  const submitSelectedFile = () => {
    if (fileName) {
      // if a file has been selected:
      // and has been stored in the state object 'fileName'
      // now send the file to the server for analysis

      // create a FormData object to hold the file content
      const formData = new FormData();
      formData.append("file", fileUpload);
      setIsLoading(true);

      // attempt to send the file content to the server
      axios({
        method: "post",
        url:
          apiBaseUrl +
          Constants.PREDICTIONS_ANALYZE_BY_FILENAME_ENDPOINT +
          fileName,
        headers: {
          responseType: "json",
        },
      })
        .then((response) => {
          // post was successful - image analysis was done
          // the server has returned the url of the image that has been marked with
          // the detected areas of grass and/or weeds
          // the filename should have been returned
          // make a call back to server read the image back and display it
          processResponse(response);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          toast({
            status: "error",
            title: "Error",
            description: error.message,
            duration: 5000,
            position: "top-right",
            isClosable: true,
          });

          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error data:", error.response.data);
            console.error("Error status:", error.response.status);
            console.error("Error headers:", error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.error("Error request:", error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error message:", error.message);
          }
        });
    }
  };

  return (
    <VStack>
      <Box
        width="100%"
        marginTop={"70px"}
        borderRadius={"lg"}
        minWidth={["500px", "500px", "500px"]}
      >
        <Center>
          <Flex>
            <Box
              width={"200px"}
              flex={1}
              borderWidth={1}
              margin={5}
              paddingTop={5}
            >
              <FormControl id="test-image-select">
                <FormLabel textAlign={"center"} color={"gray.400"}>
                  Test with sample image
                </FormLabel>
                <Center>
                  <Select
                    placeholder="Select ..."
                    onChange={loadSelectedFile}
                    width={"150px"}
                  >
                    <option value="test-1-all-grass.JPG">lawn 1</option>
                    <option value="test-2-all-weed.JPG">lawn 2</option>
                    <option value="test-2-mixed.JPG">lawn 3</option>
                    <option value="test-5-mixed.JPG">lawn 4</option>
                    <option value="test-7-mixed.JPG">lawn 5</option>
                    <option value="test-11-all-grass.JPG">lawn 6</option>
                  </Select>
                </Center>
              </FormControl>
            </Box>
            <Box flex={1} borderWidth={1} margin={5} width={"200px"}>
              <Center>
                <FormControl id="test-image-select">
                  <FormLabel
                    color={"gray.400"}
                    textAlign={"center"}
                    padding={5}
                    fontSize={"sm"}
                  >
                    Upload your own image (max. 2MB)
                  </FormLabel>

                  <Center>
                    <Button
                      bg="#5DBEA3"
                      color="white"
                      _hover={{ bg: "#5ADBB5" }}
                      as="label"
                      htmlFor="file-upload"
                      variant="solid"
                      size="sm"
                      fontSize={"sm"}
                      marginBottom="5"
                    >
                      Upload
                    </Button>
                  </Center>
                </FormControl>
              </Center>

              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleUploadFromFile}
              />
            </Box>
          </Flex>
        </Center>
      </Box>

      <Button
        bg="#5DBEA3"
        color="white"
        _hover={{ bg: "#5ADBB5" }}
        isDisabled={(!fileUpload && !fileName) || isLoading}
        isLoading={isLoading}
        loadingText="Processing"
        spinnerPlacement="end"
        marginTop="7px"
        marginBottom={"5"}
        onClick={handleSubmit}
      >
        Analyze
      </Button>
      {predictions && predictions.predictionsList.length > 0 && (
        <Box
          display={"flex"}
          flexDir={"column"}
          height={"100%"}
          borderWidth={1}
          w={"100%"}
          alignItems={"center"}
        >
          <HStack>
            {visualization === VISUALIZATION_TYPE_BAR_CHART && (
              <Box width={"95%"}>
                <PredictionsConfidenceChart
                  predictionsList={predictions.predictionsList}
                  summary={predictions.summary}
                />
              </Box>
            )}

            {visualization === VISUALIZATION_TYPE_CIRCULAR_CHART && (
              <Box width={"95%"}>
                <PredictionsConfidenceProgressChart
                  predictionsList={predictions.predictionsList}
                  summary={predictions.summary}
                />
              </Box>
            )}
          </HStack>

          <HStack width="100%" spacing={4} alignItems="center">
            <Box
              width={"95%"}
              paddingLeft={"10px"}
              paddingTop={"15px"}
              textAlign={"center"}
              fontSize={"l"}
              fontWeight={"bold"}
              fontFamily="Menlo, monospace"
              color={"gray.400"}
            >
              {predictions.summary}
            </Box>
            <Box
              paddingRight={"5px"}
              borderStyle={"solid"}
              borderWidth={1}
              margin={2}
              padding={2}
            >
              <RadioGroup onChange={setVisualization} value={visualization}>
                <Stack direction="row">
                  <Radio value="1">Bar</Radio>
                  <Radio value="2">Circular</Radio>
                </Stack>
              </RadioGroup>
            </Box>
          </HStack>
        </Box>
      )}

      {image && (
        <Box
          width={"100%"}
          padding={"5px"}
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={"lg"}
        >
          <Image
            src={image}
            alt=""
            borderRadius={"lg"}
            width="100%"
            height="100%"
          />
          {isLoading && (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex="1"
              textAlign="center"
            >
              <Spinner size="xl" fontWeight={"bold"} />
            </Box>
          )}
        </Box>
      )}

      <Box
        width="100%"
        marginTop={"5px"}
        marginBottom={"5px"}
        borderStyle="solid"
        borderRadius={"lg"}
        textAlign={"center"}
        fontSize={"xs"}
      >
        MIT License © 2024 Kwaku Owusu-Tieku | ver 1.0.0 revision 24082
      </Box>
    </VStack>
  );
};
