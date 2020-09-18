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
  apiKey: "AIzaSyB5s1qub81NaHS7nCm-8Qc0ClmiRKWPcok",
  authDomain: "pro-bono-4a811.firebaseapp.com",
  databaseURL: "https://pro-bono-4a811.firebaseio.com",
  projectId: "pro-bono-4a811",
  storageBucket: "pro-bono-4a811.appspot.com",
  messagingSenderId: "1095630938775",
  appId: "1:1095630938775:web:002b44e2b09d80656d3fd2",
  measurementId: "G-WRG4KNE2MK"

}


firebase.initializeApp(firebaseConfig)



import Home from './components/Home'
import Help from './components/Help'
import Profile from './components/Profile'
import Login from './components/Login'
import SignUp from './components/SignUp'
import StartScreen from './components/StartScreen'
import PageTemplate from './components/subComponents/Header'



export default class App extends Component {

  render(){

    return (
      <Provider store={ store }>
        <AppContainer/>
      </Provider>
    );
  
  }

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
    Help: {
      screen: Help,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          // <Icon name="comments" size={25} color={tintColor} />
          <Ionicons  name="ios-information-circle" size={25} color={tintColor}/>
        )
      }
    },
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


