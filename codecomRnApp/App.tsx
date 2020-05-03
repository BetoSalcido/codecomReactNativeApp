import React, { Component } from 'react';
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { Root } from 'native-base';
import registerForPushNotificationsAsync from './src/components/push-notifications/push-notifications'
import utils from './utils/utils';
import SplashScreen from './src/screens/SplashScreen';
// import { SERVER_PORT } from 'react-native-dotenv'
import {API_BASE_URL} from './utils/constants'
import IndexApp from './src';
interface MyProps { };
interface MyState {
  loading: boolean;
  loadingPermissions: boolean;
  expoPushToken: string;
  notification: any;
};
export default class App extends Component<MyProps, MyState> {
  private _isMounted: boolean;

  state: MyState = {
    loading: true,
    expoPushToken: '',
    notification: {},
    loadingPermissions: true
  }
  constructor(props: MyProps) {
    super(props);
    this.state = {
      loading: true,
      expoPushToken: '',
      notification: {},
      loadingPermissions: true
    };
    this._isMounted = false;

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

  async componentWillMount() {

  }

  async componentDidMount() {
    // Arrglar esta shit
    // try {
    //   let token = await registerForPushNotificationsAsync();
    //   if (token) {
    //     await utils.storeData('pushNotificationToken', token);
    //     await this.setState({ expoPushToken: token, loadingPermissions: false });
    //   }
    // } catch (error) {
    //   alert(error.message)
    // } finally {
    // }
    await this.setState({ loadingPermissions: false });
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.loading) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={() => { }}
          onFinish={() => this.handleFinishLoading()}
        />
      );
    } else if (this.state.loadingPermissions) {
      return (
        <SplashScreen></SplashScreen>
      )
    } else {
      return (
        <Root>
          <IndexApp navigation={'RESTORE_TOKEN'} />
        </Root>
      );
    }
  }
}