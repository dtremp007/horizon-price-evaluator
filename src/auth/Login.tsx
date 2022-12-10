import {
  ActionIcon,
  Button,
  Card,
  Center,
  Flex,
  PasswordInput,
  Popover,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconHelp } from "@tabler/icons";
import { useState } from "react";
import fetchJson, { FetchError } from "../../lib/auth/fetchJson";
import { sessionOptions } from "../../lib/auth/session";
import useUser from "../../lib/auth/useUser";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const { mutateUser } = useUser({
    redirectTo: "/dashboard",
    redirectIfFound: true,
  });

  const form = useForm({
    initialValues: { email: "", inviteCode: "" },
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
                form.setFieldError("inviteCode", error.data.message);
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
            <TextInput
              label={
                <Flex justify="space-between" align="center" >
                  <Text>Invite Code</Text>
                  <Popover width={200} position="top" withArrow shadow="md" opened={opened}>
                    <Popover.Target>
                      <ActionIcon onMouseEnter={open} onMouseLeave={close}>
                        <IconHelp size={16}/>
                      </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Text>Ask the website owner for an invite code.</Text>
                    </Popover.Dropdown>
                  </Popover>
                </Flex>
              }
              {...form.getInputProps("inviteCode")}
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
