import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";


import { Button,Right,Left, Header,Title } from "native-base";

import * as firebase from "firebase";
import { Entypo } from "@expo/vector-icons";
 


import * as Permissions from 'expo-permissions';
import * as Location from "expo-location";
import { getDistance } from "geolib";
import * as Animatable from "react-native-animatable";
import background from "../assets/background.png";

import { connect } from "react-redux";
import PlaygroundModal from "./subComponents/playgroundModal"
import PreCheckModal from "./subComponents/preCheckModal"
import onShare from "./subComponents/shareButton"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import notificationFunction from "./functions/notifications"

//TRACKING - FAUSTO
//import { configureBgTasks } from './bg';
//const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';

const moment = require("moment");
import AsyncStorage from '@react-native-community/async-storage';








class Home extends Component {
  
  uid = firebase.auth().currentUser.uid;

  state = {
    finished:false,
    submitted: false,
    presubmitted: false,
    proximity: null,
    hasLocationPermission: null,
    proximityMax: 200,
    siteLocation: { latitude: null, longitude: null },
    submittedAnimation: false,
    animatedValue: new Animated.Value(70),
     //FAUSTO - USING TLC FOR NOW
     volleyballCourt: {
      //latitude: 40.6,
      //longitude: -73.5
      latitude: 40.705030,//40.601,//40.7634642,
      longitude: -74.011550//-73.9290698
    }
  };

  async componentDidMount() {





    //CHECK IS USER IS VERIFIED
    if (firebase.auth().currentUser.emailVerified == false) {
      Alert.alert(
        "ALERT!",
        "Please verify your email first.",
        [{ text: "OK" }],
        { cancelable: false }
      );
      this.logout();
    }

    
        this.readFireBase(this.props.reducer.userId[1],this.props.reducer.userId[2],this.props.reducer.userId[3]);
           //CHECKS IF ALREADY PRECHECKED IN
    this.preCheckedIn(this.props.reducer.userId[3]);

    //CHECKS IF ALREADY CHECKED IN
    this.checkedIn(this.props.reducer.userId[3]);
     
    //   } catch(e){console.log(e)}
    // });
 

    //ADDING GEO TRACKING - FAUSTO
    //const {setEnterRegion} = this.props;
    //configureBgTasks({ setEnterRegion });
   
    //this.startBackgroundUpdate();
    //this.startGeofence();

 //EXECUTES LOCATION PERMISSIONS
 this.getLocationsPermissions();


  }


  componentDidUpdate(prevProps){
    if(prevProps.reducer.playgroundId !== this.props.reducer.playgroundId){
      console.log('updating')

        //READS FROM FIREBASE AND SETS EMAIL AND WORKID IN REDUX
        this.readFireBase(this.props.reducer.userId[1],this.props.reducer.userId[2],this.props.reducer.userId[3]);
           //CHECKS IF ALREADY PRECHECKED IN
    this.preCheckedIn(this.props.reducer.userId[3]);

    //CHECKS IF ALREADY CHECKED IN
    this.checkedIn(this.props.reducer.userId[3]);
    }

  }



//define and start geofence -FAUSTO
startGeofence = async () => {
  console.log('starting geofencing test ...')
  //let x = 
  Location.startGeofencingAsync('TASK_CHECK_GEOFENCE',
    [
    {
      identifier: 'court',
      latitude: this.state.volleyballCourt.latitude,
      longitude: this.state.volleyballCourt.longitude,
      radius: 20,
      notifyOnEnter: true,
      notifyOnExit: true,
     }
     ]
    )
};

//start tracking in background -FAUSTO
startBackgroundUpdate = async () => {
  Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 1, // minimum change (in meters) betweens updates
    deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
    // foregroundService is how you get the task to be updated as often as would be if the app was open
    foregroundService: {
      notificationTitle: 'Using your location',
      notificationBody: 'To turn off, go back to the app and switch something off.',
    },
  });
}



checkedIn = (email) =>{

  //firebase.database().ref('UsersList/'+ this.uid + '/info').once('value', snapshot => {
        
    //let data = snapshot.val()

 console.log(email)

    fetch(`${global.x}/checkincheck/${email}`)
    .then(res => res.json())
    .then(res => {  
     console.log(res['data'])
      if (res["data"].some(e => e.checkin_datetime.substr(0,10) === moment().utc().format("YYYY-MM-DD")) && res["data"].some(e => e.site_id === this.props.reducer.playgroundId)){
        this.setState({submitted: true})
        console.log('checkedIN')
      } else {
        this.setState({submitted: false})
      }
    })
    .catch((error) => {
      console.log(error)
    });
   // })

}


