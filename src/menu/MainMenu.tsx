import React from "react";
import {
  IconHome,
  IconFilter,
  IconSettings,
  IconNotebook,
  IconPictureInPicture
} from "@tabler/icons";
import { ThemeIcon, UnstyledButton,Flex, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  href: string;
}

function AdminLink({ icon, color, label, href }: MainLinkProps) {
    const router = useRouter();

  return (
    <Link href={href}>
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colors.dark[0],
          backgroundColor: router.pathname === href ? theme.colors.dark[8] : "",

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Flex>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Flex>
      </UnstyledButton>
    </Link>
  );
}

const data = [
  {
    icon: <IconHome size={16} />,
    color: "red",
    label: "Main",
    href: "/dashboard",
  },
  {
    icon: <IconSettings size={16} />,
    color: "green",
    label: "Settings",
    href: "/dashboard/settings",
  },
];

const MainMenu = () => {
  const links = data.map((link) => <AdminLink {...link} key={link.label} />);
  return <div>{links}</div>;
};
export default MainMenu;
