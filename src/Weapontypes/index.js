import { Link } from "react-router-dom";
import { Group, Space, Button, Image, Table, Container } from "@mantine/core";
import { useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchWeapontypes, deleteWeapontype } from "../api/weapontypes";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import Header from "../Header";
import Footer from "../Footer";

export default function Weapontypes() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
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

  const deleteMutation = useMutation({
    mutationFn: deleteWeapontype,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["weapontypes"],
      });
      notifications.show({
        title: "Weapon Type Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Header title="Weapon Types" page="weapontypes" />
      <Container>
        <Space h="20px" />{" "}
        <Group position="right">
          {isAdmin && (
            <Button
              component={Link}
              to="/weapontypes_add"
              variant="gradient"
              gradient={{ from: "yellow", to: "purple", deg: 105 }}
            >
              Add New Weapon Type
            </Button>
          )}
        </Group>
        <Space h="20px" />
        <Table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          {weapontypes ? (
            weapontypes.map((weapontype) => {
              return (
                <tbody>
                  <tr key={weapontype._id}>
                    <td>
                      {weapontype.image && weapontype.image !== "" ? (
                        <>
                          <Image
                            src={"http://localhost:5000/" + weapontype.image}
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
                    </td>
                    <td>{weapontype.name}</td>
                    <td>{weapontype.info}</td>
                    <td>
                      {isAdmin && (
                        <Button
                          variant="outline"
                          color="red"
                          onClick={() => {
                            deleteMutation.mutate({
                              id: weapontype._id,
                              token: currentUser ? currentUser.token : "",
                            });
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                </tbody>
              );
            })
          ) : (
            <Group position="center">
              <Space h="120px" />
              <h1 className="text-center text-muted">No Weapon Type yet .</h1>
            </Group>
          )}
        </Table>
      </Container>
      <Space h="50px" />
      <Footer />
    </>
  );
}
