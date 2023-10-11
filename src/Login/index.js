import {
  Container,
  Space,
  TextInput,
  Card,
  Button,
  Group,
  PasswordInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "../Header";
import { useState } from "react";
import { loginUser } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Login() {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [visible, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      //store user data into cookies
      setCookie("currentUser", user, {
        maxAge: 60 * 60 * 24 * 30, // expire in 30 days
      });
      //redirect to home
      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleSubmit = () => {
    // make sure email & password are not empty.
    if (!email || !password) {
      notifications.show({
        title: "Please fill in both email and password.",
        color: "red",
      });
    } else {
      loginMutation.mutate(
        JSON.stringify({
          email: email,
          password: password,
        })
      );
    }
  };
  return (
    <>
      <Header title="Login To Your Account" page="login" />
      <Container size="90%">
        <Space h="50px" />
        <Card
          withBorder
          shadow="lg"
          p="20px"
          mx="auto"
          sx={{
            maxWidth: "500px",
          }}
        >
          <TextInput
            value={email}
            placeholder="Email"
            label="Email"
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <Space h="20px" />
          <PasswordInput
            value={password}
            placeholder="Password"
            label="Password"
            visible={visible}
            onVisibilityChange={toggle}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          <Space h="20px" />
          <Group position="center">
            <Button onClick={handleSubmit}>Submit</Button>
          </Group>
        </Card>
        <Space h="20px" />
        <Group position="center">
          <Button
            component={Link}
            to="/"
            variant="subtle"
            size="xs"
            color="gray"
          >
            Go back to Home
          </Button>
        </Group>
      </Container>
    </>
  );
}
