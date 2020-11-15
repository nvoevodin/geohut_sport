import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Switch, Alert } from 'react-native';
import { Button, Content, Card, CardItem, Body, Right, Left, Header, Title } from "native-base";
import * as firebase from 'firebase';

import ChangeInfo from './subComponents/changeInformationModal'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
//import Layout from '../constants/Layout';
import AsyncStorage from '@react-native-community/async-storage';
import * as TaskManager from 'expo-task-manager';
import { connect } from 'react-redux';
import helpers from './functions/localNotification'
import PermissionNotFunc from './functions/notifications'
//import { configureBgTasks, runTest } from './bg_test';

class Profile extends Component {

  gotQuestion = () => {
    alert("If you have any questions, would like to provide feedback, or would like to contact us for something else, please visit VolleyPal's website www.volleypal.site or email us at volleypalapp@gmail.com. Our website contains detailed description of the app with step by step tutorial. If you would like to email us about something, plese use subject lines like: Feedback, App Question, App Bug. We will try to be as responsive as possible. Thank you!")
  }





  deleteAccount = async () => {

    Alert.alert(
      `Delete account.`,
      `Are you sure you want to delete your account?`,
      [
        {
          text: "No",
          onPress: () => {

          },
          style: "cancel"
        },
        {
          text: "Yes", onPress: () => {

            AsyncStorage.removeItem('user_info')

            fetch(
              // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
              `${global.x}/delete_user?uid=${this.props.reducer.userId[0]}`,
              { method: "DELETE" }
            ).catch((error) => {
              console.log(error)
            })


            firebase.auth().currentUser.delete().then(function () {
              alert('deleted')
            }).catch(function (error) {
              alert('error')
            });


            this.logout()


            //           firebase.auth().currentUser.delete().then(function () {
            //             




            // alert('You deleted your account.')



            //           }).catch(function (error) {
            //             console.log(error)
            //             alert('Important action! Log into the app again and try one more time.')
            //           })
          }
        }
      ],
      { cancelable: false }
    );

  }


  logout = () => {
    firebase.auth().signOut()
      .catch(error => console.log(error))

    this.props.navigation.navigate('StartScreen')
  }


  uid = firebase.auth().currentUser.uid;

  state = {
    firstName: '',
    lastName: '',
    email: '',
    modalVisible: false,
    total: null,
    totalWeek: null,
    showHistory: false,
    data: null,
    isEnabled: this.props.reducer.isAnanimous,
    tracking: this.props.reducer.tracking,
    isRunningNotification: this.props.reducer.isRunningNotification
  }

  toggleSwitch = () => {

    this.props.setAnanimous(!this.state.isEnabled)
    this.setState({ isEnabled: !this.state.isEnabled })
    try {
      AsyncStorage.setItem('anonimous', JSON.stringify(!this.state.isEnabled))
    } catch (e) {
      console.log(e)
      console.log('something wrong (storage)')
    }

  };


  toggleNotification = () => {

    this.props.setNotifications(!this.state.isRunningNotification)
    this.setState({ isRunningNotification: !this.state.isRunningNotification })
    try {
      AsyncStorage.setItem('notifications', JSON.stringify(!this.state.isRunningNotification))
    } catch (e) {
      console.log(e)
      console.log('something wrong (storage)')
    }

    if (this.state.isRunningNotification) {
      helpers.cancelNotificationFunction()
    } else {
      PermissionNotFunc();
      //this.props.setNotifications(valu)
    }

  };


