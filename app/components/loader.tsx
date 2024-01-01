import { Flex, Loader } from "@mantine/core";

export function CenterLoader() {
  return (
    <Flex justify="center" py="sm">
      <Loader size="sm" />
    </Flex>
  );
}
