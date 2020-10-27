import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity} from 'react-native';
import {Container, Header, Content, Card, CardItem,  Button, Left,Right, Body, Title,Text, Tab, Tabs,TabHeading} from 'native-base';
import { connect } from 'react-redux';

import { View } from 'react-native-animatable';
import moment from "moment";
import { Ionicons } from '@expo/vector-icons'; 
import Report from './subComponents/picker'
import { MaterialCommunityIcons } from '@expo/vector-icons';

class Players extends Component {


    state = {
         players: [],
         preChecks: [],
         report: null,
         
         modalOpen: false
    }

    componentDidMount() {
        this.getPlayersAndCourts()
        
    }


    modifyReport = (x) =>{
    
      this.setState({report:x})   
  }

    getPlayersAndCourts = () => {
      
    fetch(`${global.x}/players/${this.props.reducer.playgroundId}`)
    .then((res) => res.json())
    .then((res) => {
        
    this.setState({players:res.data})
    }).catch((error) => {
      console.log(error)
    });


    fetch(`${global.x}/pre_checks/${this.props.reducer.playgroundId}`)
    .then((res) => res.json())
    .then((res) => {
        
    this.setState({preChecks:res.data})
    }).catch((error) => {
      console.log(error)
    });


    fetch(`${global.x}/live_courts_info/${this.props.reducer.playgroundId}`)
    .then((res) => res.json())
    .then((res) => {

      
        
    this.setState({report:res.data[0]["count"]})
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

alertChecked = () => {
  alert('This is the number of people who have checked in and are currently at the courts. Please report approximate number of people that you see at the courts by pressing the blue button on the right. Thank you!')
}

// Reported = () => {

// }
  render() {

console.log(this.state.reportar)
      
    return (
      <Container>
        <Header style = {{backgroundColor:'#5cb85c',height: 70, paddingTop:0}}>
        <Left>
        <Title style = {{color:'white', fontSize: 30}}>Players</Title>
          </Left>

          <Right>
          <TouchableOpacity onPress = {this.logout}>
          <MaterialCommunityIcons name="exit-run" size={30} color="white" />
          </TouchableOpacity>
          </Right>
        </Header>
        <Tabs tabBarUnderlineStyle={{backgroundColor:'grey'}}>
        <Tab tabStyle ={{backgroundColor: '#5cb85c'}} activeTextStyle={{color: '#fff', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#5cb85c'}} textStyle={{color: '#fff', fontWeight: 'normal'}} heading="Playing Now"
          >
        <View style={styles.container}>
        <Button style ={{margin:10}}
                    full
                    rounded
                    success
                    onPress={this.getPlayersAndCourts}>

                        <Text style = {{color:'white'}}>Refresh</Text>
                    </Button>

                    


    </View>

    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
    <View style={styles.container}>
<Text style = {{fontSize:19}}>Checked In:</Text>
                    
<Button style ={{margin:10,borderRadius:70, height:75, width:75}}
                    full
                    rounded
                    success
                    onPress={this.alertChecked}>

                        <Text style = {{color:'white', fontSize:24}}>{this.state.players.length}</Text>
                    </Button>
</View>

<View style={styles.container}>
<Text style = {{fontSize:19}}>Reported:</Text>
                    
                    <Button style ={{margin:10,borderRadius:70, height:75, width:75}}
                    disabled={this.props.reducer.playgroundId == ''?true:false}
                    full
                    rounded
                    primary
                    onPress={this.props.onModalOne}>

                        {this.state.report !== null?<Text style = {{color:'white', fontSize:24}}>{this.state.report}</Text>:<Ionicons name="ios-people" size={24} color="white" />}
                    </Button>
</View>

    </View>


  

       
 
        <Content>
          <Card>
          {this.state.players.map((object,index) =>
          
            <CardItem key = {index} style = {{flex:1}}>
              <Left>
              <Text style = {{fontSize:11}}>{object["first_name"].trim()} {object["last_name"].trim()}</Text>  
              </Left>
              <Text style = {{fontSize:11}}>{moment(object["checkin_datetime"]).format('LT')}</Text>
              
            
              
            </CardItem>
        
          )}
          </Card>
        </Content>
      </Tab>
      <Tab tabStyle ={{backgroundColor: '#5cb85c'}} activeTextStyle={{color: '#fff', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#5cb85c'}} textStyle={{color: '#fff', fontWeight: 'normal'}} heading="Coming to Play"
          >
      <View style={styles.container}>
        <Button style ={{margin:10}}
                    full
                    rounded
                    success
                    onPress={this.getPlayersAndCourts}>

                        <Text style = {{color:'white'}}>Refresh</Text>
                    </Button>

                    

                    <Text style = {{fontSize:19}}>Pre-Checked In:</Text>
    <Text style = {{fontSize:50}}>{this.state.preChecks.length}</Text>
    </View>
 
        <Content>
          <Card>
          {this.state.preChecks.map((object,index) =>
        
            <CardItem key = {index}>
              <Left>
              <Text style = {{fontSize:11}} >{object["first_name"].trim()} {object["last_name"].trim()}</Text>  
              </Left>
             <Text style = {{fontSize:11}}>{moment(object["pre_checkin_datetime"]).format('LT')}</Text>
              
            
              
            </CardItem>
        
  )}
          </Card>
        </Content>
      </Tab>


        </Tabs>
        <Report modifyReport = {this.modifyReport}/>
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
      onModalOne: () => dispatch({ type: "MODAL_REPORT", value: true}),
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