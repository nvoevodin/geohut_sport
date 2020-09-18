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
import { Button } from "native-base";
import * as firebase from "firebase";
import { Entypo } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import * as Animatable from "react-native-animatable";
import background from "../assets/background.png";
import PageTemplate from "./subComponents/Header";
import { connect } from "react-redux";

const moment = require("moment");

class Home extends Component {
  uid = firebase.auth().currentUser.uid;

  state = {
    submitted: false,
    preSubmitted: false,
    proximity: null,
    hasLocationPermission: null,
    proximityMax: 200,
    siteLocation: { latitude: null, longitude: null },
    submittedAnimation: false,
    animatedValue: new Animated.Value(70),
  };

  componentDidMount() {
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

    //READS FROM FIREBASE AND SETS EMAIL AND WORKID IN REDUX
    this.readFireBase();

    //RETRIEVES SITE INFORMATION (using either email/phone or id)
    this.getSiteDataWithEmail(firebase.auth().currentUser.email);
    
    //EXECUTES LOCATION PERMISSIONS
    this.getLocationsPermissions();


    //CHECKS IF ALREADY PRECHECKED IN
    this.precheckedIn();

    //CHECKS IF ALREADY CHECKED IN
    this.checkedIn();



  }


//FUNCTION: CHECKS IF ALREADY CHECKED IN TODAY (IN CASE LOGGED OUT)

precheckedIn = () =>{

  firebase.database().ref('UsersList/'+ this.uid + '/info').once('value', snapshot => {
        
    let data = snapshot.val()

    fetch(`https://geohut.metis-data.site/precheckcheck/${data.workId}`)
    .then(res => res.json())
    .then(res => {  
     
      if (res["data"].some(e => e.checkin_date_time.substr(0,10) === moment().utcOffset("-0500").format("YYYY-MM-DD"))){
        this.setState({preSubmitted: true})
      }
    })
    })

}


checkedIn = () =>{

  firebase.database().ref('UsersList/'+ this.uid + '/info').once('value', snapshot => {
        
    let data = snapshot.val()

    fetch(`https://geohut.metis-data.site/checkincheck/${data.workId}`)
    .then(res => res.json())
    .then(res => {  
     
      if (res["data"].some(e => e.checkin_date_time.substr(0,10) === moment().utcOffset("-0500").format("YYYY-MM-DD"))){
        this.setState({submitted: true})
      }
    })
    })

}


