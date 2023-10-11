import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getCartItems,
  removeItemFromCart,
  removeItemsFromCart,
} from "../api/cart";
import Header from "../Header";
import Footer from "../Footer";
import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import {
  Table,
  Space,
  Grid,
  Group,
  Button,
  Image,
  Checkbox,
  Container,
} from "@mantine/core";

export default function Cart() {
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const queryClient = useQueryClient();
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const deleteMutation = useMutation({
    mutationFn: removeItemFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Characters/Weapons Deleted",
        color: "green",
      });
      setCheckAll(false);
    },
  });

  // console.log(queryClient.getQueryData(["cart"]));
  // console.log(getCartItems());
  // console.log(cart);

  const checkBoxAll = (event) => {
    if (event.target.checked) {
      const newCheckedList = [];
      cart.forEach((cart) => {
        newCheckedList.push(cart._id);
      });
      setCheckedList(newCheckedList);
      setCheckAll(true);
    } else {
      setCheckedList([]);
      setCheckAll(false);
    }
  };

  const checkboxOne = (event, id) => {
    if (event.target.checked) {
      const newCheckedList = [...checkedList];
      newCheckedList.push(id);
      setCheckedList(newCheckedList);
    } else {
      const newCheckedList = checkedList.filter((cart) => cart !== id);
      setCheckedList(newCheckedList);
    }
  };

  const deleteCheckedItems = () => {
    deleteProductsMutation.mutate(checkedList);
  };

  const deleteProductsMutation = useMutation({
    mutationFn: removeItemsFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Selected Characters/Weapons Deleted",
        color: "green",
      });
      setCheckAll(false);
      setCheckedList([]);
    },
  });

  return (
    <>
      <Header title="Cart" page="cart" />
      <Container size="90%">
        <Space h="20px" />
        <Group position="center">
          <Grid>
            <Table highlightOnHover>
              <thead>
                <tr>
                  <th>
                    <Checkbox
                      type="checkbox"
                      checked={checkAll}
                      disabled={cart && cart.length > 0 ? false : true}
                      onChange={(event) => {
                        checkBoxAll(event);
                      }}
                    />
                  </th>
                  <th>Items</th>
                  <th></th>
                  <th>Quality</th>
                  <th>
                    <Group position="right">Actions</Group>
                  </th>
                </tr>
              </thead>{" "}
              <tbody>
                {cart ? (
                  cart.map((cart) => {
                    return (
                      <tr key={cart._id}>
                        <td>
                          <Checkbox
                            checked={
                              checkedList && checkedList.includes(cart._id)
                                ? true
                                : false
                            }
                            type="checkbox"
                            onChange={(event) => {
                              checkboxOne(event, cart._id);
                            }}
                          />
                        </td>
                        <td>
                          {cart.image && cart.image !== "" ? (
                            <>
                              <Image
                                src={"http://localhost:5000/" + cart.image}
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
                        <td> {cart.name}</td>
                        <td>{cart.quality}</td>

                        <td>
                          <Group position="right">
                            <Button
                              color="red"
                              size="xs"
                              radius="50px"
                              onClick={() => {
                                deleteMutation.mutate(cart._id);
                              }}
                            >
                              Remove
                            </Button>
                          </Group>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <Grid.Col className="mt-5">
                    <Space h="120px" />
                    <h1 className="text-center text-muted">Empty Cart .</h1>
                  </Grid.Col>
                )}
                <tr></tr>
              </tbody>
            </Table>
          </Grid>
        </Group>
        <Group position="apart">
          <Button
            variant="danger"
            disabled={checkedList && checkedList.length > 0 ? false : true}
            onClick={(event) => {
              event.preventDefault();
              deleteCheckedItems();
            }}
          >
            Delete Selected
          </Button>
          <Button
            component={Link}
            to="/favoritesadd"
            disabled={cart.length > 0 ? false : true}
          >
            Add to Favorites
          </Button>
        </Group>
      </Container>
      <Space h="50px" />
      <Footer />
    </>
  );
}
