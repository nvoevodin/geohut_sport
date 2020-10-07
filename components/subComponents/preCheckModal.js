
import { connect } from 'react-redux';

import React, { Component} from "react";

import DateTimePickerModal from "react-native-modal-datetime-picker";

const moment = require("moment");


//let x = 'http://10.244.57.219:3002'

//let x = 'http://192.168.2.9:3007'
let x = 'https://volleybuddy.metis-data.site'
 
class PreCheckModal extends Component {



 
   handleConfirm = async (date) => {
   console.log(date)
    

                fetch(
                  // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
                  `${x}/preCheck?time=${date}&site_id=${this.props.reducer.playgroundId}&first_name=${this.props.reducer.userInfo.firstName}
                  &last_name=${this.props.reducer.userInfo.lastName}&user_id=${this.props.reducer.userInfo.user_id}`,
                  { method: "POST" }
                ).catch((error) => {
                  console.log(error)
                });
      
  
      
            alert(
              `Success! You are coming around ${moment(date).format('LT')}.`
            );
       

          this.props.storePreCheck()
  };



  
  render() {
    console.log(this.props.reducer.preCheckModal)
  return (
    
    
      <DateTimePickerModal
        isVisible={this.props.reducer.preCheckModal}
        mode="time"
        onConfirm={(date) =>{this.handleConfirm(moment(date).format()),this.props.onModalTwo()}}
        onCancel={this.props.onModalTwo}
      />
   
  )
}
}
 


const mapStateToProps = (state) => {
    
    const { reducer } = state
    return { reducer }
  };

  const mapDispachToProps = dispatch => {
    return {
      onModalTwo: () => dispatch({ type: "CLOSE_MODAL_2", value: false}),
      storePreCheck: () => dispatch({ type: "STORE_PRECHECK", value: true})
      
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(PreCheckModal)