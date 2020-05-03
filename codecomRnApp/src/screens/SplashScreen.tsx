import React, { Component } from 'react';
import { View, Content } from "native-base";
import { StyleSheet, Image } from 'react-native';

interface MyProps { };
interface MyState {
  loading: boolean;
};

class SplashScreen extends Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Content contentContainerStyle={{ justifyContent: "center", flex: 1 }} style={{ marginLeft: 32, marginEnd: 32 }}>
          <Image style={{ alignSelf: "center", marginBottom: 48 }} source={require('../../assets/logo-laffy.png')} />
        </Content>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: { backgroundColor: "#000000", width: "100%", height: "100%" },
})

export default SplashScreen;