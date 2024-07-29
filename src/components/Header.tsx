import { Box, Flex, Text } from "@chakra-ui/react";

import logo from "../assets/grass-logo-3.jpg";
import ThemeColorToggler from "./ThemeColorToggler";

function Header() {
  return (
    <Flex
      bgImage={logo}
      borderRadius={"lg"}
      height={"100px"}
      justify={"space-between"}
    >
      <Box>
        <Text
          fontSize={{ base: "sm", md: "lg", lg: "xl" }}
          fontWeight="bold"
          marginLeft={"25px"}
          marginTop={"110px"}
          fontFamily={"Inter, sans-serif"}
          color={"gray.500"}
        >
          Grass Weed Detector
        </Text>
        <Text
          marginLeft={"25px"}
          fontSize={"sm"}
          fontFamily={"Roboto, sans-serif"}
          color={"gray.400"}
        >
          Upload a picture of your lawn and let's see if you have weed.
        </Text>
        <Text
          marginLeft={"25px"}
          
          fontSize={"xs"}
          fontFamily={"Roboto, sans-serif"}
          color={"gray.400"}
        >
          This app uses a custom-trained Azure AI Vision model to detect weed
          and grass in an image.
        </Text>
      </Box>
      <Box marginTop={"105px"}>
        <ThemeColorToggler />
      </Box>
    </Flex>
  );
}

export default Header;
