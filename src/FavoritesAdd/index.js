import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { clearCartItems, getCartItems } from "../api/cart";
import {
  Container,
  Title,
  Table,
  Button,
  Image,
  Space,
  TextInput,
  Grid,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { useCookies } from "react-cookie";
import { createFavorite } from "../api/favorite";

export default function Checkout() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(currentUser ? currentUser.name : "");
  const [email, setEmail] = useState(currentUser ? currentUser.email : "");
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const createOrderMutation = useMutation({
    mutationFn: createFavorite,
    onSuccess: () => {
      notifications.show({
        title: "Favorites Added",
        color: "green",
      });
      // clear the cart
      clearCartItems();
      navigate("/favorites");
    },
    onError: (error) => {
      // when this is an error in API call
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const doCheckout = () => {
    let error = false;
    // 1. make sure name & email is available
    if (!(name && email)) {
      error = "Please fill out all the required fields.";
    }

    // if error is available, show notification
    if (error) {
      notifications.show({
        title: error,
        color: "red",
      });
    } else {
      // if no error, trigger the order API to create a new order
      createOrderMutation.mutate(
        JSON.stringify({
          userName: name,
          userEmail: email,
          characters: cart.map((i) => i._id),
          weapons: cart.map((i) => i._id),
        })
      );
      /*
        [
          { name: '1' },
          { name: '2; }
        ]
        [ '1' , '2' ]
        1, 2
      */
      setLoading(true);
    }
  };

  return (
    <Container>
      <Header title="Add to Favorites" page="favoritesadd" />
      <Space h="35px" />
      <Grid>
        <Grid.Col span={7}>
          <Title order={3} align="center">
            Contact Information
          </Title>
          <Space h="20px" />
          <TextInput
            value={name}
            placeholder="Name"
            label="Name"
            required
            onChange={(event) => setName(event.target.value)}
          />
          <Space h="20px" />

          <TextInput
            value={email}
            placeholder="Email address"
            label="Email"
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <Space h="20px" />

          <Button
            fullWidth
            onClick={() => {
              doCheckout();
            }}
          >
            Add to Favorites
          </Button>
        </Grid.Col>
        <Grid.Col span={5}>
          <p>Your Favorites summary</p>
          <Table>
            <tbody>
              {cart ? (
                cart.map((c) => {
                  return (
                    <tr key={c._id}>
                      <td
                        style={{
                          borderTop: "none",
                        }}
                      >
                        {c.image && c.image !== "" ? (
                          <>
                            <Image
                              src={"http://localhost:5000/" + c.image}
                              width="100px"
                            />
                          </>
                        ) : (
                          <Image
                            src={
                              "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
                            }
                            width="100px"
                          />
                        )}
                      </td>
                      <td
                        style={{
                          borderTop: "none",
                        }}
                      >
                        {" "}
                        {c.name}
                      </td>
                      <td
                        style={{
                          borderTop: "none",
                        }}
                      >
                        {c.quality}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>No Characters/Weapons Add Yet!</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
