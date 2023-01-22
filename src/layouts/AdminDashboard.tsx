import { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Button,
  Select,
  Flex,
  ActionIcon,
  TextInput,
  Kbd,
} from "@mantine/core";
import useUser from "../../lib/auth/useUser";
import MainMenu from "../menu/MainMenu";
import useFilterContext from "../listings/filters/FilterContext";
import {
  IconAdjustments,
  IconAdjustmentsHorizontal,
  IconMenu2,
  IconSearch,
} from "@tabler/icons";
import ListingFilters from "../listings/filters/ListingFilters";
import { useRouter } from "next/router";
import { openSpotlight } from "@mantine/spotlight";
import { SearchControl } from "../search/SearchControl/SearchControl";

type AdminDashboardProps = {
  children: React.ReactNode;
};

export default function AdminDashboard({ children }: AdminDashboardProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <MainMenu />
        </Navbar>
      }
      aside={
        <>
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
              {router.pathname === "/dashboard" ? <ListingFilters /> : null}
            </Aside>
          </MediaQuery>
        </>
      }
      header={
        <Header height={{ base: 50 }} pl="md" pr="md">
          <Flex align="center" h="100%">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <ActionIcon ml="auto" onClick={() => openSpotlight()}>
                    <IconSearch />
                </ActionIcon>
            </MediaQuery>
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <SearchControl
                ml="auto"
                onClick={() => openSpotlight()}
                mr="sm"
              />
            </MediaQuery>
          </Flex>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
