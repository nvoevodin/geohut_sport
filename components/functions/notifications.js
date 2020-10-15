import {Notifications} from 'expo';
import * as Permissions from 'expo-permissions';

const notificationFunction = async function() {

    
//console.log(moment.utc("2020-10-15T18:16:00").local().valueOf())
    const notification = {
        title: 'Hi there!',
        body: 'Are you coming to play today?',
        //android: { sound: true }, // Make a sound on Android
        //ios: { sound: true }, // Make a sound on iOS
      };
      //moment.utc("2020-10-15T18:30:00").local().valueOf() + 10000
      const options = {
        time: (new Date("2020-10-15T10:16:00")).getTime() + 10000, // Schedule it in 10 seconds
        repeat: 'day', // Repeat it daily
      };
      
      // ... somewhere before scheduling notifications ...
      const { status_notes } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      if (status_notes !== 'granted') {

        console.log('not granted')
        await Permissions.askAsync(Permissions.NOTIFICATIONS);
  
        // ... somewhere after requesting permission ...
        Notifications.scheduleLocalNotificationAsync(notification, options)      
      }
  
      // If you want to react even when your app is still in the
        // foreground, you can listen to the event like this:
         Notifications.addListener(() => {
           console.log('triggered!');
         });




  }
  
  export default notificationFunction;