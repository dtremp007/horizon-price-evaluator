import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import AdminDashboard from "../components/layouts/AdminDashboard";
import useUser from "../lib/auth/useUser";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const { user } = useUser();

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
                    gap: 18
                }
            }
        },
        }}
      >
        {user ? (
          <AdminDashboard>
            <Component {...pageProps} />
          </AdminDashboard>
        ) : (
          <Component {...pageProps} />
        )}
      </MantineProvider>
    </>
  );
}
