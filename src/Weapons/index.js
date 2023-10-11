import {
  Title,
  Grid,
  Card,
  Badge,
  Group,
  Space,
  Button,
  Image,
  Input,
  Text,
  Container,
} from "@mantine/core";
import Header from "../Header";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { addToCart } from "../api/cart";
import { useCookies } from "react-cookie";
import { fetchWeapons, deleteWeapon } from "../api/weapons";
import { fetchWeapontypes } from "../api/weapontypes";
import { AiOutlineSearch } from "react-icons/ai";

function Weapons() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentWeapons, setCurrentWeapons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [weapontype, setWeapontype] = useState("");
  const [sort, setSort] = useState("");
  const [perPage, setPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const {
    isLoading,
    isError,
    data: weapons,
    error,
  } = useQuery({
    queryKey: ["weapons", weapontype],
    queryFn: () =>
      fetchWeapons(weapontype, currentUser ? currentUser.token : ""),
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
    let newList = weapons ? [...weapons] : [];

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

    setCurrentWeapons(newList);
  }, [weapons, searchTerm, sort, perPage, currentPage]);

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
    mutationFn: deleteWeapon,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["weapons"],
      });
      notifications.show({
        title: "Weapon Deleted",
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
      <Header title="Weapons" page="weapons" />
      <Container size="90%">
        <Space h="20px" />
        <Group position="right">
          {isAdmin && (
            <Button
              component={Link}
              to="/weapons_add"
              variant="gradient"
              gradient={{ from: "yellow", to: "purple", deg: 105 }}
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
        <Grid>
          {currentWeapons
            ? currentWeapons.map((weapon) => {
                return (
                  <Grid.Col key={weapon._id} lg={4} md={6} sm={6} xs={12}>
                    <Card withBorder shadow="sm" p="20px" mx={"auto"}>
                      <Text fs="italic" size="xl">
                        Release On: {weapon.release_date}
                      </Text>
                      <Image
                        src={"http://localhost:5000/" + weapon.image}
                        width="300px"
                        alt={weapon.name}
                        mx={"auto"}
                      />
                      <Space h="20px" />
                      <Title order={3}>{weapon.name}</Title>
                      <Group position="apart" spacing="5px">
                        <Badge color="yellow" size="lg">
                          {weapon.quality}
                        </Badge>
                        <Badge color="red" size="lg">
                          {weapon.weapontype.name}
                        </Badge>
                      </Group>
                      <Space h="20px" />
                      <Button
                        fullWidth
                        onClick={() => {
                          // pop a messsage if user is not logged in
                          if (cookies && cookies.currentUser) {
                            addToCartMutation.mutate(weapon);
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
                      {isAdmin && (
                        <>
                          <Space h="20px" />
                          <Group position="apart">
                            <Button
                              component={Link}
                              to={"/weapons/" + weapon._id}
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
                                  id: weapon._id,
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
      </Container>
      <Footer />
    </>
  );
}

export default Weapons;
