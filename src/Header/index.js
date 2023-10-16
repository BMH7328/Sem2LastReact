import {
  Group,
  Space,
  Title,
  Button,
  Text,
  Avatar,
  MantineProvider,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { BackgroundImage } from "@mantine/core";
import { clearCartItems } from "../api/cart";
import { AiOutlineUserAdd, AiOutlineLogin } from "react-icons/ai";

export default function Header({ title, page = "" }) {
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const navigate = useNavigate();

  return (
    <>
      <BackgroundImage src="/image/backgroundproject.webp">
        <Space h="50px" />
        <MantineProvider
          theme={{
            fontFamily: "Raleway, sans-serif",
          }}
        >
          <Title
            align="center"
            color="gold"
            fs="italic"
            weight={200}
            size="60px"
          >
            {title}
          </Title>
        </MantineProvider>
        <Space h="50px" />
        <Group position="apart">
          <Group pl={"50px"}>
            <MantineProvider
              theme={{
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              <Button
                component={Link}
                to="/"
                sx={{
                  color: "gold",
                  border: "1px solid gold",
                  background: page === "home" ? "white" : "none",
                  "&:hover": { backgroundColor: "#FFFFFF" },
                }}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/characters"
                sx={{
                  color: "gold",
                  border: "1px solid gold",
                  background: page === "characters" ? "white" : "none",
                  "&:hover": { backgroundColor: "#FFFFFF" },
                }}
              >
                Characters
              </Button>
              <Button
                component={Link}
                to="/weapons"
                sx={{
                  color: "gold",
                  border: "1px solid gold",
                  background: page === "weapons" ? "white" : "none",
                  "&:hover": { backgroundColor: "#FFFFFF" },
                }}
              >
                Weapons
              </Button>
              <Button
                component={Link}
                to="/favoritecart"
                sx={{
                  color: "gold",
                  border: "1px solid gold",
                  background: page === "favoritecart" ? "white" : "none",
                  "&:hover": { backgroundColor: "#FFFFFF" },
                }}
              >
                Favorite Cart
              </Button>
              <Button
                component={Link}
                to="/favorites"
                sx={{
                  color: "gold",
                  border: "1px solid gold",
                  background: page === "favorites" ? "white" : "none",
                  "&:hover": { backgroundColor: "#FFFFFF" },
                }}
              >
                My Favorites
              </Button>
              <Button
                component={Link}
                to="/elements"
                sx={{
                  color: "gold",
                  border: "1px solid gold",
                  background: page === "elements" ? "white" : "none",
                  "&:hover": { backgroundColor: "#FFFFFF" },
                }}
              >
                Elements
              </Button>
              <Button
                component={Link}
                to="/regions"
                sx={{
                  color: "gold",
                  border: "1px solid gold",
                  background: page === "regions" ? "white" : "none",
                  "&:hover": { backgroundColor: "#FFFFFF" },
                }}
              >
                Regions
              </Button>
              <Button
                component={Link}
                to="/weapontypes"
                sx={{
                  color: "gold",
                  border: "1px solid gold",
                  background: page === "weapontypes" ? "white" : "none",
                  "&:hover": { backgroundColor: "#FFFFFF" },
                }}
              >
                Weapon Types
              </Button>
            </MantineProvider>
          </Group>
          <MantineProvider
            theme={{
              fontFamily: "Rajdhani, sans-serif",
            }}
          >
            <Group position="right" pr={"50px"}>
              {cookies && cookies.currentUser ? (
                <>
                  <Group>
                    <Avatar src="" radius="xl" />
                    <div style={{ flex: 1 }}>
                      <Text size="md" fw={500} c="gold">
                        {cookies.currentUser.name}
                      </Text>

                      <Text c="gold" size="sm">
                        {cookies.currentUser.email}
                      </Text>
                    </div>
                  </Group>
                  <MantineProvider
                    theme={{
                      fontFamily: "Space Grotesk, sans-serif",
                    }}
                  >
                    <Button
                      sx={{
                        color: "gold",
                        border: "1px solid gold",
                        background: "none",
                        "&:hover": { backgroundColor: "#FFFFFF" },
                      }}
                      onClick={() => {
                        // clear the currentUser cookie to logout
                        removeCookies("currentUser");
                        clearCartItems();
                        window.location = "/";
                      }}
                    >
                      Logout
                    </Button>
                  </MantineProvider>
                </>
              ) : (
                <>
                  <MantineProvider
                    theme={{
                      fontFamily: "Space Grotesk, sans-serif",
                    }}
                  >
                    <Button
                      component={Link}
                      to="/login"
                      sx={{
                        color: "gold",
                        border: "1px solid gold",
                        background: page === "login" ? "white" : "none",
                        "&:hover": { backgroundColor: "#FFFFFF" },
                      }}
                    >
                      <AiOutlineLogin />
                    </Button>
                    <Button
                      component={Link}
                      to="/signup"
                      sx={{
                        color: "gold",
                        border: "1px solid gold",
                        background: page === "signup" ? "white" : "none",
                        "&:hover": { backgroundColor: "#FFFFFF" },
                      }}
                    >
                      <AiOutlineUserAdd />
                    </Button>
                  </MantineProvider>
                </>
              )}
            </Group>
          </MantineProvider>
        </Group>
        <Space h="50px" />
      </BackgroundImage>
    </>
  );
}
