import { Button } from "@mantine/core";
import { useFetcher } from "@remix-run/react";
import { BookmarkedIcon, UnBookmarkedIcon } from "./icons";

interface BookmarkButtonProps {
  todoId: number;
  todoBookmarked: boolean;
}

export function BookmarkButton({
  todoId,
  todoBookmarked,
}: BookmarkButtonProps) {
  const fetcher = useFetcher();
  const bookmarked = fetcher.formData?.get("bookmarked")
    ? fetcher.formData?.get("bookmarked") === "true"
    : todoBookmarked;

  return (
    <fetcher.Form method="post">
      <Button
        type="submit"
        name="intent"
        value="bookmark"
        variant="transparent"
        size="xs"
        p={0}
      >
        {bookmarked ? <BookmarkedIcon /> : <UnBookmarkedIcon />}
      </Button>
      <input hidden name="todoId" defaultValue={todoId} />
      <input hidden name="bookmarked" value={String(todoBookmarked)} readOnly />
    </fetcher.Form>
  );
}
