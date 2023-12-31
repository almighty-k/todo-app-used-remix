import { Outlet } from "@remix-run/react";
import { Box, Card } from "@mantine/core";

export default function Auth() {
  return (
    <Box p="lg">
      <Card withBorder maw="450px" mx="auto">
        <Outlet />
      </Card>
    </Box>
  );
}
