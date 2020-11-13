import * as TaskManager from 'expo-task-manager';
import * as Location from "expo-location";
const TASK_FETCH_LOCATION = 'background-location-test';

export const configureBgTasks = async () => {
  TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data, error }) => {
  
    if (error) {
      // Error occurred - check `error.message` for more details.
      console.log(error);
      return;
    }
    if (data) {

      //get location data from background
      const { locations } = data;
      console.log(locations);
    }
})
}

export const runTest = async () => {
    
       
          await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
            accuracy: Location.Accuracy.Balanced,
            //timeInterval: 300000,
            timeInterval: 1000,
            //distanceInterval: 5, // minimum change (in meters) betweens updates
            //deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
            // foregroundService is how you get the task to be updated as often as would be if the app was open
            foregroundService: {
              notificationTitle: 'Using your location for VolleyPal',
              notificationBody: 'To turn off, go back to the app and toggle tracking.',
            },
            pausesUpdatesAutomatically: false,
          });
    
   
}
