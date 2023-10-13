import {
  Container,
  Space,
  TextInput,
  Card,
  Button,
  Group,
  Grid,
  PasswordInput,
  MantineProvider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { useState } from "react";
import { registerUser } from "../api/auth";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [visible, { toggle }] = useDisclosure(false);
  const [cookies, setCookie] = useCookies(["currentUser"]);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (user) => {
      //store user data into cookies
      setCookie("currentUser", user, {
        maxAge: 60 * 60 * 24 * 30, // expire in 30 days
      });
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
    if (!name || !email || !password || !confirmPassword) {
      notifications.show({
        title: "Please fill in all fields.",
        color: "red",
      });
    } else if (password !== confirmPassword) {
      notifications.show({
        title: "Password and Confirm Password does not match",
        color: "red",
      });
    } else {
      registerMutation.mutate(
        JSON.stringify({
          name: name,
          email: email,
          password: password,
        })
      );
    }
  };
  return (
    <>
      <Header title="Sign Up A New Account" page="signup" />
      <MantineProvider
        theme={{
          fontFamily: "Rajdhani, sans-serif",
        }}
      >
        <Container size="100%">
          <Space h="100px" />
          <Card
            withBorder
            shadow="lg"
            p="20px"
            mx="auto"
            sx={{
              maxWidth: "700px",
            }}
          >
            <Grid gutter={20}>
              <Grid.Col span={6}>
                <TextInput
                  value={name}
                  placeholder="Name"
                  label="Name"
                  required
                  onChange={(event) => setName(event.target.value)}
                />
                <Space h="20px" />
                <TextInput
                  value={email}
                  placeholder="Email"
                  label="Email"
                  required
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
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
                <PasswordInput
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  label="Confirm Password"
                  visible={visible}
                  onVisibilityChange={toggle}
                  required
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </Grid.Col>
            </Grid>
            <Space h="40px" />
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
