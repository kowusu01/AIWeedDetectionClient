import { Grid, GridItem } from "@chakra-ui/react";

import "./App.css";
import Header from "./components/Header";
import { MainComponent } from "./components/MainComponent";
import AppConfig from "./configs/AppConfig";
import { useEffect, useState } from "react";
import { Constants } from "./configs/common/constants";

function App() {
  const config = new AppConfig();

  // create a state variable to store the main component props
  const [appComponentProps, setAppComponentProps] = useState({
    testDataStorageContainer: "",
    apiBaseUrl: "",
  });

  useEffect(() => {
    let storageContainerUrl = config.getAppConfigString(
      Constants.VITE_TEST_DATA_STORAGE_CONTAINER
    )
    if (!storageContainerUrl) {
      storageContainerUrl = Constants.DEFAULT_TEST_DATA_STORAGE_CONTAINER;
      console.log(
        "storageContainer url is not set, using default: ",
        storageContainerUrl
      );
    }
    let apiBaseUrl = config.getAppConfigString(
      Constants.VITE_PREDICTIONS_API_ENDPOINT
    )
    if (!apiBaseUrl) {
      apiBaseUrl = Constants.DEFAULT_PREDICTIONS_API_ENDPOINT;
            console.log(
              "apiBaseUrl is not set, using default: ",
              apiBaseUrl
            );
    }

    const appProps = {
      testDataStorageContainer: storageContainerUrl,
      apiBaseUrl: apiBaseUrl,
    };
    setAppComponentProps(appProps);
  }, []);

  // add the props to a state object
  const mainComponentProps = {
    ...appComponentProps,
  };

  return (
    <>
      <Grid templateAreas={{ base: '"nav" "main"' }}>
        <GridItem
          area={"nav"}
          w="50%"
          m="auto"
          minWidth={["400px", "400px", "400px"]}
        >
          <Header />
          <MainComponent {...mainComponentProps} />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
