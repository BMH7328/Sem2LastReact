import {
  Container,
  Space,
  TextInput,
  Card,
  Button,
  Group,
  PasswordInput,
  MantineProvider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "../Header";
import Footer from "../Footer";
import { useState } from "react";
import { loginUser } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
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
      window.location.reload();
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
      <MantineProvider
        theme={{
          fontFamily: "Rajdhani, sans-serif",
        }}
      >
        <Container size="90%">
          <Space h="100px" />
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
              <Button
                size="md"
                sx={{
                  color: "white",
                  border: "1px solid black",
                  background: "addele" ? "black" : "none",
                  "&:hover": { backgroundColor: "#808080" },
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Group>
          </Card>
          <Space h="100px" />
        </Container>
      </MantineProvider>
      <Footer />
    </>
  );
}
