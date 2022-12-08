import {
  Button,
  Card,
  Center,
  Flex,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import fetchJson, { FetchError } from "../../lib/auth/fetchJson";
import { sessionOptions } from "../../lib/auth/session";
import useUser from "../../lib/auth/useUser";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { mutateUser } = useUser({
    redirectTo: "/dashboard",
    redirectIfFound: true,
  });

  const form = useForm({
    initialValues: { email: "", password: "" },
  });

  return (
    <Center h="75vh">
      <Card>
        <form
          onSubmit={form.onSubmit(async function (values) {
            setLoading(true);
            try {
              mutateUser(
                await fetchJson("/api/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                })
              );
            } catch (error) {
              if (error instanceof FetchError) {
                form.setFieldError("email", error.data.message);
              } else {
                console.error("An unexpected error happened:", error);
              }
            } finally {
              setLoading(false);
            }
          })}
        >
          <Flex direction="column" gap="md">
            <TextInput label="Email" {...form.getInputProps("email")} />
            <PasswordInput
              label="Password"
              {...form.getInputProps("password")}
            />
            <Button type="submit" loading={loading}>
              Login
            </Button>
          </Flex>
        </form>
      </Card>
    </Center>
  );
}
