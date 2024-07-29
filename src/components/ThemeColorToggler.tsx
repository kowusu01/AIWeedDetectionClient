import { HStack, Switch, Text } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/color-mode";

export default function ThemeColorToggler() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <HStack>
        <Switch
          colorScheme="teal"
          isChecked={colorMode === "dark"}
          onChange={toggleColorMode}
        ></Switch>
        <Text>Theme {colorMode === "light" ? "Light" : "Dark"}</Text>
      </HStack>
    </>
  );
}
