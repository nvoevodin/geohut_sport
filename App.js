import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import * as firebase from 'firebase';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import ourReducer from './store/reducer';
const store = createStore(ourReducer);


//Init Firebase
const firebaseConfig ={
  apiKey: "AIzaSyC-DLOVYQwdqibU8ZrBL7TnKx-H7HxmoPQ",
  authDomain: "geohutsport.firebaseapp.com",
  databaseURL: "https://geohutsport.firebaseio.com",
  projectId: "geohutsport",
  storageBucket: "geohutsport.appspot.com",
  messagingSenderId: "27754345566",
  appId: "1:27754345566:web:642a595875913337dab0cf",
  measurementId: "G-5P1D7NPV2E"

}


firebase.initializeApp(firebaseConfig)



import Home from './components/Home'
import Help from './components/Help'
import Profile from './components/Profile'
import Login from './components/Login'
import SignUp from './components/SignUp'
import StartScreen from './components/StartScreen'
import PageTemplate from './components/subComponents/Header'
import Players from './components/Players'



export default class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { loading: true };
  // }

  // async componentDidMount() {
  //   await Font.loadAsync({
  //     Roboto: require('native-base/Fonts/Roboto.ttf'),
  //     Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
  //   });
  //   this.setState({ loading: false });
  // }
  

  render(){
    // if (this.state.loading) {
    //   return (
    //     <Root>
    //       <AppLoading />
    //     </Root>
    //   );
    // } else {
    return (
      
      <Provider store={ store }>
        <AppContainer/>
      </Provider>
    );
    }
  //}

}

const bottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons  name="ios-home" size={25} color={tintColor}/>
          // <Icon name="qrcode" size={25} color={tintColor} />
        )
      }
    },
    Players: {
      screen: Players,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          // <Icon name="comments" size={25} color={tintColor} />
          <Ionicons name="ios-people" size={25} color={tintColor} />
        )
      }
    },
    // Help: {
    //   screen: Help,
    //   navigationOptions: {
    //     tabBarIcon: ({ tintColor }) => (
    //       // <Icon name="comments" size={25} color={tintColor} />
    //       <Ionicons  name="ios-information-circle" size={25} color={tintColor}/>
    //     )
    //   }
    // },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          // <Icon name="search" size={25} color={tintColor} />
          <Ionicons  name="md-person" size={25} color={tintColor}/>
        )
      }
    },


  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: '#eb6e3d'
    }
  }
);






const RootSwitch = createSwitchNavigator({ 
StartScreen,
SignUp,
  Login,
  bottomTabNavigator
  });

const AppContainer = createAppContainer(RootSwitch);


