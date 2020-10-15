import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList
} from "react-native";
import moment from "moment";
import { MaterialIcons } from '@expo/vector-icons'; 
import { connect } from 'react-redux';
const DATA = [...Array(200).keys()]


  const Item = ({ title }) => (
    <View style = {{width:70, margin:7}}>
        
      <Text style = {{color:'white', fontSize: 30,textAlign: 'center'}}>{title}</Text>
      
    </View>
  );

class Report extends Component {
  state = {
    modalVisible: true
    
  };


  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {this.selectNumber(item)}}>
    <Item title={item} />
    </TouchableOpacity>
  );

  selectNumber = (title) =>{

    Alert.alert(
        "Confirm.",
        `There are ${title} people at the courts. Correct?`,
        [
          {
            text: "Cancel",
            onPress: () => {
  
            },
            style: "cancel"
          },
          { text: "OK", onPress: () => {


            fetch(
                // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
                `${global.x}/live_courts_info?time=${
                  moment().utc().format("YYYY-MM-DD HH:mm:ss").substr(0, 18) + "0"
                }&site_id=${this.props.reducer.playgroundId}&first_name=${this.props.reducer.isAnanimous?"Anonimous":this.props.reducer.userInfo.firstName}
                &last_name=${this.props.reducer.isAnanimous?"Player":this.props.reducer.userInfo.lastName}&count=${parseInt(title)}`,
                { method: "POST" }
              ).catch((error) => {
                console.log(error)
              });
            
     
            this.props.onModalOne()
            this.props.modifyReport(parseInt(title))
            alert('Thank You!')
          } }
        ],
        { cancelable: false }
      );
     
  }

 

  render() {

  
   

    return (
   
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.reducer.reportModal}
          propagateSwipe={true}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >

<View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'}}>

    <SafeAreaView style={{
        borderRadius:60,
            width: 250,
            height: 350,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'rgba(67, 4, 63, 0.35)'
            }}>

                <Text style ={{color: 'white', fontSize:23, marginTop:15, fontWeight:'bold'}}>People at Courts:</Text>
                
                <FlatList showsVerticalScrollIndicator ={false} style = {{margin:10}}
        data={DATA}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => 'key'+index}
      />

              
                  
                    
                
    
    </SafeAreaView>
    <TouchableOpacity onPress={this.props.onModalOne}>
    <MaterialIcons style = {{marginTop: 15}} name="cancel" size={40} color="black" />
    </TouchableOpacity>
    </View>
        </Modal>

    );
  }
}



const mapStateToProps = (state) => {
    
    const { reducer } = state
    return { reducer }
  };

  const mapDispachToProps = dispatch => {
    return {
      onModalOne: () => dispatch({ type: "MODAL_REPORT", value: false}),
     // storePlayground: (name,id,lat,lon) => dispatch({ type: "STORE_PLAYGROUND", value: name,value1: id, value2:lat,value3:lon})
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(Report)