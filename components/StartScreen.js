import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Container, Form, Button } from "native-base";
import * as firebase from "firebase";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
class Help extends Component {



  componentDidMount() {
    //CHECKS IF THE USER ALREADY EXISTS (IF YES, CHECKS IF EMAIL IS VERIFIES (IF YES, FORWARDS
    //TO HOME, IF NOT, KEEPS AT THIS SCREEN))

    this.setSite() 
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate(
          user.emailVerified == true ? "Home" : "StartScreen"
        );
      }
    });


  }

 setSite = async () =>{
  //const value = await AsyncStorage.getItem('defaultCourt')

  AsyncStorage.getItem('defaultCourt', (error, result) => {
    var res = JSON.parse(result) 
    this.props.storePlayground(res[0],res[1],res[2],res[3])
  
  });
  //console.log(value + 'testin')
  //this.props.setSiteData(value)
 }

  //MOVE TO LOGIN
  handleLogin = () => {
    this.props.navigation.navigate("Login");
  };

  //MOVE TO REGISTER
  handleSignUp = () => {
    this.props.navigation.navigate("SignUp");
  };


  

  render() {
    return (
      <Container>
        {/* ANIMATING LOGO */}
        <Animatable.View animation="bounceInDown" style={styles.container1}>
          <Image
            source={require("../assets/logo.png")}
            style={{ width: 120, height: 190 }}
          />

          <Text style={{ fontSize: 43, fontWeight: "bold" }}>VolleyPal</Text>
        </Animatable.View>
        {/* BUTTONS  */}
        <View style={styles.container}>
          <Form>
            <Button
              style={{ margin: 10 }}
              full
              rounded
              success
              onPress={this.handleLogin}
            >
              <Text style={{ color: "white" }}>Login</Text>
            </Button>

            <Button
              style={{ margin: 10 }}
              full
              rounded
              primary
              onPress={this.handleSignUp}
            >
              <Text style={{ color: "white" }}>Registration</Text>
            </Button>
          </Form>
        </View>

        {/* ANIMATED COMPANY LOGO */}
        <View style={styles.container3}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>by</Text>
          <Animatable.Image
            animation="bounceInUp"
            style={styles.tinyLogo}
            source={require("../assets/companyLogo.png")}
          />
          <Text style={{ fontSize: 13, fontWeight: "bold" }}>VeryCool-Studio.com</Text>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
    
  const { reducer } = state
  return { reducer }
};

const mapDispachToProps = dispatch => {
  return {

    storePlayground: (name,id,lat,lon) => dispatch({ type: "STORE_PLAYGROUND", value: name,value1: id, value2:lat,value3:lon})

  };
};

export default connect(mapStateToProps, mapDispachToProps)(Help);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",

    paddingTop: 10,

    paddingRight: 40,
    paddingLeft: 40,
    marginTop: 40,
  },
  container1: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  container3: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  tinyLogo: {
    width: "40%",
    height: "22%",
  },
});
