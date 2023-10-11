import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { Container, Table, Button, Space, Image, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { fetchFavorites, deleteFavorites } from "../api/favorite";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";

export default function Favorites() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavorites(currentUser ? currentUser.token : ""),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const deleteMutation = useMutation({
    mutationFn: deleteFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
      notifications.show({
        title: "Favorite Deleted",
        color: "green",
      });
    },
  });
  return (
    <>
      <Header title="My Favorites" page="favorites" />
      <Container size="90%">
        <Space h="35px" />
        <Table horizontalSpacing="xl" striped>
          <thead>
            <tr>
              <th>Users</th>
              <th>Characters</th>
              <th>Weapons</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {favorites
              ? favorites.map((o) => {
                  return (
                    <tr key={o._id}>
                      <td width={"200px"}>
                        {o.userName}
                        <br />({o.userEmail})
                      </td>
                      <td width={"1000px"}>
                        {o.characters
                          ? o.characters.map((favorite, index) => (
                              <div key={index}>
                                <Group>
                                  {favorite.image && favorite.image !== "" ? (
                                    <>
                                      <Image
                                        src={
                                          "http://localhost:5000/" +
                                          favorite.image
                                        }
                                        width="200px"
                                      />
                                    </>
                                  ) : (
                                    <Image
                                      src={
                                        "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                                      }
                                      width="100px"
                                    />
                                  )}
                                  <p>{favorite.name}</p>
                                </Group>
                              </div>
                            ))
                          : null}
                      </td>
                      <td width={"1000px"}>
                        {o.weapons
                          ? o.weapons.map((favorite, index) => (
                              <div key={index}>
                                <Group>
                                  {favorite.image && favorite.image !== "" ? (
                                    <>
                                      <Image
                                        src={
                                          "http://localhost:5000/" +
                                          favorite.image
                                        }
                                        width="200px"
                                      />
                                    </>
                                  ) : (
                                    <Image
                                      src={
                                        "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                                      }
                                      width="100px"
                                    />
                                  )}
                                  <p>{favorite.name}</p>
                                </Group>
                              </div>
                            ))
                          : null}
                      </td>
                      <td width={"500px"}>{o.date_add}</td>
                      <td width={"200px"}>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            color="red"
                            onClick={() => {
                              deleteMutation.mutate({
                                id: o._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
        <Group position="center">
          <Button component={Link} to="/">
            Continue to check more information...
          </Button>
        </Group>
      </Container>
      <Space h="50px" />
      <Footer />
    </>
  );
}
