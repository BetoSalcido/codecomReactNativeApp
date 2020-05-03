import React, { Component } from 'react';
import { Container, Content, Button, Text, Root } from 'native-base';
import { TextInput, StyleSheet, Image, ToastAndroid } from 'react-native';
interface MyProps {
  signIn: any
};
interface MyState {
  phoneNumber: string;
  password: string;
};
class LoginScreen extends Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props)
    this.state = {
      phoneNumber: '',
      password: ''
    }
  }

  componentDidMount() {
    this.setState({phoneNumber: '', password: ''});
  }

  login = async() => {
    let errorMsg = '';
    if (this.state.phoneNumber == null || this.state.phoneNumber == '') {
      errorMsg += 'El numero de celular es requerido.' + '\n'
    } else {
      const regex = /\d{10}/;
      if(!regex.test(this.state.phoneNumber)){
        errorMsg += 'El numero de celular no cuenta con un formato correcto.' + '\n'
      }
    }
    if (this.state.password == null || this.state.password == '') {
      errorMsg += 'La contraseña es requerida.'
    }
    if (errorMsg) {
      ToastAndroid.show(`${errorMsg}`, ToastAndroid.SHORT);
      return;
    }
    this.props.signIn({phoneNumber: this.state.phoneNumber, password: this.state.password});
  }

  render() {
    return (
      // <Root>
      <Container>

        {/* <Content contentContainerStyle={{alignContent:"center"}} style={{ marginLeft: 32, marginEnd: 32 }}> */}
        <Content contentContainerStyle={{ justifyContent:"center", flex:1}} style={{ marginLeft: 32, marginEnd: 32 }}>
          <Image style={{ alignSelf:"center", marginBottom:48}} source={require('../../assets/logo-laffy.png')}/>
          <Text style={styles.text}>
            Número de teléfono
          </Text>
          {/* <Item> */}
          <TextInput maxLength={10} underlineColorAndroid="#fff" style={styles.textInput} placeholder='' onChangeText={(phoneNumber: string) => this.setState({phoneNumber})} />
          <Text style={styles.text}>
            Contraseña
          </Text>
          <TextInput secureTextEntry={true} underlineColorAndroid="#fff" style={styles.textInput} placeholder='' onChangeText={(password: string) => this.setState({password})}/>
          {/* </Item> */}
          <Button style={{ justifyContent: "center", backgroundColor: "black", width: "100%", marginTop:16, height:64 }} onPress={() => this.login()}>
            <Text>Ingresar</Text>
          </Button>
        </Content>
      </Container>
      // </Root>
    );
  }
}
export default LoginScreen;
const styles = StyleSheet.create({
  textInput: { paddingLeft: 16, color: '#333138', borderWidth: 1, borderColor: 'lightgrey', marginTop: 8, height: 50, borderRadius: 4 },
  text: { color: '#333138', fontSize: 16, marginTop:8 }
})