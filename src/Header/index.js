import {
  Group,
  Space,
  Title,
  Divider,
  Button,
  Text,
  Avatar,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Header({ title, page = "" }) {
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);

  return (
    <>
      <Space h="50px" />
      <Title align="center">{title}</Title>
      <Space h="50px" />
      <Group position="apart">
        <Group>
          <Button
            component={Link}
            to="/"
            variant={(page === "home", "gradient")}
            gradient={{ from: "yellow", to: "purple", deg: 105 }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/characters"
            variant={(page === "characters", "gradient")}
            gradient={{ from: "yellow", to: "purple", deg: 105 }}
          >
            Characters
          </Button>
          <Button
            component={Link}
            to="/weapons"
            variant={(page === "weapons", "gradient")}
            gradient={{ from: "yellow", to: "purple", deg: 105 }}
          >
            Weapons
          </Button>
          <Button
            component={Link}
            to="/favoritecart"
            variant={(page === "favoritecart", "gradient")}
            gradient={{ from: "yellow", to: "purple", deg: 105 }}
          >
            Favorite Cart
          </Button>
          <Button
            component={Link}
            to="/favorites"
            variant={(page === "favorites", "gradient")}
            gradient={{ from: "yellow", to: "purple", deg: 105 }}
          >
            My Favorites
          </Button>
          <Button
            component={Link}
            to="/elements"
            variant={(page === "elements", "gradient")}
            gradient={{ from: "yellow", to: "purple", deg: 105 }}
          >
            Elements
          </Button>
          <Button
            component={Link}
            to="/regions"
            variant={(page === "regions", "gradient")}
            gradient={{ from: "yellow", to: "purple", deg: 105 }}
          >
            Regions
          </Button>
          <Button
            component={Link}
            to="/weapontypes"
            variant={(page === "weapontypes", "gradient")}
            gradient={{ from: "yellow", to: "purple", deg: 105 }}
          >
            Weapon Types
          </Button>
        </Group>
        <Group position="right">
          {cookies && cookies.currentUser ? (
            <>
              <Group>
                <Avatar src="" radius="xl" />
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {cookies.currentUser.name}
                  </Text>

                  <Text c="dimmed" size="xs">
                    {cookies.currentUser.email}
                  </Text>
                </div>
              </Group>
              <Button
                variant={"light"}
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
                variant={(page === "login", "gradient")}
                gradient={{ from: "yellow", to: "purple", deg: 105 }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant={(page === "signup", "gradient")}
                gradient={{ from: "yellow", to: "purple", deg: 105 }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Group>
      </Group>
      <Space h="20px" />
      <Divider />
    </>
  );
}
