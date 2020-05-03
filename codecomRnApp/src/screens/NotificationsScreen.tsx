import React, { Component } from 'react';
import { Container, Header, Title, Button, Left, Right, Body, Icon, Text, Root, Content, Drawer } from 'native-base';
import { FlatList, View, SafeAreaView, StyleSheet, RefreshControl, TouchableOpacity, ToastAndroid } from 'react-native';
import API from '../services/api';
import * as Font from "expo-font";
import utils from '../../utils/utils';
interface MyProps {
  navigation: any,
  signOut: any
};
interface MyState {
  loading: boolean;
  isRefreshing: boolean;
  data: {
    _id: string;
    body: string;
    createdAt: Date;
  }[];
};
class NotificationsScreen extends Component<MyProps, MyState> {
  offset: number
  limit: number
  drawer: any;

  constructor(props: MyProps) {
    super(props);
    this.offset = 0;
    this.limit = 10;
    this.state = {
      loading: false,
      isRefreshing: false,
      data: []
    }
  }

  componentWillMount() {
    this.fetchUser(this.offset, this.limit, false) //Method for API call
  }

  async fetchUser(offset: number, limit: number, isRefreshing: boolean) {
    try {
      const api = new API(this.props.signOut)
      let notifications: any[] = await api.loadNotifications(offset, limit);
      if (notifications && notifications.length) {
        if (isRefreshing) {
          this.setState({ data: notifications })
        } else {
          let listData = this.state.data;
          let data = listData.concat(notifications)
          this.setState({ data })
        }
      }
      this.setState({ loading: false, isRefreshing: false })
    } catch (error) {
      ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
    }
  }

  async onRefresh() {
    this.offset = 0;
    this.setState({ isRefreshing: true }); // true isRefreshing flag for enable pull to refresh indicator
    await this.fetchUser(this.offset, this.limit, true) //Method for API call
  }
  async handleFinishLoading() {
    this.setState({ loading: false });
  }

  async loadResourcesAsync() {
    await Promise.all([
      Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
      }),
    ])
  }

  handleLoadMore = async () => {
    if (!this.state.loading) {
      this.offset = this.state.data && this.state.data.length ? this.state.data.length : 0; // increase page by 1
      this.fetchUser(this.offset, this.limit, false); // method for API call
    }
  };

  render() {
    return (

      // <Root>
      <Container>
        <Header style={{ backgroundColor: "#fbdf71" }} androidStatusBarColor="#fbdf71">
          <Left>
            <Button transparent onPress={this.props.navigation.openDrawer}
            >
              <Icon name='menu' />
            </Button>
          </Left>
          <Body >
            <Title>Notificaciones</Title>
          </Body>
          <Right />
        </Header>
        <SafeAreaView style={styles.container}>
          <FlatList extraData={this.state}
            data={this.state.data}
            // renderItem={({ item }) =>
            //   <View style={{ marginTop: 10 }}>
            //     <Text>{item.body}</Text>
            //   </View>
            // }
            renderItem={({ item }) =>
              <View style={{
                justifyContent: 'center',
                paddingTop: 10,
                paddingBottom: 10,
                borderRadius: 2,
                borderColor: "grey",
                borderBottomWidth: 1,
              }}>

                <Text style={{ marginLeft: 10 }}>{item.body}</Text>
                <Text style={{ color: "grey", marginRight: 10, alignSelf: "flex-end" }}>{utils.formatDatetime(item.createdAt)}</Text>

              </View>

            }
            keyExtractor={item => item._id}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            onEndReachedThreshold={0.4}
            onEndReached={this.handleLoadMore.bind(this)}
          >

          </FlatList>
        </SafeAreaView>
      </Container>
      // </Root>
    );
  }

}
export default NotificationsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  containerMenu: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  text: {
    color: "#161924",
    fontSize: 20,
    fontWeight: "500"
  }
});
