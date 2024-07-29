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
    const newTestDataStorageContainer = config.getAppConfigString(
      Constants.VITE_TEST_DATA_STORAGE_CONTAINER
    );
    const newApiBaseUrl = config.getAppConfigString(
      Constants.VITE_PREDICTIONS_API_ENDPOINT
    );
    const appProps = {
      testDataStorageContainer: newTestDataStorageContainer,
      apiBaseUrl: newApiBaseUrl,
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
          minWidth={["600px", "600px", "600px"]}
        >
          <Header />
          <MainComponent {...mainComponentProps} />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
