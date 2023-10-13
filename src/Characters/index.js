import {
  Text,
  Title,
  Grid,
  Card,
  Badge,
  Group,
  Space,
  Button,
  Image,
  Input,
  Container,
  MantineProvider,
} from "@mantine/core";
import Header from "../Header";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchCharacters, deleteCharacter } from "../api/characters";
import { addToCart, clearCartItems } from "../api/cart";
import { useCookies } from "react-cookie";
import { fetchWeapontypes } from "../api/weapontypes";
import { fetchElements } from "../api/elements";
import { fetchRegions } from "../api/regions";
import { AiOutlineSearch } from "react-icons/ai";
import { TbShoppingCartHeart } from "react-icons/tb";
import { RiEditBoxLine } from "react-icons/ri";

function Characters() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentCharacters, setCurrentCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [element, setElement] = useState("");
  const [weapontype, setWeapontype] = useState("");
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState("");
  const [perPage, setPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const {
    isLoading,
    isError,
    data: characters,
    error,
  } = useQuery({
    queryKey: ["characters", region, weapontype, element],
    queryFn: () =>
      fetchCharacters(
        region,
        weapontype,
        element,
        currentUser ? currentUser.token : ""
      ),
  });
  const { data: elements } = useQuery({
    queryKey: ["elements"],
    queryFn: () => fetchElements(),
  });
  const { data: regions } = useQuery({
    queryKey: ["regions"],
    queryFn: () => fetchRegions(),
  });
  const { data: weapontypes } = useQuery({
    queryKey: ["weapontypes"],
    queryFn: () => fetchWeapontypes(),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  useEffect(() => {
    let newList = characters ? [...characters] : [];

    if (searchTerm !== "") {
      newList = newList.filter((g) =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const total = Math.ceil(newList.length / perPage);

    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    setTotalPages(pages);

    switch (sort) {
      case "name":
        newList = newList.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        break;
      case "quality":
        newList = newList.sort((a, b) => {
          return a.quality - b.quality;
        });
        break;
      default:
        break;
    }

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    newList = newList.slice(start, end);

    setCurrentCharacters(newList);
  }, [characters, searchTerm, sort, perPage, currentPage]);

  const elementOptions = useMemo(() => {
    let options = [];
    if (elements && elements.length > 0) {
      elements.forEach((element) => {
        if (!options.includes(element)) {
          options.push(element);
        }
      });
    }
    return options;
  }, [elements]);

  const regionOptions = useMemo(() => {
    let options = [];
    if (regions && regions.length > 0) {
      regions.forEach((region) => {
        if (!options.includes(region)) {
          options.push(region);
        }
      });
    }
    return options;
  }, [regions]);

  const weapontypeOptions = useMemo(() => {
    let options = [];
    if (weapontypes && weapontypes.length > 0) {
      weapontypes.forEach((weapontype) => {
        if (!options.includes(weapontype)) {
          options.push(weapontype);
        }
      });
    }
    return options;
  }, [weapontypes]);

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
      clearCartItems();
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Character Added to Cart",
        color: "green",
      });
    },
  });

  return (
    <>
      <Header title="Characters" page="characters" />
      <MantineProvider
        theme={{
          fontFamily: "Rajdhani, sans-serif",
        }}
      >
        <Container size="90%">
          <Space h="20px" />
          <Group position="right">
            {isAdmin && (
              <Button
                component={Link}
                to="/characters_add"
                size="md"
                sx={{
                  color: "white",
                  border: "1px solid black",
                  background: "1" ? "black" : "none",
                  "&:hover": { backgroundColor: "#808080" },
                }}
              >
                Add New
              </Button>
            )}
          </Group>
          <Space h="20px" />
          <Group position="apart">
            <Group position="left">
              <div
                sx={{
                  borderRadius: "auto",
                }}
              >
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  radius="xl"
                  rightSection={<AiOutlineSearch />}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </Group>
            <Group position="right">
              <select
                value={element}
                onChange={(event) => {
                  setElement(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Elements</option>
                {elementOptions.map((element) => {
                  return (
                    <option key={element} value={element._id}>
                      {element.name}
                    </option>
                  );
                })}
              </select>

              <select
                value={weapontype}
                onChange={(event) => {
                  setWeapontype(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Weapon Types</option>
                {weapontypeOptions.map((weapontype) => {
                  return (
                    <option key={weapontype} value={weapontype._id}>
                      {weapontype.name}
                    </option>
                  );
                })}
              </select>

              <select
                value={region}
                onChange={(event) => {
                  setRegion(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Regions</option>
                {regionOptions.map((region) => {
                  return (
                    <option key={region} value={region._id}>
                      {region.name}
                    </option>
                  );
                })}
              </select>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">No Sorting</option>
                <option value="name">Sort by Name</option>
                <option value="quality">Sort by Quality</option>
              </select>
              <select
                value={perPage}
                onChange={(event) => {
                  setPerPage(parseInt(event.target.value));
                  // reset it back to page 1
                  setCurrentPage(1);
                }}
              >
                <option value="6">6 Per Page</option>
                <option value="10">10 Per Page</option>
                <option value={9999999}>All</option>
              </select>
            </Group>
          </Group>
          <Space h="20px" />
          <Grid gutter={"50px"}>
            {currentCharacters
              ? currentCharacters.map((character) => {
                  return (
                    <Grid.Col key={character._id} lg={4} md={6} sm={6} xs={12}>
                      <Card withBorder shadow="sm" p="20px" mx={"auto"}>
                        <Image
                          src={"http://localhost:5000/" + character.image}
                          width="300px"
                          alt={character.name}
                          mx={"auto"}
                        />
                        <Space h="20px" />
                        <MantineProvider
                          theme={{
                            fontFamily: "Raleway, sans-serif",
                          }}
                        >
                          <Title order={3}>{character.name}</Title>
                          <Space h="20px" />
                          <Group position="apart" spacing="5px">
                            <Badge color="yellow">
                              <Text color="dark">{character.quality}</Text>
                            </Badge>
                            <Badge color="red">
                              <Text color="dark">
                                {character.weapontype.name}
                              </Text>
                            </Badge>
                          </Group>
                        </MantineProvider>
                        <Space h="20px" />
                        <Group position="center">
                          <Group position="left">
                            <Button
                              size="md"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                color: "#EE82EE",
                                border: "2px solid #6F00FF",
                                "&:hover": { backgroundColor: "#6F00FF" },
                              }}
                              onClick={() => {
                                // pop a messsage if user is not logged in
                                if (cookies && cookies.currentUser) {
                                  addToCartMutation.mutate(character);
                                } else {
                                  notifications.show({
                                    title: "Please Login To Add",
                                    message: (
                                      <>
                                        <Button
                                          sx={{
                                            backgroundColor: "#FFFFFF",
                                            color: "black",
                                            border: "2px solid #6f00ff",
                                            "&:hover": {
                                              backgroundColor: "#6f00ff",
                                            },
                                          }}
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
                              <TbShoppingCartHeart />
                            </Button>
                          </Group>
                          <Group position="right">
                            <Button
                              size="md"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                color: "black",
                                border: "2px solid #55CEFF",
                                "&:hover": { backgroundColor: "#55CEFF" },
                              }}
                              onClick={() => {
                                // pop a messsage if user is not logged in
                                if (cookies && cookies.currentUser) {
                                  navigate("/views/" + character._id);
                                } else {
                                  notifications.show({
                                    title: "Please Login To View More",
                                    message: (
                                      <>
                                        <Button
                                          sx={{
                                            backgroundColor: "#FFFFFF",
                                            color: "black",
                                            border: "2px solid red",
                                            "&:hover": {
                                              backgroundColor: "#FF0000",
                                            },
                                          }}
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
                              View More Info...
                            </Button>
                          </Group>
                        </Group>
                        {isAdmin && (
                          <>
                            <Space h="20px" />
                            <Group position="apart">
                              <Button
                                component={Link}
                                to={"/characters/" + character._id}
                                size="sm"
                                sx={{
                                  color: "white",
                                  border: "1px solid black",
                                  background: "6" ? "black" : "none",
                                  "&:hover": { backgroundColor: "#808080" },
                                }}
                              >
                                <RiEditBoxLine />
                                Edit
                              </Button>
                              <Button
                                sx={{
                                  backgroundColor: "#FFFFFF",
                                  color: "black",
                                  border: "2px solid red",
                                  "&:hover": { backgroundColor: "#FF0000" },
                                }}
                                size="sm"
                                onClick={() => {
                                  deleteMutation.mutate({
                                    id: character._id,
                                    token: currentUser ? currentUser.token : "",
                                  });
                                }}
                              >
                                Delete
                              </Button>
                            </Group>
                          </>
                        )}
                      </Card>
                    </Grid.Col>
                  );
                })
              : null}
          </Grid>
          <Space h="40px" />
          <div>
            <span
              style={{
                marginRight: "10px",
              }}
            >
              Page {currentPage} of {totalPages.length}
            </span>
            {totalPages.map((page) => {
              return (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </button>
              );
            })}
          </div>
          <Space h="40px" />
        </Container>
      </MantineProvider>
      <Footer />
    </>
  );
}

export default Characters;
