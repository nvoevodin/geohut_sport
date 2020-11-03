import * as Notifications from 'expo-notifications'
const moment = require("moment");
const helpers = {
    notificationFunction: async function(){

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: false,
            }),
          });

          const trigger = {
            seconds: 40,
            repeats: true
          }

        //  const trigger = Platform.OS === 'ios'?{
            
        //     repeats: true,
            
      
        //       hour: 13,
        //       minute: 13
        
            
        //   }:{hour: 13,minute: 13,repeats: true,}

          //const trigger = {hour: 11,minute: 13,repeats: true,};

        Notifications.scheduleNotificationAsync({
            content: {
              title: "A good day to play volleyball?",
              body: 'Let us know if you are coming to play today!',
            },
            trigger,
          });

    },
    cancelNotificationFunction: async function(){
        Notifications.cancelAllScheduledNotificationsAsync()

        alert('Notifications Turned Off');
    }
}

export default helpers;