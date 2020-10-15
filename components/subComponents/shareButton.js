import React from 'react';
import { Share, View, Button } from 'react-native';


  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Hey, I am using VolleyPal app! Its a great app for volleyball players. You can find out more about it here: www.volleypal.site',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


  export default onShare;



