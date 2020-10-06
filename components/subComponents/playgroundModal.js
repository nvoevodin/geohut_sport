import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity} from 'react-native';
import {Container, Header, Content, List, ListItem, Icon, Button, Left,Right, Body, Title,Text, Picker} from 'native-base';
import { connect } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import AddPlayground from "./addPlaygroundModal"


//let x = 'http://10.244.57.219:3002'

//let x = 'http://192.168.2.5:3007'
let x = 'https://volleybuddy.metis-data.site'


class PlaygroundModal extends Component {

    state = {
         playgrounds: []
    }

    componentDidMount() {
        this.getPlaygrounds()
        
    }

    getPlaygrounds = () => {
    fetch(`${x}/sites`)
    .then((res) => res.json())
    .then((res) => {
    this.setState({playgrounds:res.data})
    
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
            <Title style = {{color:'black'}}>Select Playground</Title>
          </Body>
          <Right>
          <Button transparent onPress={this.openClose}>
          <Entypo name="plus" size={28} color="black" />
            </Button>
          </Right>
        </Header>
        <Content>
          <List>
          {this.state.playgrounds.map((object,index) =>
          
            <ListItem key = {index}>
                <Left>
              <Text>{object["site_name"]}</Text>
              </Left>
              <Right>
            <Button onPress={() => {this.selectPlayground(object["site_name"], object["site_id"], object["latitude"], object["longitude"]), this.props.onModalOne(), this.props.checkIfChecked()}}>
              <Icon name='arrow-forward'/>
            </Button>
          </Right>
              
            </ListItem>
        
          )}
          </List>
        </Content>
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

