import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity} from 'react-native';
import {Container, Header, Content, List, ListItem, Icon, Button, Left,Right, Body, Title,Text, Picker} from 'native-base';
import { connect } from 'react-redux';
import PageTemplate from "./subComponents/Header";






class Players extends Component {

    state = {
         players: []
    }

    componentDidMount() {
        this.getPlayers()
        
    }

    getPlayers = () => {
    fetch(`http://192.168.2.7:3002/players`)
    .then((res) => res.json())
    .then((res) => {
    this.setState({players:res.data})
    });

}


  //FUNCTION: LOGS OUT
  logout = () => {
    firebase
      .auth()
      .signOut()
      .catch((error) => console.log(error));

    this.props.navigation.navigate("StartScreen");
  };

// selectPlayground = (name,id,lat,lon) => {
// this.props.storePlayground(name,id,lat,lon)

// }


  render() {

  
      
    return (
        <React.Fragment>
        <PageTemplate title={"Players"} logout={this.logout} />

<Container>
        
 
        <Content>
          <List>
          {this.state.players.map((object,index) =>
          
            <ListItem key = {index}>
              <Left>
              <Text>{object["first_name"]} {object["last_name"]}</Text>  
              </Left>
              <Right><Text>{object["checkin_datetime"]}</Text></Right>
              
            
              
            </ListItem>
        
          )}
          </List>
        </Content>
      </Container>


      

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
      //onModalOne: () => dispatch({ type: "CLOSE_MODAL_1", value: false}),
     // storePlayground: (name,id,lat,lon) => dispatch({ type: "STORE_PLAYGROUND", value: name,value1: id, value2:lat,value3:lon})
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(Players)