import { Grid, GridItem } from "@chakra-ui/react";

import "./App.css";
import Header from "./components/Header";
import { MainComponent } from "./components/MainComponent";
import { useState } from "react";

function App() {
  // create a state variable to store the main component props
  const [appComponentProps] = useState({
    testDataStorageContainerUrl: import.meta.env
      .VITE_TEST_DATA_STORAGE_CONTAINER,
    apiBaseUrl: import.meta.env.VITE_PREDICTIONS_API_ENDPOINT,
  });

  // add the props to a state object
  const mainComponentProps = {
    testDataStorageContainerUrl:
      appComponentProps.testDataStorageContainerUrl || "",
    apiBaseUrl: appComponentProps.apiBaseUrl || "",
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
