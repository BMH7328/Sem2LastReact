import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Container,
  Table,
  Text,
  Button,
  Space,
  Image,
  Group,
  MantineProvider,
} from "@mantine/core";
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
        <MantineProvider
          theme={{
            fontFamily: "Rajdhani, sans-serif",
          }}
        >
          <Space h="50px" />
          <Table horizontalSpacing="xl" striped>
            <thead>
              <tr>
                <th>
                  <Text size={"20px"}>Users</Text>
                </th>
                <th>
                  <Text size={"20px"}>Characters</Text>
                </th>

                <th>
                  <Text size={"20px"}>Weapons</Text>
                </th>

                <th>
                  <Text size={"20px"}>Date Added</Text>
                </th>
                <th>
                  <Text size={"20px"}>Actions</Text>
                </th>
              </tr>
            </thead>

            <tbody>
              {favorites
                ? favorites.map((o) => {
                    return (
                      <tr key={o._id}>
                        <td width={"200px"}>
                          <Text weight={500} size={"20px"}>
                            {o.userName}
                            <br />({o.userEmail})
                          </Text>
                        </td>
                        <td>
                          {o.characters
                            ? o.characters.map((favorite, index) => (
                                <div key={index}>
                                  <Group position="apart">
                                    {favorite.image && favorite.image !== "" ? (
                                      <>
                                        <Image
                                          src={
                                            "http://localhost:5000/" +
                                            favorite.image
                                          }
                                          width="150px"
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
                                    <p>
                                      <Text size={"20px"} weight={500}>
                                        {favorite.name}
                                      </Text>
                                    </p>
                                  </Group>
                                </div>
                              ))
                            : null}
                        </td>
                        <td>
                          {o.weapons
                            ? o.weapons.map((favorite, index) => (
                                <div key={index}>
                                  <Group position="apart">
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
                                    <p>
                                      <Text size={"20px"} weight={500}>
                                        {favorite.name}
                                      </Text>
                                    </p>
                                  </Group>
                                </div>
                              ))
                            : null}
                        </td>
                        <td>
                          <Text weight={500}>{o.date_add}</Text>
                        </td>
                        <td>
                          <Button
                            sx={{
                              backgroundColor: "#FFFFFF",
                              color: "black",
                              border: "2px solid red",
                              "&:hover": { backgroundColor: "#FF0000" },
                            }}
                            onClick={() => {
                              deleteMutation.mutate({
                                id: o._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </Table>
        </MantineProvider>
      </Container>
      <Space h="50px" />
      <Footer />
    </>
  );
}
