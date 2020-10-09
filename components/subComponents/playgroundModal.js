import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity, Alert} from 'react-native';
import {Container, Header, Content, List, ListItem, Icon, Button, Left,Right, Body, Title,Text, Tab, Tabs,TabHeading} from 'native-base';
import { connect } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import AddPlayground from "./addPlaygroundModal"

import AsyncStorage from '@react-native-community/async-storage';




class PlaygroundModal extends Component {

    state = {
         playgrounds: [],
         potential_sites: []
    }

    componentDidMount() {
        this.getPlaygrounds()
        
    }

    getPlaygrounds = () => {
    fetch(`${global.x}/sites`)
    .then((res) => res.json())
    .then((res) => {
    this.setState({playgrounds:res.data})
    
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

}

selectPlayground = (name,id,lat,lon) => {
this.props.storePlayground(name,id,lat,lon)


}

openClose = () => {
  this.props.onModalOne(),this.props.addPlaygroundModal()
}

confirmCourt = (site) => {
  
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
        console.log(site)

        const value = await AsyncStorage.getItem('confirmed')

        if(value !== null) {
          console.log(value)
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
            await AsyncStorage.setItem('confirmed', 'yes')
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
          <Button transparent onPress={this.openClose}>
          <Entypo name="plus" size={28} color="black" />
            </Button>
          </Right>
        </Header>
        <Tabs tabBarUnderlineStyle={{backgroundColor:'grey'}}>
        <Tab tabStyle ={{backgroundColor: '#e3e8e6'}} activeTextStyle={{color: 'grey', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#e3e8e6'}} textStyle={{color: 'grey', fontWeight: 'normal'}} heading="Live Courts">
        <Content>
          <List>
          {this.state.playgrounds.map((object,index) =>
          
            <ListItem key = {index}>
                <Left>
              <Text>{object["site_name"]}</Text>
              </Left>
              <Right>
            <Button onPress={() => {this.selectPlayground(object["site_name"], object["site_id"], object["latitude"], object["longitude"]), this.props.onModalOne(), this.props.checkIfChecked(),this.props.checkIfPreChecked()}}>
              <Icon name='arrow-forward'/>
            </Button>
          </Right>
              
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
           
              <Button disabled = {false} style ={{backgroundColor: '#e3e8e6'}} onPress={() => {this.confirmCourt(object["site_id"])}}>
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
        <AddPlayground/>
        </React.Fragment>
    );
  }
}



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

