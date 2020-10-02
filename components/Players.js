import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity} from 'react-native';
import {Container, Header, Content, List, ListItem,  Button, Left,Right, Body, Title,Text, Tab, Tabs,TabHeading} from 'native-base';
import { connect } from 'react-redux';
import PageTemplate from "./subComponents/Header";
import { View } from 'react-native-animatable';
import moment from "moment";



//let x = 'http://192.168.2.7:3002'

//let x = 'http://192.168.2.5:3007'

let x = 'https://volleybuddy.metis-data.site'
class Players extends Component {

    state = {
         players: [],
         preChecks: []
    }

    componentDidMount() {
        this.getPlayers()
        
    }

    getPlayers = () => {
      
    fetch(`${x}/players/${this.props.reducer.playgroundId}`)
    .then((res) => res.json())
    .then((res) => {
        
    this.setState({players:res.data})
    }).catch((error) => {
      console.log(error)
    });


    fetch(`${x}/pre_checks/${this.props.reducer.playgroundId}`)
    .then((res) => res.json())
    .then((res) => {
        
    this.setState({preChecks:res.data})
    }).catch((error) => {
      console.log(error)
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
      <Container>
        <PageTemplate title={"Players"} logout={this.logout} />
        <Tabs >
        <Tab heading={<TabHeading style={{backgroundColor: '#5cb85c'}}>
          <Text>Playing Now</Text>
          </TabHeading>}
          >
        <View style={styles.container}>
        <Button style ={{margin:10}}
                    full
                    rounded
                    success
                    onPress={this.getPlayers}>

                        <Text style = {{color:'white'}}>Refresh</Text>
                    </Button>

                    

                    <Text style = {{fontSize:20}}>Checked In:</Text>
    <Text style = {{fontSize:56}}>{this.state.players.length}</Text>
    </View>
 
        <Content>
          <List>
          {this.state.players.map((object,index) =>
          
            <ListItem key = {index}>
              <Left>
              <Text>{object["first_name"]} {object["last_name"]}</Text>  
              </Left>
              <Right><Text>{moment(object["checkin_datetime"]).format('LT')}</Text></Right>
              
            
              
            </ListItem>
        
          )}
          </List>
        </Content>
      </Tab>
      <Tab heading={<TabHeading style={{backgroundColor: '#5cb85c'}}>
          <Text>Coming to Play</Text>
          </TabHeading>}
          >
      <View style={styles.container}>
        <Button style ={{margin:10}}
                    full
                    rounded
                    success
                    onPress={this.getPlayers}>

                        <Text style = {{color:'white'}}>Refresh</Text>
                    </Button>

                    

                    <Text style = {{fontSize:20}}>Pre-Checked In:</Text>
    <Text style = {{fontSize:56}}>{this.state.preChecks.length}</Text>
    </View>
 
        <Content>
          <List>
          {this.state.preChecks.map((object,index) =>
          
            <ListItem key = {index}>
              <Left>
              <Text>{object["first_name"]} {object["last_name"]}</Text>  
              </Left>
              <Right><Text>{moment(object["pre_checkin_datetime"]).format('LT')}</Text></Right>
              
            
              
            </ListItem>
        
          )}
          </List>
        </Content>
      </Tab>


        </Tabs>

      </Container>
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

    const styles = StyleSheet.create({
      container: {
       
        backgroundColor: "#fff",
        alignItems: "center"
        
      }
    })