  //FUNCTION: READS FIREBASE AND SETS DATA INTO REDUX
  readFireBase = () => {
    firebase.database().ref('UsersList/'+ this.uid + '/info').once('value', snapshot => {
        
      let data = snapshot.val()
        //console.log('user data: ',data)
        this.props.setUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: firebase.auth().currentUser.email,
          workId: data.workId
        });
      })
  }

  //***THE TWO FUNCTIONS BELOW ARE OPTIONS FOR US IF WE END UP USING EMAIL/PHONE OR ID */

  //FUNCTION: RETRIEVES SITE DATA FOR THAT USER USING THE EMAIL 
  getSiteDataWithEmail = (email) => {
    //console.log("retrieving site data with email:", email);
    fetch(`https://geohut.metis-data.site/siteinfo/${email}`)
      .then((res) => res.json())
      .then((res) => {
        
        //set state
        this.setState({
          siteName: res["data"][0].site_name,
          siteId: res["data"][0].site_id,
          siteAdress: res["data"][0].site_address,
        });

        //set lat long in user location
        this.setState((prevState) => ({
          siteLocation: {
            // object that we want to update
            ...prevState.siteLocation, // keep all other key-value pairs
            latitude: res["data"][0].latitude,
            longitude: res["data"][0].longitude, // update the value of specific key
          },
        }));

        //set data into reducer
        this.props.setSiteData({
          siteName: res["data"][0].site_name,
          siteId: res["data"][0].site_id,
          siteAdress: res["data"][0].site_address,
          latitude: res["data"][0].latitude,
          longitude: res["data"][0].longitude
        });

      });
  };

  //FUNCTION: RETRIEVES SITE DATA FOR THAT USER USING USER_ID 
  getSiteDataWithId = (id) => {
    fetch(`https://geohut.metis-data.site/usersiteinfo/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log('user site data: ',res["data"][0]);
        this.setState({
          siteName: res["data"][0].site_name,
          siteId: res["data"][0].site_id,
          siteAdress: res["data"][0].site_address,
        });

        this.setState((prevState) => ({
          siteLocation: {
            // object that we want to update
            ...prevState.siteLocation, // keep all other key-value pairs
            latitude: res["data"][0].latitude,
            longitude: res["data"][0].longitude, // update the value of specific key
          },
        }));

        //set data into reducer
        this.props.setSiteData({
          siteName: res["data"][0].site_name,
          siteId: res["data"][0].site_id,
          siteAdress: res["data"][0].site_address,
          latitude: res["data"][0].latitude,
          longitude: res["data"][0].longitude
        });
      });
  };

  //FUNCTION: ASKS FOR LOCATION PERMISSIONS
  getLocationsPermissions = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //status && console.log('location: ', status)
    if (status !== "granted") {
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
        (accuracy = 10)
      );
      return distance
    } catch (error) {
      alert.Alert('Something went wrong, please logout, log back in and try again')
    }
  }

  //FUNCTION: HANDLES PRECHECKIN
  preCheckin = async () => {
    if (this.state.preSubmitted === false) {
      this.setState({ submittedAnimation: true });
      console.log("prechecking...");
      try {
        //get location
        let location = await this.getCurrentLoc();
        console.log(parseFloat(location[0].coords.latitude));
        console.log(parseFloat(location[0].coords.longitude));

        //test how far away the user is
        let distance = await this.calculateDistance(
          parseFloat(location[0].coords.latitude),
          parseFloat(location[0].coords.longitude),
          this.state.siteLocation.latitude,
          this.state.siteLocation.longitude
        );
        
        console.log("distance: ", distance);
        console.log("worker id: ", this.props.reducer.userInfo.workId)
        //send data
        fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `https://geohut.metis-data.site/add?time=${
            moment()
              .utcOffset("-0500")
              .format("YYYY-MM-DD HH:mm:ss")
              .substr(0, 18) + "0"
          }&site_id=${this.props.reducer.siteData.siteId}&first_name=${this.props.reducer.userInfo.firstName}
              &last_name=${this.props.reducer.userInfo.lastName}&user_id=${this.props.reducer.userInfo.workId}
              &latitude=${parseFloat(location[0].coords.latitude)}
              &longitude=${parseFloat(location[0].coords.longitude)}
              &checkin_type=1
              &distance=${distance}`,
          { method: "POST" }
        ).catch((err) => console.error(err));

        //show checkin as done
        this.setState({ preSubmitted: true });
        Alert.alert("Thank you for pre-checkin, do not forget to checkin!");
      } catch (e) {
        console.log(e);
      }
      this.setState({ submittedAnimation: false });
    } else {
      Alert.alert("You have already done a pre-checkin!");
    }
  };


  //FUNCTION: HANDLES MAIN CHECKIN
  handleButton = async () => {
    if (this.state.submitted === false) {
      this.setState({ submittedAnimation: true });
      try {
        //get location
        let location = await this.getCurrentLoc();
        console.log(parseFloat(location[0].coords.latitude));
        console.log(parseFloat(location[0].coords.longitude));

        //test how far away the user is
        let distance = await this.calculateDistance(
          parseFloat(location[0].coords.latitude),
          parseFloat(location[0].coords.longitude),
          this.state.siteLocation.latitude,
          this.state.siteLocation.longitude
        );
        console.log("distance: ", distance);

        //validate that location is close enough to the site (200 meters)
        if (distance <= this.state.proximityMax) {
          //if it is send data to database
          //this.getCurrentLoc();
          fetch(
            // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
            `https://geohut.metis-data.site/add?time=${
              moment()
                .utcOffset("-0500")
                .format("YYYY-MM-DD HH:mm:ss")
                .substr(0, 18) + "0"
            }&site_id=${this.props.reducer.siteData.siteId}&first_name=${this.props.reducer.userInfo.firstName}
            &last_name=${this.props.reducer.userInfo.lastName}&user_id=${this.props.reducer.userInfo.workId}
            &latitude=${parseFloat(location[0].coords.latitude)}
            &longitude=${parseFloat(location[0].coords.longitude)}
            &checkin_type=0
            &distance=${distance}`,
            { method: "POST" }
          ).catch((err) => console.error(err));

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
      Alert.alert(
        "You already checked in. If this is a mistake contact us on the Help page."
      );
    }
  };

  render() {


    return (
      <React.Fragment>
        <PageTemplate title={"Home"} logout={this.logout} />
        <View style={styles.container}>
          <View style={styles.bubble}>
            <Text style={styles.titleText}>
              Site:{" "}
              {this.state.siteName
                ? `${this.state.siteName}`
                : `Retrieving ... `}
            </Text>
          </View>

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
                  this.state.submitted == false ? "#eb6e3d" : "green",
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
                <Entypo name="check" size={70} color="white" />
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
                    width: 80,
                    height: 80,
                    opacity: 0.2,
                    transform: [
                      {
                        translateX: this.state.animatedValue.interpolate({
                          inputRange: [0, 80],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        translateY: this.state.animatedValue.interpolate({
                          inputRange: [0, 80],
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
                    width: 80,
                    height: 80,
                    opacity: 0.2,
                    transform: [
                      {
                        translateX: this.state.animatedValue.interpolate({
                          inputRange: [0, 80],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        translateY: this.state.animatedValue.interpolate({
                          inputRange: [0, 80],
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

          <Button
            style={{
              margin: 10,
              backgroundColor: "#ebf2f2",
              shadowColor: "black", // IOS
              shadowOffset: { height: 4, width: 0 }, // IOS
              shadowOpacity: 0.4, // IOS
              shadowRadius: 1, //IOS
            }}
            full
            rounded
            onPress={this.preCheckin}
          >
            <Text style={{ color: "black", fontWeight: "bold" }}>
              Pre-CheckIn
            </Text>
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
    setSiteData: (y) => dispatch({ type: "SET_SITE_DATA", value: y})
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
    top: "-3.2%",
    alignItems: "center",
    justifyContent: "center",
    width: "36%",
    height: "6%",
    marginLeft: "32%",
    marginRight: "32%",
    padding: 5,
    borderRadius: 30,
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
