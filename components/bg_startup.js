import * as TaskManager from 'expo-task-manager';
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { AsyncStorage } from 'react-native';
import {  Platform   } from "react-native";
//import * as firebase from "firebase";

const TASK_FETCH_LOCATION = 'background-location-task';
//const TASK_CHECK_GEOFENCE = 'TASK_CHECK_GEOFENCE';
const moment = require("moment");

// SEE IF A PERSON HAS CHECKED IN

// IF A PERSON IS CHECKED IN ATTEMPT TO CHECK THEM OUT

// IF A PERSON IS CHECKED OUT ATTEMPT TO CHECK THEM IN

//uid = firebase.auth().currentUser.uid;

//FUNCTION: GET ALL SITES
const getCourts = async () => {
  const value = await AsyncStorage.getItem('courts').then(req => JSON.parse(req))
  if(value !== null) {
    return value
  } else {
    //console.log('retrieving courts...')
    let response = await fetch(`${global.x}/sites`)
    .then(res => res.json())
    .then(res => { 
      //console.log('res',res["data"]) 
      return res["data"]
    })
    .catch((error) => {
      console.log(error)
    });
    _storeCourts('courts',response)
    return response
  }
}

//FUNCTION: SORT
const compare = ( a, b ) => {
  if ( a.distance < b.distance ){
    return -1;
  }
  if ( a.distance > b.distance ){
    return 1;
  }
  return 0;
}

//FUNCTION: PULL ALL CHECKINS TO SEE WHOS THERE
const checkList = async (user_id) => {
  let response = await fetch(`${global.x}/allCheckedIn`)
    .then(res => res.json())
    .then(res => { 
      //console.log('searching for user: ', user_id);
      //console.log('res',res["data"].filter(user=>user.user_id.includes(user_id))) 
      return res["data"].filter(user=>user.user_id.includes(user_id))
    })
    .catch((error) => {
      console.log(error)
    });
    return response
}

//FUNCTION: PULL USER DATA TO SEE IF THEY EXIST
const checkUserStatus = async (user_id) => {
  let response = await fetch(`${global.x}/checkincheck/${user_id}`)
    .then(res => res.json())
    .then(res => { 
      //console.log('res',res["data"]) 
      return res["data"]
    })
    .catch((error) => {
      console.log(error)
    });
    return response
}


//FUNCTION: HANDLE MAIN CHECKIN
const checkin = async (nearestSite, user_id, fname, lname, distance, anonymous,checkin_type) => {

    //if(distance < proximityMax) {
      //console.log('checking you IN via function...', distance)
      //Alert.alert(`you r checked in, distance is: ${distance}`)
      //console.log('CHECKING IN....... THIS PERSON.......',anonymous)
      try {
        fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/add?time=${
            moment().utc().format("YYYY-MM-DD HH:mm:ss").substr(0, 18) + "0"
          }&site_id=${nearestSite}&first_name=${anonymous ? 'Anonymous' :fname}
          &last_name=${anonymous ? 'Player' : lname }&user_id=${user_id}&checkin_type=${checkin_type}&distance=${distance}`,
          { method: "POST" }
        ).catch((error) => {
          console.log(error)
        });   
  
    } catch(error) {
      console.log(error);
    }
}

//FUNCTION: HANDLE MAIN CHECKOUT
const checkout = async (nearestSite, user_id, distance, checkin_type) => {
  
  //if(distance > proximityMax) {
    //console.log('checking you OUT via function...')        
    //Alert.alert(`you r checked out, distance is: ${distance}`)
      //FIRST CHECK THE PERSON OUT
        await fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/update?site_id=${nearestSite}&user_id=${user_id}&distance=${distance}&checkin_type=${checkin_type}`,
          { method: "PUT" }
        ).catch((error) => {
          console.log(error)
        })
        


      //NEXT COPY THEIR RECORD TO STORAGE
        await fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/addToStorage?site_id=${nearestSite}&user_id=${user_id}`,
          { method: "POST" }
        ).catch((error) => {
          console.log(error)
        })

  
      //THEN DELETE THE RECORD FROM THE MAIN TABLE
        await fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/delete?site_id=${nearestSite}&user_id=${user_id}`,
            { method: "DELETE" }
            ).catch((error) => {
             console.log(error)
          })
      
   
}

