import { createStyles } from "@mantine/core";

export default createStyles((theme) => ({
  root: {
    ...theme.fn.focusStyles(),
    borderRadius: theme.radius.lg,
    border: `.75px solid ${theme.colors.gray[5]}`,
    backgroundColor: theme.colors.gray[0],
    padding: "5px 10px",
    color: theme.colors.dark[9],
    fontWeight: 700,
    boxShadow: theme.shadows.sm,

    "&:hover": {
      transform: "scale(1.1)",
      cursor: "pointer",
    },
    "&[data-active]": {
      transform: "scale(1.1)",
      backgroundColor: theme.colors.dark[9],
      color: theme.white,
    },
  },
}));
