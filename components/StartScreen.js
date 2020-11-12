import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Alert } from "react-native";
import { Container, Form, Button } from "native-base";
import * as firebase from "firebase";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
import * as Font from 'expo-font';
import { AntDesign } from '@expo/vector-icons';
class Help extends Component {

state = {
  bad: false
}

  async componentDidMount() {

   
    

    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    });


    this.setUser()
    this.setSite() 

    fetch(`${global.x}/app_status`)
    .then((res) => res.json())
    .then((res) => {

      if(res.data[0].app_status !== 'bad'){
        this.welcomeAlert()
        firebase.auth().onAuthStateChanged((user) =>  {
          if (user) {
    
            if(user.emailVerified == true){
              this.props.navigation.navigate("Home")
            } else {
              
              alert('Please, verify your email!')
            }
            
          }
        });
      } else {
        alert("VolleyPal is under maintenance at the moment. Please check back later. Sorry for the inconvenience.")
        this.setState({status:true})
      }


     
    //this.setState({status:res.data[0].app_status})
    
    }).catch((error) => {
      console.log(error)
    });

    



  }

  welcomeAlertButton = () =>{
    Alert.alert(
      `Welcome to VolleyPal.`,
      `VolleyPal is an all around service for beach volleyball players. Check out www.VolleyPal.site page for the detailed app guide. \n
      DISCLOSURE: \n 
      * This app collects location data to enable check in and out at appropriate courts. For the best experience, we are asking for the "Always" location access when the app is not in use (in background). That option allows you to be automatically checked in and out at the courts where you play. 
      * We do not collect, store, or share your location data for any other purposes.
      * You can always turn that feature off in the Profile tab.`,
      [
  
        { text: "Got it", onPress: () => {
    
        
    
          
        } }
      ],
      { cancelable: false }
    );
  }

  welcomeAlert = async () =>{
    try{
      var value = await AsyncStorage.getItem('welcomeAlert')
    } catch(e){
console.log('error')
    }
    
    val = (value === 'true')
    console.log(val)
if (val === false){

  Alert.alert(
    `Welcome to VolleyPal.`,
    `VolleyPal is an all around service for beach volleyball players. Check out www.VolleyPal.site page for the detailed app guide. \n
    DISCLOSURE: \n 
    * This app collects location data to enable check in and out at appropriate courts. For the best experience, we are asking for the "Always" location access when the app is not in use (in background). That option allows you to be automatically checked in and out at the courts where you play. 
    * We do not collect, store, or share your location data for any other purposes.
    * You can always turn that feature off in the Profile tab.`,
    [

      { text: "Got it", onPress: () => {
  
        
  
        try {
          AsyncStorage.setItem('welcomeAlert', "true")
        } catch (e) {
          console.log('something wrong (storage)')
        }
  
        
      } }
    ],
    { cancelable: false }
  );

}



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
  
  try {
    this.props.setAnanimous(val)
  } catch (e) {
    
    console.log(e)}


try{
  var notificationStatus = await AsyncStorage.getItem('notifications')
  val = (notificationStatus === 'true')
  
  try {
    this.props.setNotifications(val)
    console.log('notif set')
  } catch (e) {
    
    console.log(e)}  
} catch(e){console.log('no notif')}

 


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
              disabled ={this.state.status}
              full
              rounded
              success
              onPress={this.handleLogin}
            >
              <Text style={{ color: "white" }}>Login</Text>
            </Button>

            <Button
              style={{ margin: 10 }}
              disabled ={this.state.status}
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
          <Text style={{ fontSize: 10, marginTop:10 }}>ver. 1.5.1</Text>
        </View>
        <Button style={{ position: "absolute", bottom: "5%", right: '6%', borderRadius: 60, height: 55, width: 55 }}
          full
          rounded
          success
          onPress={this.welcomeAlertButton}
        >

          <AntDesign name="questioncircleo" size={35} color="white" />
        </Button>
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
    setNotifications: (x) => dispatch({ type: "SET_NOTIFICATIONS", value: x }),
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
