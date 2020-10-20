
import { connect } from 'react-redux';

import React, { Component} from "react";

import DateTimePickerModal from "react-native-modal-datetime-picker";

const moment = require("moment");



 
class PreCheckModal extends Component {



 
   handleConfirm = async (date) => {

   
      var a = new Date(moment().utc().format())

      var b = new Date(moment(date).utc().format())

  

      if ((b-a) < 0){
        alert('Select later time!')
      } else {
        fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/preCheck?time=${date}&site_id=${this.props.reducer.playgroundId}&first_name=${this.props.reducer.isAnanimous?"Anonimous":this.props.reducer.userId[1]}
          &last_name=${this.props.reducer.isAnanimous?"Player":this.props.reducer.userId[2]}&user_id=${this.props.reducer.userId[3]}`,
          { method: "POST" }
        ).catch((error) => {
          console.log(error)
        });



    alert(
      `Success! You are coming around ${moment(date).format('LT')}.`
    );


  this.props.storePreCheck()
      }
  
   
    


  };



  
  render() {
    
  return (
    
    
      <DateTimePickerModal
        isVisible={this.props.reducer.preCheckModal}
        mode="time"
        onConfirm={(date) =>{this.handleConfirm(moment(date).utc().format()),this.props.onModalTwo()}}
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