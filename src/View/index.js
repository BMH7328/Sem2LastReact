import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  Button,
  Group,
  Image,
  Grid,
  Textarea,
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
      <Grid>
        <Grid.Col>
          <Card withBorder shadow="lg" px="400px" py="100px">
            Release On: {releaseDate}
            <br />
            Name: {name}
            <br />
            Birthday: {birthday}
            <br />
            Quality: {quality}
            <Image
              src={"http://localhost:5000/" + image}
              width="500px"
              mx={"auto"}
            />
            <br />
            Details: {detail}
            <br />
            <br />
            Element: {element.name}
            <br />
            Region: {region.name}
            <br />
            Weapon Type: {weapontype.name}
            <Group position="center">
              <Button
                mx={"auto"}
                size="lg"
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
                  <Button
                    component={Link}
                    to={"/characters/" + id}
                    color="blue"
                    size="xs"
                    radius="50px"
                  >
                    Edit
                  </Button>
                  <Button
                    color="red"
                    size="xs"
                    radius="50px"
                    onClick={() => {
                      deleteMutation.mutate({
                        id: id,
                        token: currentUser ? currentUser.token : "",
                      });
                    }}
                  >
                    Delete
                  </Button>
                </Group>
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
              </>
            )}
          </Card>
        </Grid.Col>
      </Grid>
      <Footer />
    </>
  );
}

export default CharactersView;
