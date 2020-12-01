import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity, Alert, Image,View} from 'react-native';
import {Container, Header, Content, List, ListItem, Icon, Button, Left,Right, Body, Title,Text, Tab, Tabs,TabHeading} from 'native-base';
import { connect } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import AddPlayground from "./addPlaygroundModal"
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-community/async-storage';
import { getDistance } from "geolib";
import * as Location from "expo-location";
import { Octicons } from '@expo/vector-icons'; 


class PlaygroundModal extends Component {

    state = {
         playgrounds: [],
         potential_sites: [],
         defaultCourtId: ''
    }

    componentDidMount() {
        this.getPlaygrounds()
        
    }

    getPlaygrounds = async () => {

    let location = await this.getCurrentLoc();
    
    fetch(`${global.x}/sites`)
    .then((res) => res.json())
    .then((res) => {

var distanceData = res.data.map( (i) =>  {
                       //test how far away the user is
                       let distance = this.calculateDistance(
                        parseFloat(location[0].coords.latitude),
                        parseFloat(location[0].coords.longitude),
                        i.latitude,
                        i.longitude
                      );

                      i["distance"] = distance["distance"]/1000

                      return i


                    
      })

     



       

    this.setState({playgrounds:distanceData})
    
    }).catch((error) => {
      console.log(error)
    });


    fetch(`${global.x}/potential_sites`)
    .then((res) => res.json())
    .then((res) => {
    this.setState({potential_sites:res.data})
    
    }).catch((error) => {
      console.log(error)
    });

    AsyncStorage.getItem('defaultCourt', (error, result) => {
   
      var res = JSON.parse(result) 
      try {
      this.setState({defaultCourtId: res[1]})
      } catch(e){}
    });

}

//FUNCTION: STORE COURTS LOCALLY 
_storeCourts = async (key,value) => {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.log(error);
  }
};

pageRefresh = () => {

  
fetch(`${global.x}/sites`)
.then((res) => res.json())
.then((res) => {
this.setState({playgrounds:res.data})
this._storeCourts('courts',res.data)
}).catch((error) => {
  console.log(error)
});




fetch(`${global.x}/potential_sites`)
.then((res) => res.json())
.then((res) => {
this.setState({potential_sites:res.data})

}).catch((error) => {
  console.log(error)
});

AsyncStorage.getItem('defaultCourt', (error, result) => {

  var res = JSON.parse(result) 
  try {
  this.setState({defaultCourtId: res[1]})
  } catch(e){}
});

alert('Refreshed')

}


makeDefault =(name,id,lat,lon)=>{
  Alert.alert(
    `${name} selected.`,
    `Do you want to make ${name} your default court?`,
    [
      {
        text: "No",
        onPress: () => {
  
        },
        style: "cancel"
      },
      { text: "Yes", onPress: () => {
  
        this.setState({defaultCourtId:id})
  
        try {
          AsyncStorage.setItem('defaultCourt', JSON.stringify([name,id,lat,lon]))
        } catch (e) {
          console.log('something wrong (storage)')
        }
  
        alert(`Nice! ${name} is your new default court.`)
      } }
    ],
    { cancelable: false }
  );
}

selectPlayground = (name,id,lat,lon) => {
this.props.storePlayground(name,id,lat,lon)



}

openClose = () => {
  this.props.onModalOne(),this.props.addPlaygroundModal()
}

confirmCourt = (site, lat, lon) => {
  
  Alert.alert(
    "Courts Confirmation",
    "By clicking OK, you confirm that these courts (or this court) really exists! Please do not falsly confirm as this ruins the experience for everyone!",
    [
      {
        text: "Cancel",
        onPress: () => {

        },
        style: "cancel"
      },
      { text: "OK", onPress: async () => {
        //console.log(site)

        const value = await AsyncStorage.getItem('confirmed')

                //get location
                let location = await this.getCurrentLoc();

                //test how far away the user is
                let distance = await this.calculateDistance(
                  parseFloat(location[0].coords.latitude),
                  parseFloat(location[0].coords.longitude),
                  lat,
                  lon
                );
                //console.log("distance: ", distance['distance']);

        if(distance['distance'] > 350) {
          alert('Cant confirm! Must be at the location!')

        } else if (value === site){
          
          //console.log(value)
          alert('Can only confirm once!')
        } else {

          await fetch(
            // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
            `${global.x}/confirm_potential_sites?site_id=${site}`,
            { method: "PUT" }
          ).catch((error) => {
            console.log(error)
          })
  
          try {
            await AsyncStorage.setItem('confirmed', site)
          } catch (e) {
            console.log('something wrong (storage)')
          }
  
  alert('Thank you! Your confirmation is recorded.')

        }


} }
    ],
    { cancelable: false }
  );
}

getCurrentLoc = async () => {
  try {
    let location = await Location.getCurrentPositionAsync({});
    location = await JSON.stringify(location);
    location = await eval("(" + "[" + location + "]" + ")");
    //location && console.log(location[0].coords.latitude);
    return location;
  } catch (e) {
    Alert.alert("cannot get current location, try again or ask for help");
  }
};



