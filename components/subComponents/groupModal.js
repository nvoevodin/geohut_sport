import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity,View,ActivityIndicator, Switch} from 'react-native';
import {Container, Header, Content, ListItem, List, Icon, Button, Left,Input, Item, Label, Body, Title,Text, Right,Tab,Tabs} from 'native-base';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import moment from "moment";



class YourGroup extends Component {

    state = {
    

            submittedAnimation: false,
            members:["none here"],
            waitlist:["none here"],
            invited:["none here"],
            changedState: false,
            players:[],
            preChecks:[],
            invitePrompt:false,
            email:''
        
        
    }

    componentDidMount() {

      
        this.getMembers()
        this.getWaitlist()
        this.getInvited()
        this.getPlayersAndCourts()
      }

      componentDidUpdate(prevProps, prevState) {
        // Typical usage (don't forget to compare props):
        if (this.props.id !== prevProps.id || prevState.changedState !== this.state.changedState) {
            this.getMembers()
            this.getWaitlist()
            this.getInvited()
        }
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
      }


      refreshPage = () =>{
        this.getMembers()
        this.getWaitlist()
        this.getInvited()
        this.getPlayersAndCourts()
      }


 


      getMembers = () =>{
        fetch(`${global.x}/get_group_members/${this.props.id}`)
        .then((res) => res.json())
        .then((res) => {

       

          fetch(`${global.x}/get_users/${res.data[0]["JSON_EXTRACT(members, '$')"]}`)
          .then((res) => res.json())
          .then((res) => {
              //console.log(res.data)
          this.setState({members:res.data})
          
          
          }).catch((error) => {
            console.log(error)
          });
            
        //this.setState({members:JSON.parse(res.data[0]["JSON_EXTRACT(members, '$')"])})
        
        }).catch((error) => {
          console.log(error)
        });
      }

      getWaitlist = () =>{
        console.log('calling waitlist')
        fetch(`${global.x}/get_group_members/${this.props.id}`)
        .then((res) => res.json())
        .then((res) => {

          fetch(`${global.x}/get_users/${res.data[0]["JSON_EXTRACT(waiting, '$')"]}`)
          .then((res) => res.json())
          .then((res) => {
             
          this.setState({waitlist:res.data})
          
          
          }).catch((error) => {
            console.log(error)
          });
            
        //this.setState({members:JSON.parse(res.data[0]["JSON_EXTRACT(members, '$')"])})
        
        }).catch((error) => {
          console.log(error)
        });
      }

      getInvited = () =>{
        console.log('calling waitlist')
        fetch(`${global.x}/get_group_members/${this.props.id}`)
        .then((res) => res.json())
        .then((res) => {

          fetch(`${global.x}/get_users/${res.data[0]["JSON_EXTRACT(invited, '$')"]}`)
          .then((res) => res.json())
          .then((res) => {
             
          this.setState({invited:res.data})
          
          
          }).catch((error) => {
            console.log(error)
          });
            
        //this.setState({members:JSON.parse(res.data[0]["JSON_EXTRACT(members, '$')"])})
        
        }).catch((error) => {
          console.log(error)
        });
      }


      addToGroup = (user_id) => {
       fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/remove_from_waitlist?group_id=${this.props.id}&user_id=${user_id}`,
          { method: "PUT" }
        ).catch((error) => {
          console.log(error)
        })

        fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/add_group_members?group_id=${this.props.id}&user_id=${user_id}`,
          { method: "PUT" }
        ).catch((error) => {
          console.log(error)
        })

        alert('Added!')

