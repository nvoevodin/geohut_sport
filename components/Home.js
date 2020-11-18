import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  ActivityIndicator,
  Platform
} from "react-native";

import { Button, Right, Left, Header, Title } from "native-base";
import * as Location from "expo-location";
import * as firebase from "firebase";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons';


import * as Permissions from 'expo-permissions';

import { getDistance } from "geolib";
import * as Animatable from "react-native-animatable";
import background from "../assets/background.png";

import { connect } from "react-redux";
import PlaygroundModal from "./subComponents/playgroundModal"
import PreCheckModal from "./subComponents/preCheckModal"
import WeatherReport from "./subComponents/weatherModal"
import onShare from "./subComponents/shareButton"
import { MaterialCommunityIcons } from '@expo/vector-icons';
//import notificationFunction from "./functions/notifications"

//TRACKING - FAUSTO
import { configureBgTasks } from './bg_startup';
const TASK_FETCH_LOCATION = 'background-location-task';
import AsyncStorage from '@react-native-community/async-storage';
const moment = require("moment");
import PermissionNotFunc from './functions/notifications'








class Home extends Component {

  uid = firebase.auth().currentUser.uid;

  state = {
    finished: false,
    submitted: false,
    presubmitted: false,
    proximity: null,
    hasLocationPermission: null,
    proximityMax: 100,
    siteLocation: { latitude: null, longitude: null },
    submittedAnimation: false,
    animatedValue: new Animated.Value(70),
    tracking: this.props.reducer.tracking
  };

  async componentDidMount() {


    //notificationFunction()

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

    this.readFireBase(this.props.reducer.userId[1], this.props.reducer.userId[2], this.props.reducer.userId[3]);

    //CHECKS IF ALREADY PRECHECKED IN
    this.preCheckedIn(this.props.reducer.userId[3]);

    //CHECKS IF ALREADY CHECKED IN
    this.checkedIn(this.props.reducer.userId[3]);

    //EXECUTES LOCATION PERMISSIONS
    this.getLocationsPermissions();

    //REFRESH COURTS
    this.removeItemValue('courts');
    //this.removeItemValue('submitted');

    //NOTIFICATIONS
    const firstNotif = await AsyncStorage.getItem('notifications')
    if (firstNotif === null) {
      const valu = await PermissionNotFunc();
      this.props.setNotifications(valu)
    }
  }


  componentDidUpdate(prevProps) {
    if (prevProps.reducer.playgroundId !== this.props.reducer.playgroundId || prevProps.reducer.userId[3] !== this.props.reducer.userId[3]) {
      //console.log('updating')

      //READS FROM FIREBASE AND SETS EMAIL AND WORKID IN REDUX
      this.readFireBase(this.props.reducer.userId[1], this.props.reducer.userId[2], this.props.reducer.userId[3]);
      //CHECKS IF ALREADY PRECHECKED IN
      this.preCheckedIn(this.props.reducer.userId[3]);

      //CHECKS IF ALREADY CHECKED IN
      this.checkedIn(this.props.reducer.userId[3]);
    }
    else if (this.props.reducer.tracking == false & prevProps.reducer.tracking == true) {
      //console.log('stop tracking now')
      //REFIRE TRACKING WHEHN SOMEONE TOGGLES TRACKING
      //IF A PERSON DENIED LOCATION USE THE VERY FIRST TIME STATUS WILL BE FALSE IN WHICH CASE
      //WE NEED TO ASK AGAIN TO ALLOW THEM TO TOGGLE LOCATION
    } else if (this.props.reducer.tracking == true & prevProps.reducer.tracking == false) {
      this.getLocationsPermissions();
    }
  }

