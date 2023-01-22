import { createStyles, MantineTheme } from "@mantine/core";

export const CLUSTER_VARIANTS = ["light", "dark"] as const;

export type ClusterVariant = typeof CLUSTER_VARIANTS[number];

function getVariantStyles({
  theme,
  variant,
}: {
  theme: MantineTheme;
  variant: ClusterVariant;
}) {
  switch (variant) {
    case "light":
      return {
        backgroundColor: theme.colors.gray[0],
        color: theme.colors.dark[9],
      };
    case "dark":
      return {
        backgroundColor: theme.colors.dark[9],
        color: theme.white,
      };
  }
}

export interface ClusterMarkerStyles {
  /** Diameter of the marker in pixels */
  diameter: number;
  /** Cluster variant */
  variant: ClusterVariant;
}

export default createStyles(
  (theme, { diameter, variant }: ClusterMarkerStyles) => ({
    root: {
      ...getVariantStyles({ theme, variant }),
      width: `${diameter}px`,
      height: `${diameter}px`,
      fontWeight: 800,
      padding: theme.spacing.xs,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      "&:hover": {
        cursor: "pointer",
        transform: "scale(1.1)",
      },
    },
  })
);
