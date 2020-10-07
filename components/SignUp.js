import React, { Component } from "react";
import { StyleSheet, Text, Alert } from "react-native";
import { Container, Form, Input, Item, Button, Label } from "native-base";
import * as firebase from "firebase";

class SignUp extends Component {
  state = {
    email: "",
    password: "",
    errorMessage: null,
    firstName: "",
    lastName: "",
  };

  // when a user signs up they will have a record added to the user table in realtime database
  addUser = (uid, firstName, lastName, email) => {





    firebase
      .database()
      .ref("UsersList/" + uid + "/info/")
      .set({
        
        firstName,
        lastName,
        email,
      })
      .then((data) => {})
      .catch((error) => {alert(error)});
  };

  //CHECKS EMAIL AGAINST ALLOWED USERS, CREATES NEW USER, ADDS USERS INFO TO FIREBASE, CHECKS FOR ERRORS
  handleSignUp = (email, password) => {
    // fetch(`https://geohut.metis-data.site/validate/${email}`)
    //   .then((res) => res.json())
    //   .then((res) => {
        //if (res.data[0].id === email) {
          if (this.state.password.length < 6) {
            alert("Must be minimum 6 characters!");
            return;
          }
          firebase
            .auth()
            .createUserWithEmailAndPassword(email.trim(), password)
            .then(() => firebase.auth().currentUser.sendEmailVerification())
  

            .catch((error) => {this.setState({ errorMessage: error.message })
            console.log(error.message)})
            .then((user) => {
              if (this.state.errorMessage === "The email address is already in use by another account."){
                Alert.alert(
                  "Access Denied!",
                  "You already registered with this email.",
                  [{ text: "OK" }],
                  { cancelable: false }
                )
              } else {
                this.addUser(
                  firebase.auth().currentUser.uid,
                  
                  this.state.firstName,
                  this.state.lastName,
                  this.state.email
                );
                Alert.alert(
                  "SUCCESS!",
                  "We just emailed you a verification link.",
                  [{ text: "OK" }],
                  { cancelable: false }
                )
              }

            })
              .catch((error) =>
        Alert.alert(
          "Access Denied!",
          "Something is wrong!",
          [{ text: "OK" }],
          { cancelable: false }
        ))


        // } else {
        //   Alert.alert(
        //     "Access Denied!",
        //     "You must use your employer-issued ID!",
        //     [{ text: "OK" }],
        //     { cancelable: false }
        //   );
        // }
      //})
      // .catch((error) =>
      //   Alert.alert(
      //     "Access Denied!",
      //     "Something is wrong!",
      //     [{ text: "OK" }],
      //     { cancelable: false }
      //   )
      // );
  };



  goBack = () => {
    this.props.navigation.navigate("StartScreen");
  };

  render() {
    
    return (
      <Container style={styles.container}>
        <Form>
          {/* DISPLAYS ERROR IF EXISTS */}
          {this.state.errorMessage && (
            <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
          )}

{/* INPUTS */}
          <Item floatingLabel>
            <Label>First Name</Label>
            <Input
              autoCorrect={false}
              onChangeText={(firstName) => this.setState({ firstName })}
              
            />
          </Item>

          <Item floatingLabel>
            <Label>Last Name</Label>
            <Input
              secureTextEntry={false}
              autoCorrect={false}
              onChangeText={(lastName) => this.setState({ lastName })}
              
            />
          </Item>
          {/* <Item floatingLabel>
            <Label>Work ID</Label>
            <Input
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(workId) => this.setState({ workId })}
              
            />
          </Item> */}

          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(email) => this.setState({ email })}
              
            />
          </Item>

          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(password) => this.setState({ password })}
              
            />
          </Item>

          {(!this.state.password || !this.state.email || !this.state.firstName || !this.state.lastName) && 
          <Text style = {{color:'red', width: '50%', marginLeft: '30%', marginTop: '5%'}}>All Fields Are Required!</Text>
          } 

          <Button
            style={{ margin: 10, marginTop: 40 }}
            full
            rounded
            success
            disabled = {!this.state.password || !this.state.email || !this.state.firstName || !this.state.lastName}
            onPress={() =>
              this.handleSignUp(this.state.email, this.state.password)
            }
          >
            <Text style={{ color: "white" }}>Register</Text>
          </Button>

          <Button
            style={{ margin: 10 }}
            full
            rounded
            primary
            onPress={this.goBack}
          >
            <Text style={{ color: "white" }}>Go Back</Text>
          </Button>
        </Form>
      </Container>
    );
  }
}

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 40,
  },
});
