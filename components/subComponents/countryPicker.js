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
import DATA from '../../constants/countries.json'

const countries = DATA.map(a => a.name);

  const Item = ({ title }) => (
    <View style = {{width:200, margin:7}}>
        
      <Text style = {{color:'white', fontSize: 30,textAlign: 'center'}}>{title}</Text>
      
    </View>
  );

class CountryPicker extends Component {
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
        `The country is ${title}. Correct?`,
        [
          {
            text: "Cancel",
            onPress: () => {
  
            },
            style: "cancel"
          },
          { text: "OK", onPress: () => {
            
     
            this.props.onModalOne()
            this.props.pickCountry(title)
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
          visible={this.props.reducer.countryPickerModal}
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
            width: 300,
            height: 400,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'rgba(67, 4, 63, 0.35)'
            }}>

                <Text style ={{color: 'white', fontSize:25, marginTop:15, fontWeight:'bold'}}>Country:</Text>
                
                <FlatList showsVerticalScrollIndicator ={false} style = {{margin:10}}
        data={countries}
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
      onModalOne: () => dispatch({ type: "MODAL_COUNTRY_PICKER", value: false}),
     // storePlayground: (name,id,lat,lon) => dispatch({ type: "STORE_PLAYGROUND", value: name,value1: id, value2:lat,value3:lon})
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(CountryPicker)