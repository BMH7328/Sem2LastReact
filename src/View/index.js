import {
  Title,
  Text,
  Space,
  Card,
  Container,
  Button,
  Group,
  Image,
  Divider,
  MantineProvider,
} from "@mantine/core";
import Footer from "../Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCharacter, deleteCharacter } from "../api/characters";
import { useCookies } from "react-cookie";
import { addToCart } from "../api/cart";

function CharactersView() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [character, setCharacter] = useState({});
  const [name, setName] = useState("");
  const [quality, setQuality] = useState("");
  const [element, setElement] = useState("");
  const [weapontype, setWeapontype] = useState("");
  const [region, setRegion] = useState("");
  const [birthday, setBirthday] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [image, setImage] = useState("");
  const [detail, setDetail] = useState("");
  const [constellation, setConstellation] = useState("");
  const [uploading, setUploading] = useState(false);
  const { isLoading } = useQuery({
    queryKey: ["character", id],
    queryFn: () => getCharacter(id),
    onSuccess: (data) => {
      setCharacter(data);
      setName(data.name);
      setQuality(data.quality);
      setElement(data.element);
      setWeapontype(data.weapontype);
      setRegion(data.region);
      setBirthday(data.birthday);
      setReleaseDate(data.release_date);
      setImage(data.image);
      setDetail(data.detail);
      setConstellation(data.constellation);
    },
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const deleteMutation = useMutation({
    mutationFn: deleteCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["characters"],
      });
      notifications.show({
        title: "Character Deleted",
        color: "green",
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Product Added to Cart",
        color: "green",
      });
    },
  });

  return (
    <>
      <Space h="20px" />
      <Container size="800px">
        <Card withBorder shadow="lg" mx={"auto"}>
          <MantineProvider
            theme={{
              fontFamily: "Raleway, sans-serif",
            }}
          >
            <Title align="center" size={"70px"} weight={200}>
              {name}
            </Title>
          </MantineProvider>
          <br />
          <Divider />
          <br />
          <MantineProvider theme={{ fontFamily: "Teko, sans-serif" }}>
            <Text align="center" size={"40px"}>
              Release On: {releaseDate}
            </Text>
            <br />
            <Text align="center" size={"40px"}>
              Birthday: {birthday}
            </Text>
            <br />
            <Text align="center" size={"40px"}>
              Quality: {quality}
            </Text>
          </MantineProvider>
          <br />
          <Image
            src={"http://localhost:5000/" + image}
            width="500px"
            mx={"auto"}
          />
          <br />
          <br />
          <MantineProvider theme={{ fontFamily: "Teko, sans-serif" }}>
            <Text align="center" size={"40px"}>
              Constellation: {constellation}
            </Text>
            <br />
            <br />
            <Text align="center" size={"30px"}>
              Details: {detail}
            </Text>
            <br />
            <br />
            <Group position="apart">
              <Text align="center" size={"40px"}>
                Element: {element.name}
              </Text>
              <Text align="center" size={"40px"}>
                Region: {region.name}
              </Text>
              <Text align="center" size={"40px"}>
                Weapon Type: {weapontype.name}
              </Text>
            </Group>
            <Space h="20px" />
          </MantineProvider>

          <Group position="center">
            <Button
              mx={"auto"}
              size="md"
              onClick={() => {
                // pop a messsage if user is not logged in
                if (cookies && cookies.currentUser) {
                  addToCartMutation.mutate(character);
                } else {
                  notifications.show({
                    title: "Please login to proceed",
                    message: (
                      <>
                        <Button
                          color="red"
                          onClick={() => {
                            navigate("/login");
                            notifications.clean();
                          }}
                        >
                          Click here to login
                        </Button>
                      </>
                    ),
                    color: "red",
                  });
                }
              }}
            >
              {" "}
              Add To Cart
            </Button>
          </Group>
          {isAdmin && (
            <>
              <Space h="20px" />
              <Group position="apart">
                <MantineProvider
                  theme={{
                    fontFamily: "Rajdhani, sans-serif",
                  }}
                >
                  <Button
                    component={Link}
                    to={"/characters/" + id}
                    size="sm"
                    sx={{
                      color: "white",
                      border: "1px solid black",
                      background: "8" ? "black" : "none",
                      "&:hover": { backgroundColor: "#808080" },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: "#FFFFFF",
                      color: "black",
                      border: "2px solid red",
                      "&:hover": { backgroundColor: "#FF0000" },
                    }}
                    size="md"
                    onClick={() => {
                      deleteMutation.mutate({
                        id: id,
                        token: currentUser ? currentUser.token : "",
                      });
                    }}
                  >
                    Delete
                  </Button>
                </MantineProvider>
              </Group>
            </>
          )}
        </Card>
      </Container>
      <Space h="50px" />
      <Group position="center">
        <Button
          component={Link}
          to="/"
          variant="gradient"
          size="xs"
          gradient={{ from: "blue", to: "purple", deg: 105 }}
        >
          Go back to Home
        </Button>
      </Group>
      <Space h="50px" />
      <Footer />
    </>
  );
}

export default CharactersView;
