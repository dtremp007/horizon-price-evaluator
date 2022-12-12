import { SpotlightProvider } from "@mantine/spotlight";
import Router from "next/router";
import { Listing } from "../../lib/types/listings";

type _SpotlightProviderProps = {
  children: React.ReactNode;
};

export default function _SpotlightProvider({
  children,
}: _SpotlightProviderProps) {
  return (
    <SpotlightProvider
      actions={[
        {
          title: "Settings",
          description: "Change your settings",
          onTrigger: () => Router.push("/dashboard/settings"),
        },
      ]}
      shortcut={["mod + K", "mod + P", "/"]}
      highlightQuery
    >
      {children}
    </SpotlightProvider>
  );
}