  //FUNCTION: STORE COURTS LOCALLY 
  _storeTracking = async (key, value) => {
    try {
      await AsyncStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.log('LOCAL STORAGE: ', error);
      //send error to table
      //key_value: req.query.key_value,
      //datetime: req.query.datetime,
      //error: req.query.error
      fetch(
        // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
        `${global.x}/storageErrors?key_value=${key}&value=${value}&datetime=${moment().utc().format("YYYY-MM-DD HH:mm:ss").substr(0, 18) + "0"}&error=${error}`,
        { method: "POST" }
      ).catch((error) => {
        console.log(error)
      });
    }
  };

  autoTrackingCheckin = async () => {
    //console.log('passed function works!!!!!!!')
    this.setState({ submitted: true });
    //await AsyncStorage.setItem('submitted', 'TRUE')
    //this._storeTracking('submitted', 'TRUE');
    //this.setState({ submittedAnimation: true })
  }

  autoTrackingCheckout = async () => {
    //console.log('passed function works!!!!!!!')
    this.setState({ submitted: false });
    //await AsyncStorage.setItem('submitted', 'FALSE')
    //this._storeTracking('submitted', 'FALSE');
    //this.setState({ submittedAnimation: false })
  }

  executeBackground = async (user, storePlayground, storePlaygroundAuto, anonymous = this.props.reducer.isAnanimous, autoCheckout = this.autoTrackingCheckout, autoCheckin = this.autoTrackingCheckin) => {
    //console.log('FIRING BACKGROUND...');
    //start tracking in background  
    const startBackgroundUpdate = async () => {
      if (Platform.OS === 'ios') {
        await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
          accuracy: Location.Accuracy.Balanced,
          //timeInterval: 60000,
          distanceInterval: 30, // minimum change (in meters) betweens updates
          //deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
          // foregroundService is how you get the task to be updated as often as would be if the app was open
          foregroundService: {
            notificationTitle: 'Using your location for VolleyPal',
            notificationBody: 'To turn off, go back to the app and toggle tracking.',
          },
          pausesUpdatesAutomatically: false,
        });
      } else {
        await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
          accuracy: Location.Accuracy.Balanced,
          //timeInterval: 300000,
          timeInterval: 300000,
          distanceInterval: 0, // minimum change (in meters) betweens updates
          //deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
          // foregroundService is how you get the task to be updated as often as would be if the app was open
          foregroundService: {
            notificationTitle: 'Using your location for VolleyPal',
            notificationBody: 'To turn off, go back to the app and toggle tracking.',
          },
          pausesUpdatesAutomatically: false,
        });
      }
    }

    setTimeout(function () {
      try {
        //console.log('user info: ', user)
        //console.log('records: ', records)
        //console.log('anonimity???',anonymous)
        configureBgTasks({ user, storePlayground, storePlaygroundAuto, anonymous, autoCheckin, autoCheckout });
        startBackgroundUpdate();
      }
      catch (error) {
        console.log(error)
      }

    }, 1500);
  }


  //FUNCTION: GET USER DATA
  pullUserInfo = async () => {
    const value = await AsyncStorage.getItem('user_info').then(req => JSON.parse(req))
    if (value !== null) {
      return {
        "email": value[3],
        "first_name": value[1],
        "last_name": value[2]
      }
    } else {
      //console.log('pulling information......')
      let response = await fetch(`${global.x}/get_user/${firebase.auth().currentUser.uid}`)
        .then(res => res.json())
        .then(res => {
          //console.log('res',res) 
          return res["data"][0]
        })
        .catch((error) => {
          console.log(error)
        });
      return response
    }
  }

  //FUNCTION TO CHECK IF PERSON IS ALREADY CHECKED ELSEWHERE
  checkedOtherSite = async () => {
    console.log('checking entire checkin system...')

  }



  checkedIn = async (email) => {

    //console.log('CHECKING STATUS AGAIN...')
    await fetch(`${global.x}/checkincheck/${email}`)
      .then(res => res.json())
      .then(res => {
        if (res["data"].some(e => e.checkin_datetime.substr(0, 10) === moment().utc().format("YYYY-MM-DD")) && res["data"].some(e => e.site_id === this.props.reducer.playgroundId)) {
          this.setState({ submitted: true })
          return res["data"]
        } else {
          this.setState({ submitted: false })
          return res["data"]
        }
      })
      .catch((error) => {
        console.log(error)
      });



  }

  //WE CHECK ASYNC STORAGE AND SET TRACKIGN STATUS
  checkTrackingStatus = async () => {
    //CHECK STATUS
    const asyncTracking = await AsyncStorage.getItem('vpAutoTracking');
    if (asyncTracking === null) {
      //console.log('TRACKING STATUS IS EMPTY, SETTING TO TRUE...')
      this.props.setTracking(true);
      this._storeTracking('vpAutoTracking', 'true')
    } else {
      //console.log('TRACKING STATUS IS...',JSON.parse(asyncTracking));
      this.props.setTracking(JSON.parse(asyncTracking))
    }

    //BASED OFF STATUS FIRE
    if (JSON.parse(this.props.reducer.tracking) === true) {
      //console.log('TRACKING IS STARTING UP...', JSON.parse(this.props.reducer.tracking));
      this.pullUserInfo().then(user => {
        //console.log('CHECKED IN? ', this.state.submitted);
        //console.log('TRACKING REDUCER INTERPERTED AS: ',this.props.reducer.tracking);
        const { storePlayground, storePlaygroundAuto } = this.props;
        this.executeBackground(user, storePlayground, storePlaygroundAuto);
      });
    }


  }

  preCheckedIn = (email) => {


    fetch(`${global.x}/precheckcheck/${email}`)
      .then(res => res.json())
      .then(res => {

        if (res["data"].some(e => e.site_id === this.props.reducer.playgroundId)) {
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
  readFireBase = (first_name, last_name, email) => {

    //console.log('userid info: ', first_name)
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
      status = await Permissions.askAsync(Permissions.LOCATION)
    };
    if (status.status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    } else {
      this.setState({ hasLocationPermission: status });
      //CHECK TRACKING STATUS FIRE AUTOMATIC CHECK IN IF PERMISSIONS ARE GIVEN
      this.checkTrackingStatus();
      //this.checkedIn(this.props.reducer.userId[3]);

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
  calculateDistance = async (start_x, start_y, end_x, end_y) => {
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
        //(accuracy = 100)
      );
      this.setState({ distance: distance })
      return distance

    } catch (error) {
      alert('Something went wrong, please logout, log back in and try again')
    }
  }


  //FUNCTION: HANDLES MAIN CHECKIN
  handleButton = async () => {

    if (this.props.reducer.playgroundId === '') {
      Alert.alert("Select your court first.");
    }
    //TRACKING - COMMENT
    else if (JSON.parse(this.props.reducer.tracking) == true & this.state.submitted == true) {
      Alert.alert('No need to check out. You will be checked out Automatically')
      //} else if (this.props.reducer.tracking == true & this.state.submitted == false) {
      //  Alert.alert('No need to check in You will be checked in Automatically')
    }
    else if (this.state.submitted === false) {
      this.setState({ submittedAnimation: true });
      try {
        //get location
        let location = await this.getCurrentLoc();

        //test how far away the user is
        let distance = await this.calculateDistance(
          parseFloat(location[0].coords.latitude),
          parseFloat(location[0].coords.longitude),
          this.props.reducer.playgroundLat,
          this.props.reducer.playgroundLon
        );
        //console.log("distance: ", distance);

        //validate that location is close enough to the site (200 meters)
        if (distance <= this.state.proximityMax) {
          //if it is send data to database
          //this.getCurrentLoc();
          fetch(
            // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
            `${global.x}/add?time=${
            moment().utc().format("YYYY-MM-DD HH:mm:ss").substr(0, 18) + "0"
            }&site_id=${this.props.reducer.playgroundId}&first_name=${this.props.reducer.isAnanimous ? "Anonimous" : this.props.reducer.userId[1]}
            &last_name=${this.props.reducer.isAnanimous ? "Player" : this.props.reducer.userId[2]}&user_id=${this.props.reducer.userId[3]}`,
            { method: "POST" }
          ).catch((error) => {
            console.log(error)
          });

          //close animation
          //this.handleAnimation();

          //show checkin as done
          //await this._storeTracking('submitted', 'TRUE')
          //await AsyncStorage.setItem('submitted', 'TRUE')
          this.setState({ submitted: true });
        } else if (distance > this.state.proximityMax
          // & this.props.reducer.tracking == false 
        ) {
          //console.log('something went wrong');
          Alert.alert("Please move closer to your site and try again.");
        }
      } catch (e) {
        console.log(e);
      }
      this.setState({ submittedAnimation: false });
    } else {
      //console.log(this.props.reducer.playgroundId)
      this.setState({ submittedAnimation: true });
      await fetch(
        // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
        `${global.x}/update?site_id=${this.props.reducer.playgroundId}&user_id=${this.props.reducer.userId[3]}`,
        { method: "PUT" }
      ).catch((error) => {
        console.log(error)
      })

      await fetch(
        // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
        `${global.x}/addToStorage?site_id=${this.props.reducer.playgroundId}&user_id=${this.props.reducer.userId[3]}`,
        { method: "POST" }
      ).catch((error) => {
        console.log(error)
      })
      fetch(
        // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
        `${global.x}/delete?site_id=${this.props.reducer.playgroundId}&user_id=${this.props.reducer.userId[3]}`,
        { method: "DELETE" }
      ).catch((error) => {
        console.log(error)
      })




      //await this._storeTracking('submitted', 'FALSE')
      //await AsyncStorage.setItem('submitted', 'FALSE')
      this.setState({ submittedAnimation: false });
      this.setState({ submitted: false });

      Alert.alert(
        "You left. Good bye."
      );
    }
  };

  cancelPrecheck = async () => {


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
        {
          text: "OK", onPress: () => {
            fetch(
              // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
              `${global.x}/cancelPreCheck?site_id=${this.props.reducer.playgroundId}&user_id=${this.props.reducer.userId[3]}`,
              { method: "DELETE" }
            ).catch((error) => {
              console.log(error)
            })

            this.props.cancelPreCheck()

            alert('You canceled your pre-check.')
          }
        }
      ],
      { cancelable: false }
    );




  }

  playgroudAlert = () => {
    Alert.alert('Select a Court First!')

  }

  submittedAlert = () => {
    Alert.alert('Cant Pre-Check While Still Playing!')
  }



  onWeather = () => {
    this.props.onModalWeather()
  }

  async removeItemValue(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch (exception) {
      return false;
    }
  }




  render() {
    //console.log('HOME PAGE CHECKIN STATUS:', this.state.submitted);

    return (
      <React.Fragment>

        <Header style={{ backgroundColor: '#5cb85c', height: 70, paddingTop: 0 }}>
          <Left>
            <Title style={{ color: 'white', fontSize: 30 }}>Home</Title>
          </Left>

          <Right>
            <TouchableOpacity onPress={this.logout}>
              <MaterialCommunityIcons name="exit-run" size={30} color="white" />
            </TouchableOpacity>
          </Right>
        </Header>

        {/* <PageTemplate title={"Home"} logout={this.logout} /> */}
        <View style={styles.container}>
          <Button style={styles.bubble} onPress={() => {
            this.props.onModalOne()
          }}>

            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Courts </Text>
            <MaterialCommunityIcons name="target" size={30} color="white" />



          </Button>

          <Button style={{ position: "absolute", top: "3%", left: '5%', borderRadius: 50, height: 45, width: 'auto', padding: 8 }}
            full
            rounded
            warning
            onPress={() => this.props.reducer.playgroundId ? this.onWeather() : alert('No court selected!')}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>Weather </Text>
            <FontAwesome5 name={this.props.reducer.weather === 'Bad' ? "frown" : this.props.reducer.weather === 'Acceptable' ? "meh" : this.props.reducer.weather === 'Good' ? "smile" : this.props.reducer.weather === 'Perfect' ? "grin-stars" : "question-circle"} size={25} color="white" />
          </Button>

          <Button style={{ position: "absolute", top: "3%", right: '6%', borderRadius: 50, height: 45, width: 45 }}
            full
            rounded
            success
            onPress={onShare}
          >

            <Entypo name="share" size={25} color="white" />
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
                width: 155,
                height: 155,
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
                <Entypo name="location" size={45} color="white" />
              ) : (
                  //<Entypo name="check" size={70} color="white" />
                  <MaterialCommunityIcons name="exit-run" size={45} color="white" />
                )}
              {this.state.submitted == false ? (
                <Text style={{ color: 'white', fontSize: 15 }}>Check In</Text>)
                : (<Text style={{ color: 'white', fontSize: 15 }}>Check Out</Text>
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
                    width: 65,
                    height: 65,
                    opacity: 0.2,
                    transform: [
                      {
                        translateX: this.state.animatedValue.interpolate({
                          inputRange: [0, 65],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        translateY: this.state.animatedValue.interpolate({
                          inputRange: [0, 65],
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
                      width: 65,
                      height: 65,
                      opacity: 0.2,
                      transform: [
                        {
                          translateX: this.state.animatedValue.interpolate({
                            inputRange: [0, 65],
                            outputRange: [0, 1],
                          }),
                        },
                        {
                          translateY: this.state.animatedValue.interpolate({
                            inputRange: [0, 65],
                            outputRange: [0, 1],
                          }),
                        },
                        {
                          scaleX: this.state.animatedValue.interpolate({
                            inputRange: [1, 65],
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
          <View><Text style={{ fontSize: 24, fontStyle: 'italic' }}>{this.props.reducer.playgroundName}</Text></View>

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
              this.props.reducer.playgroundId === '' ? this.playgroudAlert :
                this.state.submitted === true ? this.submittedAlert :
                  this.props.reducer.preCheckStatus == false ?
                    this.props.onModalTwo : this.cancelPrecheck}
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
        <PlaygroundModal checkIfChecked={() => this.checkedIn()} checkIfPreChecked={() => this.preCheckedIn()} />

        <PreCheckModal />
        <WeatherReport />
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
    onModalWeather: () => dispatch({ type: "MODAL_WEATHER", value: true }),
    setEmailData: (y) => dispatch({ type: "SET_EMAIL_DATA", value: y }),
    setUserData: (y) => dispatch({ type: "SET_USER_DATA", value: y }),
    onModalOne: () => dispatch({ type: "CLOSE_MODAL_1", value: true }),
    onModalTwo: () => dispatch({ type: "CLOSE_MODAL_2", value: true }),
    cancelPreCheck: () => dispatch({ type: "CANCEL_PRECHECK", value: false }),
    storePreCheck: () => dispatch({ type: "STORE_PRECHECK", value: true }),
    setTracking: (y) => dispatch({ type: "TRACKING", value: y }),
    storePlayground: (name, id, lat, lon) => dispatch({ type: "STORE_PLAYGROUND", value: name, value1: id, value2: lat, value3: lon }),
    storePlaygroundAuto: (id) => dispatch({ type: "STORE_PLAYGROUND_AUTO", value: id }),
    setNotifications: (x) => dispatch({ type: "SET_NOTIFICATIONS", value: x }),
    storeCheck: (y) => dispatch({ type: "SUBMITTED", value: y })

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
    top: "-4.1%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "30%",
    height: "8%",
    //marginLeft: "42%",
    //marginRight: "32%",
    padding: 5,
    borderRadius: 50,
    //paddingBottom: 5,
    backgroundColor: "#4aa0cf",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "white", // IOS
    // shadowOffset: { height: 4, width: 0 }, // IOS
    // shadowOpacity: 0.5, // IOS
    shadowRadius: 0, //IOS
    elevation: 0, // Android
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
