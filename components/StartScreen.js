import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Container, Form, Button } from "native-base";
import * as firebase from "firebase";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
import * as Font from 'expo-font';

class Help extends Component {



  async componentDidMount() {


    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    });
    //CHECKS IF THE USER ALREADY EXISTS (IF YES, CHECKS IF EMAIL IS VERIFIES (IF YES, FORWARDS
    //TO HOME, IF NOT, KEEPS AT THIS SCREEN))






    // await AsyncStorage.getItem('user_info', async (error, result) => {
    //   var res = JSON.parse(result) 

      
    //   try {
    //     console.log(res)
    //     if(res === null){
    //       await fetch(`${global.x}/get_user/${user.uid}`)
    //       .then((res) => res.json())
    //       .then(async(res) => {


    //         try {
           
            
    //          await  AsyncStorage.setItem('user_info', JSON.stringify([res.data[0]["uid"], res.data[0]["first_name"], res.data[0]["last_name"], res.data[0]["email"]]))
    //         } catch (e) {
    //           console.log('something wrong (storage)')
    //         }
          
    //       }).catch((error) => {
    //         console.log(error)
    //       });

    //     }

     
    //   } catch(e){console.log(e)}
    // });



  

    this.setUser()
    this.setSite() 
    firebase.auth().onAuthStateChanged((user) =>  {
      if (user) {

        if(user.emailVerified == true){
          this.props.navigation.navigate("Home")
        } else {
          this.props.navigation.navigate("StartScreen")
          alert('Verify your email first!')
        }
        
      }
    });


  }


  setUser = async () =>{


    //const value = await AsyncStorage.getItem('defaultCourt')
  
    
    AsyncStorage.getItem('user_info', async (error, result) => {
      var res = JSON.parse(result) 
        try {


          //console.log(res)
          
        this.props.storeUserId(res[0],res[1],res[2],res[3])
        } catch (e) {
          console.log('start screen 1')
          console.log(e)
        }
      
      
    })}

 setSite = async () =>{


  //const value = await AsyncStorage.getItem('defaultCourt')

  
    AsyncStorage.getItem('defaultCourt', (error, result) => {
      var res = JSON.parse(result) 
      try {
        
      this.props.storePlayground(res[0],res[1],res[2],res[3])
      } catch (e) {
        console.log('start screen 2')
        console.log(e)
      }
    
    
  })








  var value = await AsyncStorage.getItem('anonimous')
  val = (value === 'true')
  console.log(val + 'ttt')
  try {
    this.props.setAnanimous(val)
  } catch (e) {
    console.log('start screen 3')
    console.log(e)}
 


  // AsyncStorage.getItem('anonimous')
  //   .then( function (value) {
  //       var val = JSON.parse(value) // boolean false
  //       console.log(val)
  //       this.props.setAnanimous(val)
  //   })
//   AsyncStorage.getItem('anonimous', function (err, value) {
   
//     var val =  JSON.parse(value)// boolean false
//     console.log(val + 'ggg')
//     this.props.setAnanimous(val)

//     if (err) {

//   console.log(err)
//     }
// })
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
    storeUserId: (id,fname,sname,email) => dispatch({ type: "STORE_USER_ID", value: id, value1:fname, value2:sname, value3:email}),
    storePlayground: (name,id,lat,lon) => dispatch({ type: "STORE_PLAYGROUND", value: name,value1: id, value2:lat,value3:lon}),
    setAnanimous: (x) => dispatch({ type: "SET_ANANIMOUS", value: x}),

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
