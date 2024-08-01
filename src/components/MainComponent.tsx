// create Component MainComponent
// - use chakra-ui components
// - component width takes 50% of the screen
// - component has a top section and a bottom section
// - top section width 15% of this area
// - bottom section width 85% of this area
// - bottom section hosts an image

import {
  Box,
  Image,
  VStack,
  Button,
  Input,
  Card,
  Center,
  useToast,
  Flex,
  FormLabel,
  FormControl,
  Select,
  Spinner,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import axios from "axios";
import PredictionsConfidenceProgressChart from "./PredictionsConfidenceProgressChart";
import PredictionsChartProps from "../types/PredictionsChartProps";
import AppComponentProps from "@/types/AppComponentProps";
import { Constants } from "../configs/common/constants";

export const MainComponent: React.FC<AppComponentProps> = ({
  testDataStorageContainer,
  apiBaseUrl,
}) => {
  // for displaying toast messages
  const toast = useToast();

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
    console.log("file selected: " + event.target.value);
    //let url = testDataStorageContainer + event.target.value;
    console.log(`testDataStorageContainer ${testDataStorageContainer}`);
    let url = testDataStorageContainer + event.target.value;
    //
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
      console.log("before mapping response to chart format...");
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
        summary: predictions_json.summary,
      };
      setPredictions(predictionsProps);
      console.log(predictionsProps);
      loadAnalyzedImageWithPredictions(response.data);
      console.log("before mapping response to chart format...");
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

      // attempt to send the file content to the server
      axios({
        method: "post",
        url: apiBaseUrl + Constants.PREDICTIONS_ANALYZE_BY_FILE_ENDPOINT,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          responseType: "blob",
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
        });
    }
  };

  return (
    <VStack>
      <Box
        width="100%"
        marginTop={"80px"}
        p={"5px"}
        borderWidth="2px"
        borderStyle="solid"
        borderRadius={"lg"}
        minWidth={["500px", "500px", "500px"]}
      >
        <Center>
          <Flex>
            <Box flex={1} padding={"15px"} borderWidth={1} margin={5}>
              <FormControl id="test-image-select">
                <FormLabel>Test with sample image</FormLabel>
                <Select
                  placeholder="Select ..."
                  onChange={loadSelectedFile}
                  width={"200px"}
                >
                  <option value="test-1-all-grass.JPG">lawn 1</option>
                  <option value="test-2-all-weed.JPG">lawn 2</option>
                  <option value="test-2-mixed.JPG">lawn 3</option>
                  <option value="test-5-mixed.JPG">lawn 4</option>
                  <option value="test-7-mixed.JPG">lawn 5</option>
                  <option value="test-11-all-grass.JPG">lawn 6</option>
                </Select>
              </FormControl>
            </Box>
            <Box flex={1} padding={"15px"} borderWidth={1} margin={5}>
              <FormControl id="test-image-select">
                <FormLabel>Upload your own image (max. 2MB)</FormLabel>
                <Button
                  colorScheme="teal"
                  bg="#008080"
                  color="white"
                  _hover={{ bg: "#006666" }}
                  alignContent={"center"}
                  as="label"
                  htmlFor="file-upload"
                  variant="solid"
                  size="sm"
                  marginTop="5"
                  marginRight="5px"
                  w="100px"
                  marginBottom="5"
                >
                  Upload image
                </Button>
              </FormControl>

              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleUploadFromFile}
              />
            </Box>

            <Button
              colorScheme="teal"
              bg="#008080"
              color="white"
              _hover={{ bg: "#006666" }}
              isDisabled={(!fileUpload && !fileName) || isLoading}
              isLoading={isLoading}
              loadingText="Processing"
              spinnerPlacement="end"
              marginTop="78px"
              size="sm"
              w="100px"
              marginBottom={"5"}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Flex>
        </Center>
      </Box>

      {predictions && predictions.predictionsList.length > 0 && (
        <PredictionsConfidenceProgressChart
          predictionsList={predictions.predictionsList}
          summary={predictionsSummary}
        />
      )}

      <Card
        data-image-section="image-card"
        width="100%"
        p="10"
        margin={"15px"}
        borderWidth="2px"
        borderStyle="solid"
        position="relative"
      >
        <Box position="relative">
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
      </Card>

      <Box
        width="100%"
        marginTop={"5px"}
        marginBottom={"5px"}
        borderWidth="2px"
        borderStyle="solid"
        borderRadius={"lg"}
      ></Box>
    </VStack>
  );
};
