import { Badge } from "@mantine/core";

const statusOptions = {
  incomplete: { color: "red", label: "未了" },
  inprogress: { color: "yellow", label: "着手" },
  complete: { color: "green", label: "完了" },
};

interface TodosProgressBadgeProps {
  progress: keyof typeof statusOptions;
}

export function TodosProgressBadge({ progress }: TodosProgressBadgeProps) {
  const { color, label } = statusOptions[progress];

  return (
    <Badge variant="dot" color={color}>
      {label}
    </Badge>
  );
}
