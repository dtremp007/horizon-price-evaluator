import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import AdminDashboard from "../src/layouts/AdminDashboard";
import useUser from "../lib/auth/useUser";
import { Router, useRouter } from "next/router";
import { FilterProvider } from "../src/listings/filter-context/FilterContext";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const { user } = useUser();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Page title</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "dark",
          components: {
            Flex: {
              defaultProps: {
                gap: 18,
              },
            },
          },
        }}
      >
        {user?.isLoggedIn && router.pathname.startsWith("/dashboard") ? (
          <FilterProvider>
            <AdminDashboard>
              <Component {...pageProps} />
            </AdminDashboard>
          </FilterProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </MantineProvider>
    </>
  );
}
