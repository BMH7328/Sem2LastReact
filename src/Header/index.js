import {
  Group,
  Space,
  Title,
  Divider,
  Button,
  Text,
  Avatar,
  MantineProvider,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { BackgroundImage } from "@mantine/core";

export default function Header({ title, page = "" }) {
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);

  return (
    <>
      <BackgroundImage src="/image/backgroundproject.webp">
        <Space h="50px" />
        <MantineProvider
          theme={{
            fontFamily: "Raleway, sans-serif",
          }}
        >
          <Title align="center" color="gold" fs="italic" weight={100}>
            {title}
          </Title>
        </MantineProvider>
        <Space h="50px" />
        <Group position="apart">
          <Group pl={"50px"}>
            <Button
              component={Link}
              to="/"
              variant={page === "home"}
              sx={{
                color: "gold",
                border: "1px solid gold",
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/characters"
              variant={page === "characters"}
              sx={{
                color: "gold",
                border: "1px solid gold",
              }}
            >
              Characters
            </Button>
            <Button
              component={Link}
              to="/weapons"
              variant={page === "weapons"}
              sx={{
                color: "gold",
                border: "1px solid gold",
              }}
            >
              Weapons
            </Button>
            <Button
              component={Link}
              to="/favoritecart"
              variant={page === "favoritecart"}
              sx={{
                color: "gold",
                border: "1px solid gold",
              }}
            >
              Favorite Cart
            </Button>
            <Button
              component={Link}
              to="/favorites"
              variant={page === "favorites"}
              sx={{
                color: "gold",
                border: "1px solid gold",
              }}
            >
              My Favorites
            </Button>
            <Button
              component={Link}
              to="/elements"
              variant={page === "elements"}
              sx={{
                color: "gold",
                border: "1px solid gold",
              }}
            >
              Elements
            </Button>
            <Button
              component={Link}
              to="/regions"
              variant={page === "regions"}
              sx={{
                color: "gold",
                border: "1px solid gold",
              }}
            >
              Regions
            </Button>
            <Button
              component={Link}
              to="/weapontypes"
              variant={page === "weapontypes"}
              sx={{
                color: "gold",
                border: "1px solid gold",
              }}
            >
              Weapon Types
            </Button>
          </Group>
          <Group position="right" pr={"50px"}>
            {cookies && cookies.currentUser ? (
              <>
                <Group>
                  <Avatar src="" radius="xl" />
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500} c="gold">
                      {cookies.currentUser.name}
                    </Text>

                    <Text c="gold" size="xs">
                      {cookies.currentUser.email}
                    </Text>
                  </div>
                </Group>
                <Button
                  sx={{
                    color: "gold",
                    border: "1px solid gold",
                    background: "none",
                  }}
                  onClick={() => {
                    // clear the currentUser cookie to logout
                    removeCookies("currentUser");
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant={page === "login"}
                  sx={{
                    color: "gold",
                    border: "1px solid gold",
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant={page === "signup"}
                  sx={{
                    color: "gold",
                    border: "1px solid gold",
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Group>
        </Group>
        <Space h="50px" />
      </BackgroundImage>
    </>
  );
}
