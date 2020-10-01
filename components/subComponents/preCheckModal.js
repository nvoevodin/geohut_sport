
import { connect } from 'react-redux';

import React, { Component} from "react";

import DateTimePickerModal from "react-native-modal-datetime-picker";
 
class PreCheckModal extends Component {


 
//   handleConfirm = () => {
   
//     this.props.onModalTwo
//   };
  
  render() {
    console.log(this.props.reducer.preCheckModal)
  return (
    
    
      <DateTimePickerModal
        isVisible={this.props.reducer.preCheckModal}
        mode="time"
        onConfirm={this.props.onModalTwo}
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
      onModalTwo: () => dispatch({ type: "CLOSE_MODAL_2", value: false})
      
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(PreCheckModal)