        this.setState({changedState: !this.state.changedState})


      }

      removeFromGroup = (user_id) => {
        fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/remove_group_members?group_id=${this.props.id}&user_id=${user_id}`,
          { method: "PUT" }
        ).catch((error) => {
          console.log(error)
        })
        alert('Removed!')
        this.setState({changedState: !this.state.changedState})
      }


      openInvite = () => {
        this.setState({invitePrompt:true})
      }

      sendInvite = () => {

        fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/invite_group_members?group_id=${this.props.id}&user_id=${this.state.email}`,
          { method: "PUT" }
        ).catch((error) => {
          console.log(error)
        })

        alert('Invited!')

  

        this.setState({invitePrompt:false})
      }

      updateEmail = (email) => {
        this.setState({ email: email.trim() });
      }




  render() {
console.log(this.state.players)

    return (
        <React.Fragment>
        <Modal
          animationType="slide"
          transparent={false}
          visible={true}
          visible={this.props.reducer.yourGroupModal}
          >

<Container>
        <Header style = {{backgroundColor:'#e3e8e6'}}>
        <Left>
            <Button transparent onPress={this.props.closeYourPlaygroundModal}>
              <Icon name='arrow-back' style = {{color:'black'}}/>
            </Button>
          </Left>
          <Body>
            <Title style = {{color:'black'}}>{this.props.title}</Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={this.refreshPage}>
          <MaterialCommunityIcons name="refresh" size={35} color="green" />
          </TouchableOpacity>
          </Right>
        </Header>
        <Tabs tabBarUnderlineStyle={{backgroundColor:'grey'}}>
        <Tab tabStyle ={{backgroundColor: '#e3e8e6'}} activeTextStyle={{color: 'grey', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#e3e8e6'}} textStyle={{color: 'grey', fontWeight: 'normal'}} heading="Members">
        
        <List>
        <ListItem itemDivider>
          <Left>
          <Text style ={{fontWeight:'bold',fontSize:10}}>Player</Text>
          </Left>
          <Body>
          <Text style ={{fontWeight:'bold',fontSize:10}}>Arriving</Text>
          </Body>
          <Right>
          <Text style ={{fontWeight:'bold',fontSize:10}}>At Court</Text>
          </Right>
              
            </ListItem>   
        
        {this.state.members.map((object,index) =>

 
          
          <ListItem  key = {index}>
  <Left>
<Text style = {{fontSize:11}} >{object['first_name'] +' '+ object['last_name']}</Text>
  </Left>

  <Body>
  {this.state.preChecks.map((x,j) =>

   
 
x['user_id'] === object['email']?  
<Text style = {{fontSize:11}} key = {j}>{moment(x["pre_checkin_datetime"]).format('LT')}</Text>:null

)}
  </Body>
  
  <Right>
  
      
  {this.state.players.map((x,j) =>

   
 
    x['user_id'] === object['email']?  
  <Text style = {{fontSize:11}} key = {j}>{moment(x["checkin_datetime"]).format('LT')}</Text>:null
   
  )}

  </Right>
 
  </ListItem> )}

  </List>

  </Tab>

  {this.props.admin === this.props.reducer.userId[3] &&
          <Tab tabStyle ={{backgroundColor: '#e3e8e6'}} activeTextStyle={{color: 'grey', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#e3e8e6'}} textStyle={{color: 'grey', fontWeight: 'normal'}} heading="Admin">

<List>
<ListItem itemDivider>
  <Left>
<Text style ={{fontWeight:'bold',fontSize:18}}>Invited</Text>
  </Left>
              
              <TouchableOpacity onPress={this.openInvite}>
    <Text style = {{color:'green', fontWeight:'bold', fontSize:18, marginRight:'2.6%'}}>Invite</Text>
  </TouchableOpacity>

  
            </ListItem>  

              {this.state.invitePrompt && 
<ListItem>
  <Left>
  <Item floatingLabel>
            <Label>Type an email here</Label>
            <Input
              secureTextEntry={false}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(email) => this.updateEmail(email)}
              
            />

          </Item>
  </Left>

 
  
  <TouchableOpacity onPress={this.sendInvite}>
  <Icon name='arrow-forward' style = {{color:'black'}}/>
  </TouchableOpacity>
</ListItem>
  

  


     
          } 
        {this.state.invited.map((object,index) =>

        
       
          <ListItem  key = {index}>
  <Left>
<Text>{object['first_name'] +' '+ object['last_name']}</Text>
  </Left>
  <Right>
  {object['email'] === this.props.admin?<Text>Admin</Text>:null
//     <TouchableOpacity 
//     onPress={() => this.addToGroup(object['email']) }
//     >
// <AntDesign name="adduser" size={30} color="green"/>  
// </TouchableOpacity>
}
  </Right>
        </ListItem>)}
<ListItem itemDivider>
  
  <Text style ={{fontWeight:'bold',fontSize:18}}>Waitlist</Text>
  

              
            </ListItem>   
        {this.state.waitlist.map((object,index) =>

        
       
          <ListItem  key = {index}>
  <Left>
<Text>{object['first_name'] +' '+ object['last_name']}</Text>
  </Left>
  <Right>
  {object['email'] === this.props.admin?<Text>Admin</Text>:
    <TouchableOpacity 
    onPress={() => this.addToGroup(object['email']) }
    >
<AntDesign name="adduser" size={30} color="green"/>  
</TouchableOpacity>}
  </Right>
        </ListItem>)}
        <ListItem itemDivider>
              <Text style ={{fontWeight:'bold',fontSize:18}}>Members</Text>
            </ListItem> 
            {this.state.members.map((object,index) =>

        
       
<ListItem  key = {index}>
<Left>
<Text>{object['first_name'] +' '+ object['last_name']}</Text>
</Left>
<Right>
{object['email'] === this.props.admin?<Text>Admin</Text>:
<TouchableOpacity 
onPress={() => this.removeFromGroup(object['email']) }

>
<AntDesign name="deleteuser" size={30} color="red"/>  
</TouchableOpacity>}
</Right>
</ListItem>)}

  </List>


          </Tab>
}

            </Tabs>
  
      </Container>


      {this.state.submittedAnimation && (
            <View style={styles.loading}>
              <ActivityIndicator
                animating={this.state.submittedAnimation}
                style={{ left: "0.5%", bottom: "40%" }}
                size="large"
                color="white"
              />
            </View>
          )}


        </Modal>


        </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "#666570",
    opacity: 0.8,
  },
    container: {
      
      backgroundColor: '#fff',
      justifyContent: 'center',
      padding: 25
    },
  });



const mapStateToProps = (state) => {
    
    const { reducer } = state
    return { reducer }
  };

  const mapDispachToProps = dispatch => {
    return {
      closeYourPlaygroundModal: () => dispatch({ type: "OPEN_CLOSE_YOUR_GROUP_MODAL", value: false})
      
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(YourGroup)