calculateDistance = (start_x,start_y, end_x,end_y, name) => {
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
      accuracy = 10
    );
   
    //checkin(distance);
    
      return {name: name, distance:distance};  
    } catch (error) {
    console.log(error)
  }
}


  render() {

 
      
    return (
        <React.Fragment>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.reducer.playgroundModal}
          //visible={this.props.reducer.playgroundModal}
          >

<Container>
        <Header style = {{backgroundColor:'#e3e8e6'}}>
        <Left>
            <Button transparent onPress={this.props.onModalOne}>
              <Icon name='arrow-back' style = {{color:'black'}}/>
            </Button>
          </Left>
          <Body>
            <Title style = {{color:'black'}}>Select Courts</Title>
          </Body>
          <Right>
          <Button transparent onPress={this.pageRefresh}>
          <MaterialCommunityIcons name="refresh" size={26} color="black" />
            </Button>
          <Button transparent onPress={this.openClose}>
          <Entypo name="plus" size={28} color="black" />
            </Button>
          </Right>
        </Header>
        <Tabs tabBarUnderlineStyle={{backgroundColor:'grey'}}>
        <Tab tabStyle ={{backgroundColor: '#e3e8e6'}} activeTextStyle={{color: 'grey', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#e3e8e6'}} textStyle={{color: 'grey', fontWeight: 'normal'}} heading="Live Courts">
        
        <Content>
          <List>
            <ListItem>
              <View style={{flexDirection:'row', flex:1, justifyContent:'space-between'}}>

              
              <View style={{flexDirection:'row'}}>
              <Octicons name="settings" size={24} color="black" />
              <Text style = {{marginLeft:5,fontSize:13}}>Filters</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
<Text style= {{fontSize:13}}>New York | Distance | Beach | Test | Testing</Text>
              </View>
              </View>
            </ListItem>
          {this.state.playgrounds.map((object,index) =>
          
                        <ListItem  key = {index}>
                          <TouchableOpacity style = {{flexDirection:'row'}} onPress={() => {this.selectPlayground(object["site_name"], object["site_id"], object["latitude"], object["longitude"]),  this.props.checkIfChecked(),this.props.checkIfPreChecked()}}>
                
                <Image
        style={styles.tinyLogo}
        source={{
          uri: 'https://www.fivb.org/Vis2009/Images/GetImage.asmx?No=90913&type=Press&maxSize=920',
        }}
      />
              {/* <Text>{object["site_name"]}</Text> */}
            
              
                <View style = {{marginLeft:10, flex:1, justifyContent:'space-between'}}>
                  <View style={{alignSelf:'flex-start'}}>
                  <Text style = {{fontWeight:'bold'}}>{object["site_name"]}</Text>
                    </View>
                 <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                   <View>
                   <Text>New York</Text>
                   </View>
                 
                <View>
                <Text>{object["distance"]} km</Text>
                </View>
                 
                
                 </View>
     
                   <View>
                   {this.state.defaultCourtId === object["site_id"]?
                   <Button style = {{textAlign: 'center', margin: 'auto',height: 35}}
                   onPress ={() => {this.makeDefault(object["site_name"], object["site_id"], object["latitude"], object["longitude"])}}
                   success
                   disabled >
                    <Text style = {{fontSize:10}}>Default</Text>
                    </Button>:
                                <Button style = {{textAlign: 'center', margin: 'auto',height: 35}}
                                onPress ={() => {this.makeDefault(object["site_name"], object["site_id"], object["latitude"], object["longitude"])}}
                                info >
                                 <Text style = {{fontSize:10}}>Default?</Text>
                                 </Button>
  }
                   </View>
          
                </View>
                 {/* {this.state.defaultCourtId === object["site_id"]?<Text>default</Text>:null} */}
            {/* <Button onPress={() => {this.selectPlayground(object["site_name"], object["site_id"], object["latitude"], object["longitude"]), this.props.onModalOne(), this.props.checkIfChecked(),this.props.checkIfPreChecked()}}>
              <Icon name='arrow-forward'/>
            </Button> */}
          
          </TouchableOpacity>
            </ListItem>
          

        
          )}
          </List>
        </Content>
        </Tab>
        <Tab tabStyle ={{backgroundColor: '#e3e8e6'}} activeTextStyle={{color: 'grey', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#e3e8e6'}} textStyle={{color: 'grey', fontWeight: 'normal'}} heading="Potential Courts">


<Content>
          <List>
          {this.state.potential_sites.map((object,index) =>
          
            <ListItem key = {index}>
                <Left>
              <Text>{object["site_name"]}</Text>
              </Left>
           
              <Button disabled = {false} style ={{backgroundColor: '#e3e8e6'}} onPress={() => {this.confirmCourt(object["site_id"], object["latitude"], object["longitude"])}}>
                <Text style = {{color: 'grey'}}>Confirm | {5 - object["confirms"]} left</Text>
                <Icon name='thumbs-up' style={{fontSize: 25, color: 'green'}}/>
            </Button>
         
              
            </ListItem>
        
          )}
          </List>
        </Content>

          </Tab>

        </Tabs>
      </Container>


        </Modal>
        <AddPlayground playgrounds = {this.state.playgrounds}/>
        </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({

  tinyLogo: {
    width: 100,
    height: 100,
    
  },

});



const mapStateToProps = (state) => {
    
    const { reducer } = state
    return { reducer }
  };

  const mapDispachToProps = dispatch => {
    return {
      onModalOne: () => dispatch({ type: "CLOSE_MODAL_1", value: false}),
      addPlaygroundModal: () => dispatch({ type: "CLOSE_MODAL_3", value: true}),
      storePlayground: (name,id,lat,lon) => dispatch({ type: "STORE_PLAYGROUND", value: name,value1: id, value2:lat,value3:lon})
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(PlaygroundModal)