//FUNCTION: CALCULATES DISTANCE
const  calculateDistance = (start_x,start_y, end_x,end_y) => {
  try {
    let distance = getDistance(
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
    //console.log('distanceFromCourt: ',distance)
    //checkin(distance);
      return(distance);  
    } catch (error) {
    console.log(error)
  }
}

//FUNCTION: STORE COURTS LOCALLY 
const _storeCourts = async (key,value) => {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.log(error);
  }
};


export const configureBgTasks = async ({ user, storePlayground, storePlaygroundAuto, anonymous, autoCheckin, autoCheckout }) => {
  const proximityMax = 250;
  //console.log('starting tracking...', user);
  //console.log('*******is this person checked in already?? ', submitted)
  //console.log('**********is this person anonymous???', anonymous)
  //console.log('proximityMax is:', proximityMax)
  //checkUserStatus().then(res=>console.log('******',res))
 
  TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data, error }) => {
  
    if (error) {
      // Error occurred - check `error.message` for more details.
      console.log(error);
      return;
    }
    if (data) {

      //get location data from background
      const { locations } = data;
      //console.log(locations);

      //check current distance against all sites, 
      //return the closest site and distance to current location
       let map1 = getCourts().then(res=>{
         let response = res.map((court) => ({
           ...court,
           distance: calculateDistance(
             court.latitude,
             court.longitude,
             locations[0].coords.latitude,
             locations[0].coords.longitude
           )
         })).sort(compare)[0];
         return response
       })

      //RESOLVE PROMISE AND GRAB DISTANCE
      //let distance = await map1.then(nearestSite=>nearestSite.distance);
      //console.log('MAKING SURE DISTANCE IS AVAILABLE:',distance)

      //STORE PLAYGROUND
      map1.then(nearestSite=>{
        storePlayground(nearestSite.site_name,nearestSite.site_id,nearestSite.latitude,nearestSite.longitude)
        storePlaygroundAuto(nearestSite.site_id);
        //console.log('CURRENT DISTANCE FROM SITE: ', nearestSite.distance)
          let sqlStamp = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
        fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/addTracking?datetime=${sqlStamp}&latitude=${locations[0].coords.latitude}&longitude=${locations[0].coords.longitude}&nearest_site=${nearestSite.site_id}&email=${user.email}&distance=${nearestSite.distance}`,
          { method: "POST" }
          ).catch((error) => {
            console.log(error)
          })
      })


      //PULL LIST
        map1.then(nearestSite => {
          //using user data attempt to check in or checkout based on distance logic
          checkList(user.email)
          .then(res=>{
            console.log(res);
            //condition 1. user is not signed in at a court and within proximityMax -->SIGN THEM IN
            if ((res === undefined || res.length == 0) & nearestSite.distance <= proximityMax ) {
              //console.log(nearestSite.site_id, user_id, user.firstName, user.lastName, nearestSite.distance)
              console.log('CHECKIN IN...');
               checkin(nearestSite.site_id,
                          user.email,
                          user.first_name,
                          user.last_name,
                          nearestSite.distance,
                          anonymous,
                          'false',
                          nearestSite.distance
                          );

               //send value reducer - change color to check in
               setTimeout(
                 function() {
                   autoCheckin()
                 },
                 1000
               );
            }
            //condition 2. user is not signed in at a court and outside proximityMax -->NO SIGN IN
            else if ((res === undefined || res.length == 0) & nearestSite.distance > proximityMax) {
              console.log('TOO FAR AWAY...');
            } 
            //condition 3. user is signed in at a court and still within proximityMax -->NO SIGN IN
            else if ((res !== undefined) & nearestSite.distance <= proximityMax) {
              console.log('ALREADY SIGNED IN...');
            } 
            //confition 4. user is signed in at a court and outside the proximityMax now -->SIGN OUT
            else if ((res !== undefined) & nearestSite.distance > proximityMax) {
               checkout(
                       nearestSite.site_id,
                       user.email, 
                       nearestSite.distance,
                       'true')

               //send value reducer - change color to check in
               setTimeout(
                 function() {
                   autoCheckout()
                 },
                 1000
               );
            }
        })
        }) 
           
    }
})
}



/**
 *  map1.then(nearestSite => {
            //using user data attempt to check in or checkout based on distance logic
            checkUserStatus(user.email)
            .then(res=>{
              //condition 1. user is not signed in at a court and within proximityMax -->SIGN THEM IN
              if ((res === undefined || res.length == 0) & nearestSite.distance <= proximityMax ) {
                //console.log(nearestSite.site_id, user_id, user.firstName, user.lastName, nearestSite.distance)
                checkin(nearestSite.site_id, user.email, user.first_name, user.last_name, nearestSite.distance);
                
                //send value reducer - change color to check in
                autoCheckin()
                
                //Alert.alert(`you were checked in at: ${nearestSite.distance}meters`)
              }
              //condition 2. user is not signed in at a court and outside proximityMax -->NO SIGN IN
              else if ((res === undefined || res.length == 0) & nearestSite.distance > proximityMax) {
                console.log('do nothing');
              } 
              //condition 3. user is signed in at a court and still within proximityMax -->NO SIGN IN
              else if ((res !== undefined || res.length == 0) > 0 & nearestSite.distance <= proximityMax) {
                console.log('do nothing');
              } 
              //confition 4. user is signed in at a court and outside the proximityMax now -->SIGN OUT
              else if ((res !== undefined || res.length == 0) > 0 & nearestSite.distance > proximityMax) {
                checkout(nearestSite.site_id, user.email, nearestSite.distance)
                //Alert.alert(`You were checked out at: ${nearestSite.distance}meters`)
    
                //send value reducer - change color to check in
                //check_in(false);
                autoCheckout()
              }
          })
          }) 

          //   let sqlStamp = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
      // fetch(
      //   // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
      //   `${global.x}/addTracking?datetime=${sqlStamp}&latitude=${locations[0].coords.latitude}&longitude=${locations[0].coords.longitude}&nearest_site=${nearestSite.site_id}&email=${user.email}&distance=${nearestSite.distance}`,
      //   { method: "POST" }
      //   ).catch((error) => {
      //     console.log(error)
      //   })
 *      
* 
 */



 /**
  * 
  *          
  * 
  * 
  * 
  * 
  *         map1.then(nearestSite => {
            //using user data attempt to check in or checkout based on distance logic
            //checkUserStatus(user.email)
            //.then(res=>{
              //condition 1. user is not signed in at a court and within proximityMax -->SIGN THEM IN
              if (submitted==false & nearestSite.distance <= proximityMax ) {
                //console.log(nearestSite.site_id, user_id, user.firstName, user.lastName, nearestSite.distance)
                console.log('SIGNING U IN AUTOMATICALLY')
                checkin(nearestSite.site_id, user.email, user.first_name, user.last_name, nearestSite.distance);
                
                //send value reducer - change color to check in
                autoCheckin()
                
                //Alert.alert(`you were checked in at: ${nearestSite.distance}meters`)
              }
              //condition 2. user is not signed in at a court and outside proximityMax -->NO SIGN IN
              else if (submitted==false & nearestSite.distance > proximityMax) {
                console.log('TOO FAR AWAY');
              } 
              //condition 3. user is signed in at a court and still within proximityMax -->NO SIGN IN
              else if (submitted==true & nearestSite.distance <= proximityMax) {
                console.log('ALREADY SIGNED IN ');
              } 
              //confition 4. user is signed in at a court and outside the proximityMax now -->SIGN OUT
              else if (submitted == true & nearestSite.distance > proximityMax) {
                checkout(nearestSite.site_id, user.email, nearestSite.distance)
                //Alert.alert(`You were checked out at: ${nearestSite.distance}meters`)
    
                //send value reducer - change color to check in
                //check_in(false);
                autoCheckout()
              }
          //})
          }) 
          
  *
  *
  *           map1.then(nearestSite => {
            //using user data attempt to check in or checkout based on distance logic
            //checkUserStatus(user.email)
            //.then(res=>{
              //condition 1. user is not signed in at a court and within proximityMax -->SIGN THEM IN
              if ((records === records || records.length == 0) & nearestSite.distance <= proximityMax ) {
                //console.log(nearestSite.site_id, user_id, user.firstName, user.lastName, nearestSite.distance)
                checkin(nearestSite.site_id, user.email, user.first_name, user.last_name, nearestSite.distance);
                
                //send value reducer - change color to check in
                autoCheckin()
                
                //Alert.alert(`you were checked in at: ${nearestSite.distance}meters`)
              }
              //condition 2. user is not signed in at a court and outside proximityMax -->NO SIGN IN
              else if ((records === undefined || records.length == 0) & nearestSite.distance > proximityMax) {
                console.log('do nothing');
              } 
              //condition 3. user is signed in at a court and still within proximityMax -->NO SIGN IN
              else if ((records !== undefined || records.length == 0) > 0 & nearestSite.distance <= proximityMax) {
                console.log('do nothing');
              } 
              //confition 4. user is signed in at a court and outside the proximityMax now -->SIGN OUT
              else if ((records !== undefined || records.length == 0) > 0 & nearestSite.distance > proximityMax) {
                checkout(nearestSite.site_id, user.email, nearestSite.distance)
                //Alert.alert(`You were checked out at: ${nearestSite.distance}meters`)
    
                //send value reducer - change color to check in
                //check_in(false);
                autoCheckout()
              }
          //})
          })  
  */

  /* 
      //let sqlStamp = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
      //fetch(
        // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
      //  `${global.x}/addTracking?datetime=${sqlStamp}&latitude=${locations[0].coords.latitude}&longitude=${locations[0].coords.longitude}`,
      //  { method: "POST" }
      //  ).catch((error) => {
      //    console.log(error)
      //  })


      map1.then(nearestSite => {
            
              //condition 1. user is not signed in at a court and within proximityMax -->SIGN THEM IN
              if ( (submitted=='FALSE' || submitted == undefined) & nearestSite.distance <= proximityMax ) {
                //console.log(nearestSite.site_id, user_id, user.firstName, user.lastName, nearestSite.distance)
                //console.log('SIGNING U IN AUTOMATICALLY FROM BGSTARTUP, YOUR CHECKED IN STATUS IS: ',submitted);
                // checkin(nearestSite.site_id,
                //         user.email,
                //         user.first_name,
                //         user.last_name,
                //         nearestSite.distance,
                //         anonymous,
                //         submitted,
                //         nearestSite.distance
                //         );

             
                //     autoCheckin();
                    console.log('CHECKING YOU IN...')
          
                
              }
              //condition 2. user is not signed in at a court and outside proximityMax -->NO SIGN IN
              else if ( (submitted=='FALSE' || submitted == undefined) & nearestSite.distance > proximityMax) {
                console.log('TOO FAR AWAY');
              } 
              //condition 3. user is signed in at a court and still within proximityMax -->NO SIGN IN
              else if (submitted=='TRUE' & nearestSite.distance <= proximityMax) {
                console.log('ALREADY SIGNED IN ');
              } 
              //confition 4. user is signed in at a court and outside the proximityMax now -->SIGN OUT
              else if (submitted == 'TRUE' & nearestSite.distance > proximityMax) {
                console.log('CHECKING YOU OUT...')
                // checkout(
                //    nearestSite.site_id,
                //    user.email, 
                //    nearestSite.distance,
                //    submitted)
                   
               
                //   autoCheckout();
  
              }
          })
   */