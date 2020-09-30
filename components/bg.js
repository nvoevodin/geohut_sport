import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { Alert } from "react-native";

const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';
const TASK_CHECK_GEOFENCE = 'TASK_CHECK_GEOFENCE';

export const configureBgTasks = ({ setEnterRegion }) => {
    
    TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
      if (error) {
        console.error(error);
        return;
      }
      const [location] = locations;
      try {
          console.log('tracking in background...',location);
         } catch (err) {
        console.error(err);
      }
    });
    
    
    // 3 Define geofencing task
    TaskManager.defineTask(TASK_CHECK_GEOFENCE, ({ data: { eventType, region }, error }) => {
      if (error) {
        // check `error.message` for more details.
        return;
      }
      if (eventType === Location.GeofencingEventType.Enter) {
        console.log("You've entered region:", region);
        //setEnterRegion({ region });
        Alert.alert('You just entered region')
        const final  = region
        return final
      } else if (eventType === Location.GeofencingEventType.Exit) {
        console.log("You've left region:", region);
        //setEnterRegion({ region });
        Alert.alert('You just left region')
        const final  = region
        return final
      }
    });


    }
    