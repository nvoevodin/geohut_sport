import * as Permissions from "expo-permissions";
const moment = require("moment");
import helpers from './localNotification'
import AsyncStorage from '@react-native-community/async-storage';


const permissionNotFunc = async function() {
  

  
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
      console.log('existing not granted')
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.log('final not granted')
    return false;
  }

  helpers.notificationFunction()


  // try {
  //   AsyncStorage.setItem('notifications', JSON.stringify(true))
  // } catch (e) {
  //   console.log(e)
  //   console.log('something wrong (storage)')
  // }


  console.log('granted')
  return true;
};


export default permissionNotFunc


  