preCheckedIn = (email) =>{
 
    //firebase.database().ref('UsersList/'+ this.uid + '/info').once('value', snapshot => {
          
      //let data = snapshot.val()
  
   
  
      fetch(`${global.x}/precheckcheck/${email}`)
      .then(res => res.json())
      .then(res => {  
       
        if (res["data"].some(e => e.site_id === this.props.reducer.playgroundId)){
          this.props.storePreCheck()
          
        } else {
          this.props.cancelPreCheck()
          
        }
      })
      .catch((error) => {
        console.log(error)
      });
      //})
  
  }




  //FUNCTION: READS FIREBASE AND SETS DATA INTO REDUX
  readFireBase = (first_name,last_name,email) => {
    //firebase.database().ref('UsersList/'+ this.uid + '/info').once('value', snapshot => {
        
      //let data = snapshot.val()
        //console.log('user data: ',data)
        this.props.setUserData({
          firstName: first_name,
          lastName: last_name,
          user_id: email
        });
      //})
  }



  //FUNCTION: ASKS FOR LOCATION PERMISSIONS
  getLocationsPermissions = async () => {
    let status;
    status = await Permissions.getAsync(Permissions.LOCATION);
    if (status.status !== "granted") {
      status = await Permissions.askAsync(Permissions.LOCATION)};
    if (status.status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    } else {
      this.setState({ hasLocationPermission: status });
    }
  };

  //FUNCTION: LOGS OUT
  logout = () => {
    firebase
      .auth()
      .signOut()
      .catch((error) => console.log(error));

    this.props.navigation.navigate("StartScreen");
  };

  //FUNCTION: GETS USER'S CURRENT LOCATION
  getCurrentLoc = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      location = await JSON.stringify(location);
      location = await eval("(" + "[" + location + "]" + ")");
      //location && console.log(location[0].coords.latitude);
      return location;
    } catch (e) {
      Alert.alert("cannot get current location, try again or ask for help");
    }
  };

  //FUNCTION: CALCULATES DISTANCE INCLUDES TRY CATCH FOR ERRORS
  calculateDistance = async (start_x,start_y, end_x,end_y) => {
    try {
      let distance = await getDistance(
        {
          latitude: start_x,
          longitude: start_y,
        },
        {
          latitude: end_x,
          longitude: end_y,
        },
        (accuracy = 100)
      );
    
      return distance
      
    } catch (error) {
      alert('Something went wrong, please logout, log back in and try again')
    }
  }


  //FUNCTION: HANDLES MAIN CHECKIN
  handleButton = async () => {
   
if (this.props.reducer.playgroundId === ''){
  Alert.alert("Select your court first.");
} else if (this.state.submitted === false) {
      this.setState({ submittedAnimation: true });
      try {
        //get location
        let location = await this.getCurrentLoc();
        console.log(parseFloat(location[0].coords.latitude));
        console.log(parseFloat(location[0].coords.longitude));
        console.log(this.props.reducer.playgroundLat)
        console.log(this.props.reducer.playgroundLon)
        //test how far away the user is
        let distance = await this.calculateDistance(
          parseFloat(location[0].coords.latitude),
          parseFloat(location[0].coords.longitude),
          this.props.reducer.playgroundLat,
          this.props.reducer.playgroundLon
        );
        console.log("distance: ", distance);

        //validate that location is close enough to the site (200 meters)
        if (distance <= this.state.proximityMax) {
          //if it is send data to database
          //this.getCurrentLoc();
          fetch(
            // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
            `${global.x}/add?time=${
              moment().utc().format("YYYY-MM-DD HH:mm:ss").substr(0, 18) + "0"
            }&site_id=${this.props.reducer.playgroundId}&first_name=${this.props.reducer.isAnanimous?"Anonimous":this.props.reducer.userInfo.firstName}
            &last_name=${this.props.reducer.isAnanimous?"Player":this.props.reducer.userInfo.lastName}&user_id=${this.props.reducer.userInfo.user_id}`,
            { method: "POST" }
          ).catch((error) => {
            console.log(error)
          });

          //close animation
          //this.handleAnimation();

          //show checkin as done

          this.setState({ submitted: true });
        } else {
          //console.log('something went wrong');
          Alert.alert("Please move closer to your site and try again.");
        }
      } catch (e) {
        console.log(e);
      }
      this.setState({ submittedAnimation: false });
    } else {
console.log(this.props.reducer.playgroundId)
this.setState({ submittedAnimation: true });
await fetch(
  // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
  `${global.x}/update?site_id=${this.props.reducer.playgroundId}&user_id=${this.props.reducer.userInfo.user_id}`,
  { method: "PUT" }
).catch((error) => {
  console.log(error)
})

await fetch(
  // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
  `${global.x}/addToStorage?site_id=${this.props.reducer.playgroundId}&user_id=${this.props.reducer.userInfo.user_id}`,
  { method: "POST" }
).catch((error) => {
  console.log(error)
})
  fetch(
    // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
    `${global.x}/delete?site_id=${this.props.reducer.playgroundId}&user_id=${this.props.reducer.userInfo.user_id}`,
    { method: "DELETE" }
  ).catch((error) => {
    console.log(error)
  })






  this.setState({ submittedAnimation: false });
      this.setState({ submitted: false });

      Alert.alert(
        "You left. Good bye."
      );
    }
  };

  cancelPrecheck =async()=>{


    Alert.alert(
      "Cancel Your Pre-CheckIn?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => {

          },
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          fetch(
            // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
            `${global.x}/cancelPreCheck?site_id=${this.props.reducer.playgroundId}&user_id=${this.props.reducer.userInfo.user_id}`,
            { method: "DELETE" }
          ).catch((error) => {
            console.log(error)
          })
      
          this.props.cancelPreCheck()
      
          alert('You canceled your pre-check.')
        } }
      ],
      { cancelable: false }
    );




  }

  playgroudAlert = () =>{
    Alert.alert('Select a Court First!')

  }

  submittedAlert = () =>{
    Alert.alert('Cant Pre-Check While Still Playing!')
  }

  




  render() {

//console.log(this.state)
    return (
      <React.Fragment>

<Header style = {{backgroundColor:'#5cb85c',height: 70, paddingTop:0}}>
        <Left>
        <Title style = {{color:'white', fontSize: 30}}>Home</Title>
          </Left>

          <Right>
          <TouchableOpacity onPress = {this.logout}>
          <MaterialCommunityIcons name="exit-run" size={30} color="white" />
          </TouchableOpacity>
          </Right>
        </Header>

        {/* <PageTemplate title={"Home"} logout={this.logout} /> */}
        <View style={styles.container}>
          <Button style={styles.bubble} onPress={() => {
                  this.props.onModalOne()}}>
        
        <Text style = {{color:'white', fontWeight:'bold', fontSize:18}}>Courts </Text>
            <MaterialCommunityIcons name="target" size={32} color="white" />
           
          
          
          </Button>

          <Button style ={{position: "absolute", top: "3%", right:'6%',borderRadius:55, height:55, width:55}}
                    full
                    rounded
                    success
                    onPress={onShare}
                    >

<Entypo name="share" size={28} color="white" />
                    </Button>
          
      

          <View style={styles.container}>
            <TouchableOpacity
              //disabled={this.state.submitted}
              style={{
                position: "absolute",
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.2)",
                alignItems: "center",
                justifyContent: "center",
                width: 170,
                height: 170,
                backgroundColor:
                  this.state.submitted == false ? '#5cb85c' : "#eb6e3d",
                borderRadius: 100,
                shadowColor: "rgba(0,0,0, .4)", // IOS
                shadowOffset: { height: 1, width: 1 }, // IOS
                shadowOpacity: 1, // IOS
                shadowRadius: 1, //IOS
                elevation: 15, // Android
                zIndex: 1,
              }}
              onPress={this.handleButton}
            >
              {this.state.submitted == false ? (
                <Entypo name="location" size={60} color="white" />
              ) : (
                //<Entypo name="check" size={70} color="white" />
                <MaterialCommunityIcons name="exit-run" size={60} color="white" />
              )}
              {this.state.submitted == false ? (
              <Text style = {{color:'white', fontSize:15}}>Check In</Text>)
              : ( <Text style = {{color:'white', fontSize:15}}>Check Out</Text>
                )}
            </TouchableOpacity>
            {/*<ImageBackground source={background} style={styles.image}> </ImageBackground>*/}
            {this.state.submittedAnimation == false ? (
              <Animatable.View animation="zoomIn">
                <Animated.Image
                  source={background}
                  resizeMode="cover"
                  style={{
                    zIndex: 0,
                    justifyContent: "center",
                    width: 70,
                    height: 70,
                    opacity: 0.2,
                    transform: [
                      {
                        translateX: this.state.animatedValue.interpolate({
                          inputRange: [0, 70],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        translateY: this.state.animatedValue.interpolate({
                          inputRange: [0, 70],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        scaleX: this.state.animatedValue.interpolate({
                          inputRange: [1, 15],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        scaleY: this.state.animatedValue.interpolate({
                          inputRange: [1, 15],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  }}
                />
              </Animatable.View>
            ) : (
              <Animatable.View animation="zoomOut">
                <Animated.Image
                  source={background}
                  resizeMode="cover"
                  style={{
                    zIndex: 0,
                    justifyContent: "center",
                    width: 70,
                    height: 70,
                    opacity: 0.2,
                    transform: [
                      {
                        translateX: this.state.animatedValue.interpolate({
                          inputRange: [0, 70],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        translateY: this.state.animatedValue.interpolate({
                          inputRange: [0, 70],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        scaleX: this.state.animatedValue.interpolate({
                          inputRange: [1, 15],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        scaleY: this.state.animatedValue.interpolate({
                          inputRange: [1, 15],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  }}
                />
              </Animatable.View>
            )}
          </View>
          <View><Text style = {{fontSize: 24,fontStyle: 'italic'}}>{this.props.reducer.playgroundName}</Text></View>

          <Button
            style={{
              margin: 10,
              backgroundColor:
              this.props.reducer.preCheckStatus == false ? "#ebf2f2" : '#5cb85c',
              shadowColor: "black", // IOS
              shadowOffset: { height: 4, width: 0 }, // IOS
              shadowOpacity: 0.4, // IOS
              shadowRadius: 1, //IOS
            }}
            full
            rounded
            onPress={
              this.props.reducer.playgroundId === ''? this.playgroudAlert:
              this.state.submitted === true?this.submittedAlert:
              this.props.reducer.preCheckStatus == false?
              this.props.onModalTwo:this.cancelPrecheck}
          >
            {this.props.reducer.preCheckStatus == false ?
            <Text style={{ color: "black", fontWeight: "bold" }}>
              Pre-CheckIn
            </Text> : 
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Cancel PreCheck
            </Text>}
          </Button>

          {this.state.submittedAnimation && (
            <View style={styles.loading}>
              <ActivityIndicator
                animating={this.state.submittedAnimation}
                style={{ left: "0.5%", bottom: "40%" }}
                size="large"
                color="white"
              />
            </View>
          )}
        </View>
        <PlaygroundModal checkIfChecked = {() => this.checkedIn()} checkIfPreChecked = {() => this.preCheckedIn()}/>
        
        <PreCheckModal/>
      </React.Fragment>
    );
  }
}



const mapStateToProps = (state) => {
    
  const { reducer } = state
  return { reducer }
};

const mapDispachToProps = dispatch => {
  return {
    setEmailData: (y) => dispatch({ type: "SET_EMAIL_DATA", value: y}),
    setUserData: (y) => dispatch({ type: "SET_USER_DATA", value: y}),
    
    onModalOne: () => dispatch({ type: "CLOSE_MODAL_1", value: true}),
    onModalTwo: () => dispatch({ type: "CLOSE_MODAL_2", value: true}),
    cancelPreCheck: () => dispatch({ type: "CANCEL_PRECHECK", value: false}),
    storePreCheck: () => dispatch({ type: "STORE_PRECHECK", value: true})
  };
};

export default connect(mapStateToProps, mapDispachToProps)(Home);










const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logout: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: "flex-end",
    marginTop: -5,
    //position: 'absolute', // add if dont work with above
  },
  titleText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  bubble: {
    position: "absolute",
    top: "-4.6%",
    alignItems: "center",
    justifyContent: "center",
    width: "14%",
    height: "9%",
    marginLeft: "33%",
    marginRight: "33%",
    padding: 5,
    borderRadius: 50,
    paddingBottom: 5,
    backgroundColor: "#4aa0cf",
    shadowColor: "black", // IOS
    shadowOffset: { height: 4, width: 0 }, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 1, //IOS
    elevation: 15, // Android
    zIndex: 9999,
  },
  bubble1: {
    position: "absolute",
    top: 120,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "4%",
    margin: 6,
    padding: 5,
    borderRadius: 20,
    paddingBottom: 5,
    backgroundColor: "#4aa0cf",
    shadowColor: "#499ecc", // IOS
    shadowOffset: { height: 6, width: 2 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 5, // Android
  },
  image: {
    zIndex: 0,
    justifyContent: "center",
    width: "100%",
    height: "100%",
    opacity: 0.19,
  },

  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "#666570",
    opacity: 0.8,
  },
});