  //CHANGE INFO MODAL TOGGLE
  showModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible })
  }


  componentDidMount() {

    this.readUserData()
    //configureBgTasks();


  }


  componentDidUpdate(prevProps, prevState) {
    // Typical usage (don't forget to compare props):
    if (prevProps.reducer.isAnanimous !== this.props.reducer.isAnanimous) {
      this.readUserData()
    }
  }


  // getCheckinData =() => {

  //   fetch(`https://geohut.metis-data.site/historycheckins/${this.props.reducer.userInfo.workId}`)
  //     .then(res => res.json())
  //     .then(res => {
  //      console.log(res["data"])
  //       this.setState({ data: res["data"], showHistory: true })
  //     })
  // }

  toggleTracking = () => {

    this.props.setTracking(!this.state.tracking)
    this.setState({ tracking: !this.state.tracking })

    if (!this.state.tracking == false) {
      //AsyncStorage.setItem('submitted', 'TRUE')
      //UNREGISTER TASK WHEN TURNING OFF
      const TASK_FETCH_LOCATION = 'background-location-task';
      //const TASK_FETCH_LOCATION = 'background-location-test';
      TaskManager.unregisterTaskAsync(TASK_FETCH_LOCATION);
      Alert.alert('Stopping Automatic Background Tracking')
    } else {
      //const TASK_FETCH_LOCATION = 'background-location-test';
      //runTest();
      Alert.alert('Starting Automatic Background Tracking')
    }

    //STORE IN ASYNC STORAGE THE NEW TRACKING STATUS
    try {
      AsyncStorage.setItem('vpAutoTracking', JSON.stringify(!this.state.tracking))
    } catch (e) {
      console.log(e)
      console.log('something wrong with tracking (storage)')
    }

  };

  //FUNCTION: STORE COURTS LOCALLY 
  _storeTracking = async (key, value) => {
    try {
      await AsyncStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.log(error);
    }
  };


  readUserData = async () => {


    await AsyncStorage.getItem('user_info', (error, result) => {
      var res = JSON.parse(result)
      console.log('reading user data')
      try {
        this.setState({
          firstName: res[1],
          lastName: res[2],
          email: res[3]
        });

      } catch (e) { console.log(e) }
    });



  }



  question = () => {
    alert("If you are anonymous, your name will not be displayed in the CheckIn and Pre-CheckIn lists in the Players tab")
  }

  notifQuestion = () => {
    alert("If notifications annoy you, you can switch them off here.")
  }

  questionLocation = () => {
    alert("Permitting location tracking allows volleypal to check you in and out automatically. We do not store location data.")
  }
  render() {
    //console.log('TRACKER SETTING: ',this.props.reducer.tracking)

    return (
      <React.Fragment>
        <Header style={{ backgroundColor: '#5cb85c', height: 70, paddingTop: 0 }}>
          <Left>
            <Title style={{ color: 'white', fontSize: 30 }}>Profile</Title>
          </Left>

          <Right>
            <TouchableOpacity onPress={this.readUserData}>
              <MaterialCommunityIcons name="refresh" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.logout}>
              <MaterialCommunityIcons name="exit-run" size={30} color="white" />
            </TouchableOpacity>
          </Right>
        </Header>
        <Content padder>
          <Card>
            <CardItem header bordered>
              <View style={styles.cardContainer}>
                <Text style={styles.cartTitles}>User Id: </Text>
                <Text>{this.state.email}</Text>
              </View>
            </CardItem>
            <CardItem bordered>
              <Body>
                <View style={styles.cardContainer}>
                  <Text style={styles.cartTitles}>First Name: </Text>
                  <Text>{this.state.firstName}</Text>
                </View>
                <View style={styles.cardContainer}>
                  <Text style={styles.cartTitles}>Last Name: </Text>
                  <Text>{this.state.lastName}</Text>
                </View>
                {/* <View style={styles.cardContainer}>
                    <Text style={styles.cartTitles}>Check-Ins This Week: </Text>
                    <Text>{this.state.totalWeek}</Text>
                  </View>
                  <View style={styles.cardContainer}>
                    <Text style={styles.cartTitles}>Total Check-Ins: </Text>
                    <Text>{this.state.total}</Text>
                  </View> */}

              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Text style={styles.cartTitles}>Anonymous: </Text>
                {this.props.reducer.isAnanimous ? <Text>Yes</Text> : <Text>No</Text>}
                <TouchableOpacity onPress={this.question}>
                  <AntDesign style={{ marginLeft: 10 }} name="questioncircleo" size={24} color="black" />
                </TouchableOpacity>
              </Left>
              <Right>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={this.props.reducer.isAnanimous ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={this.toggleSwitch}
                  value={this.props.reducer.isAnanimous}
                />
              </Right>
            </CardItem>



            <CardItem>
              <Left>
                <Text style={styles.cartTitles}>Notifications: </Text>
                {this.props.reducer.isRunningNotification ? <Text>Yes</Text> : <Text>No</Text>}
                <TouchableOpacity onPress={this.notifQuestion}>
                  <AntDesign style={{ marginLeft: 10 }} name="questioncircleo" size={24} color="black" />
                </TouchableOpacity>
              </Left>
              <Right>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={this.props.reducer.isRunningNotification ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={this.toggleNotification}
                  value={this.props.reducer.isRunningNotification}
                />
              </Right>
            </CardItem>
            

            <CardItem>
              <Left>
                <Text style={styles.cartTitles}>Location Tracking: </Text>
                {JSON.parse(this.props.reducer.tracking) ? <Text>Yes</Text> : <Text>No</Text>}
                <TouchableOpacity onPress={this.questionLocation}>
                  <AntDesign style={{ marginLeft: 10 }} name="questioncircleo" size={24} color="black" />
                </TouchableOpacity>
              </Left>
              <Right>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={JSON.parse(this.props.reducer.tracking) ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={this.toggleTracking}
                  value={JSON.parse(this.props.reducer.tracking)}
                />
              </Right>
            </CardItem>
          </Card>


          <Button style={{ margin: 10, marginTop: 40 }}
            full
            rounded
            primary
            onPress={this.showModal}>
            <Text style={{ color: 'white' }}>Change Info</Text>
          </Button>

          <Button style={{ margin: 10, marginTop: 40 }}
            full
            rounded
            danger
            onPress={this.deleteAccount}>
            <Text style={{ color: 'white' }}>Delete My Account</Text>
          </Button>






          {/* <Button style ={{margin:10}}
                      full
                      rounded
                      primary
                      onPress={this.getCheckinData}>
                      <Text style = {{color:'white'}}>{this.state.showHistory ? 'Refresh Checkin History' : 'Show Checkin History'}</Text>
                    </Button> */}
          {/* { this.state.showHistory ?
                    <Button style ={{margin:10, marginTop: 5}}
                      full
                      rounded
                      primary
                      onPress={()=>Alert.alert('Data sharing is coming soon! Thank you for your patience.')}>
                      <Text style = {{color:'white'}}>Share my Data</Text>
                    </Button> : <View></View>
                    } */}

          {/* { this.state.showHistory ?
                     
                      this.state.data.map((item, index) => (
                        <View key = {index} style = {styles.item}>
                                <View style={styles.cardContainer}>
                                  <Text style={styles.cartTitles}>Name: </Text>
                                  <Text>{`${this.state.firstName} ${this.state.lastName}`}</Text>
                                </View>
                                <View style={styles.cardContainer}>
                                  <Text style={styles.cartTitles}>Checkin Site: </Text>
                                  <Text>{`${item.site_id}`}</Text>
                                </View>
                                <View style={styles.cardContainer}>
                                  <Text style={styles.cartTitles}>Checkin Time Stamp: </Text>
                                  <Text>{`${item.checkin_date_time.substring(0,10)} ${item.checkin_date_time.substring(11,16)}`}</Text>
                                </View>
                        </View>
                      ))  : <View></View>
                    } */}


        </Content>
        <ChangeInfo
          modalVisible={this.state.modalVisible}
          showModal={this.showModal}

        />

        <Button style={{ position: "absolute", bottom: "5%", right: '6%', borderRadius: 60, height: 70, width: 70 }}
          full
          rounded
          success
          onPress={this.gotQuestion}
        >

          <AntDesign name="questioncircleo" size={35} color="white" />
        </Button>
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
    setAnanimous: (x) => dispatch({ type: "SET_ANANIMOUS", value: x }),
    setNotifications: (x) => dispatch({ type: "SET_NOTIFICATIONS", value: x }),
    setTracking: (y) => dispatch({ type: "TRACKING", value: y })
  };
};



export default connect(mapStateToProps,
  mapDispachToProps
)(Profile);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  item: {
    //flex: 1,
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
    padding: 20,
    margin: 2,
    //borderColor: '#2a4944',
    borderRadius: 10,
    //idth: Layout.window.width - 20,
    //width:'100%',
    alignSelf: 'stretch',
    borderWidth: 1,
    backgroundColor: '#a7a6ba'
  },
  cardContainer: {
    //marginTop: 8,
    //paddingVertical: 15,
    //paddingHorizontal: 5,
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
  },
  cartTitles: {
    fontWeight: "bold"
  }
});
