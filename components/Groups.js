import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity, Alert,View} from 'react-native';
import {Container, Header, Content, List, ListItem, Icon, Button, Left,Right, Body, Title,Text, Tab, Tabs,TabHeading} from 'native-base';
import { connect } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-community/async-storage';
import AddGroup from './subComponents/addGroup'
import YourGroup from './subComponents/groupModal'




class Groups extends Component {

    state = {
     groups:[],
     groupTitle: '',
     groupId:'',
     adminId:'',
     joinedOrLeftGroup:false
    }

    componentDidMount() {
      this.getGroups()
        
    }




    componentDidUpdate(prevProps, prevState){
      if(prevProps.reducer.playgroundId !== this.props.reducer.playgroundId){
        this.getGroups()
      }

      if(prevState.joinedOrLeftGroup !== this.state.joinedOrLeftGroup){
        this.getGroups()
      }

    }

    getGroups = () => {
      
      fetch(`${global.x}/get_groups/${this.props.reducer.playgroundId}`)
      .then((res) => res.json())
      .then((res) => {
      this.setState({groups:res.data})
      
      }).catch((error) => {
        console.log(error)
      });
      console.log('getting groups')
  

  
  }


    addGroup = () =>{
      this.props.openAddPlaygroundModal()
    }

    selectGroup = (x,y,z) =>{
      this.setState({groupTitle:x, groupId:y, adminId:z})
      this.props.openYourPlaygroundModal()
    }


    joinGroup = async (name,id) => {
      console.log(this.props.reducer.userId)
      await fetch(
        // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
        `${global.x}/add_group_members?group_id=${id}&user_id=${this.props.reducer.userId[3]}`,
        { method: "PUT" }
      ).catch((error) => {
        console.log(error)
      })

      try {
        this.props.setAnanimous(true)
        AsyncStorage.setItem('anonimous', 'true')
      } catch (e) {
        console.log(e)
        console.log('something wrong (storage)')
      }

      alert(`You joined ${name} group. You became anonimous to everybody outside of the groups that you join or request to join. You can turn this feature off in the Profile tab.` )
      this.setState({joinedOrLeftGroup:!this.state.joinedOrLeftGroup})

    }

    requestToJoin = async (name,id) => {
      console.log(this.props.reducer.userId)
      await fetch(
        // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
        `${global.x}/add_to_waitlist?group_id=${id}&user_id=${this.props.reducer.userId[3]}`,
        { method: "PUT" }
      ).catch((error) => {
        console.log(error)
      })


      try {
        this.props.setAnanimous(true)
        AsyncStorage.setItem('anonimous', 'true')
      } catch (e) {
        console.log(e)
        console.log('something wrong (storage)')
      }

      alert(`You requested to join the ${name} group. You became anonimous to everybody outside of the groups that you join or request to join. You can turn this feature off in the Profile tab.` )
      this.setState({joinedOrLeftGroup:!this.state.joinedOrLeftGroup})

    }

    requested = () => {
      alert('Already requested! Wait for admin to approve you!')
    }


    leaveGroup = async (name,id) => {
     
      await fetch(
        // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
        `${global.x}/remove_group_members?group_id=${id}&user_id=${this.props.reducer.userId[3]}`,
        { method: "PUT" }
      ).catch((error) => {
        console.log(error)
      })

      alert(`You left ${name} group` )
      this.setState({joinedOrLeftGroup:!this.state.joinedOrLeftGroup})

    }

    deleteGroup = (group_id) =>{
      fetch(
        // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
        `${global.x}/deleteGroup?group_id=${group_id}`,
        { method: "DELETE" }
      ).catch((error) => {
        console.log(error)
      })
      
      alert('You deleted your group!')
      this.setState({joinedOrLeftGroup:!this.state.joinedOrLeftGroup})
    }


    changeState = () =>{

      console.log('change state')
      this.setState({joinedOrLeftGroup:!this.state.joinedOrLeftGroup})
    }

    


  render() {

  
      
    return (
     

<Container>
<Header style = {{backgroundColor:'#5cb85c',height: 70, paddingTop:0}}>
        <Left>
        <Title style = {{color:'white', fontSize: 30}}>Groups</Title>
          </Left>

          <Right>

          <TouchableOpacity onPress={this.getGroups}>
          <MaterialCommunityIcons name="refresh" size={35} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress = {this.addGroup}>
          <Entypo name="plus" size={35} color="white" />
          </TouchableOpacity>
          </Right>
        </Header>
        <Tabs tabBarUnderlineStyle={{backgroundColor:'grey'}}>
        <Tab tabStyle ={{backgroundColor: '#5cb85c'}} activeTextStyle={{color: '#fff', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#5cb85c'}} textStyle={{color: '#fff', fontWeight: 'normal'}} heading="Groups"
          >
        {/* <Header style = {{backgroundColor:'#e3e8e6'}}>
        <Left>
  
          </Left>
          <Body>
            <Title style = {{color:'black'}}>Groups</Title>
          </Body>
          <Right>

          </Right>
        </Header> */}
     
        <Content>
          <List>
          
          {this.state.groups.map((object,index) =>


          <View key = {index}>
            {object["status"] === 'hidden' && JSON.parse(object.members).some(i => i !== this.props.reducer.userId[3])?null:
          <ListItem  >
            
  <Left>
  <TouchableOpacity style = {{flexDirection:'row'}} onPress = {() => {{object["status"] === 'private' || object['admin_id'] === this.props.reducer.userId[3] || JSON.parse(object.members).some(i => i === this.props.reducer.userId[3])?this.selectGroup(object["group_name"], object["group_id"], object['admin_id']):alert("Private group.")}}}>

<Text>{object["group_name"]}</Text>
</TouchableOpacity>
</Left>

<Right>

{object['admin_id'] === this.props.reducer.userId[3]?
<TouchableOpacity onPress={() => {this.deleteGroup(object["group_id"])}}>
              <Text style = {{fontSize:18, fontWeight:'bold', color:'red'}}>Delete</Text>
            </TouchableOpacity>:
JSON.parse(object.waiting).some(i => i === this.props.reducer.userId[3])?  
  <TouchableOpacity onPress={this.requested}>
              <Text style = {{fontSize:18, fontWeight:'bold', color:'blue'}}>Waiting</Text>
            </TouchableOpacity>:
            JSON.parse(object.members).some(i => i === this.props.reducer.userId[3])?  
  <TouchableOpacity onPress={() => {this.leaveGroup(object["group_name"], object["group_id"])}}>
              <Text style = {{fontSize:18, fontWeight:'bold', color:'red'}}>Leave</Text>
            </TouchableOpacity>:



object["password"] == ''?
  <TouchableOpacity onPress={() => {this.joinGroup(object["group_name"], object["group_id"])}}>
              <Text style = {{fontSize:18, fontWeight:'bold', color:'green'}}>Join</Text>
            </TouchableOpacity>:<TouchableOpacity onPress={() => {this.requestToJoin(object["group_name"], object["group_id"])}}>
            <Text style = {{fontSize:18, fontWeight:'bold', color:'green'}}>Request</Text>
            </TouchableOpacity>}
</Right>

</ListItem>}
</View>


)}
          

        
      
          </List>
          </Content>
          </Tab>
      <Tab tabStyle ={{backgroundColor: '#5cb85c'}} activeTextStyle={{color: '#fff', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#5cb85c'}} textStyle={{color: '#fff', fontWeight: 'normal'}} heading="Your Groups"
          >

<Content>
          <List>
          
          {this.state.groups.map((object,index) =>
         
          <ListItem  key = {index}>
  <Left>
  {JSON.parse(object.members).some(i => i === this.props.reducer.userId[3])?
  <TouchableOpacity style = {{flexDirection:'row'}} onPress = {() => {{object["password"] == ''?this.selectGroup(object["group_name"], object["group_id"], object['admin_id']):alert("Private group.")}}}>

<Text>{object["group_name"]}</Text>
</TouchableOpacity>:null}
</Left>

<Right>
  
{object['admin_id'] === this.props.reducer.userId[3]?
<TouchableOpacity onPress={() => {this.deleteGroup(object["group_id"])}}>
              <Text style = {{fontSize:18, fontWeight:'bold', color:'red'}}>Delete</Text>
            </TouchableOpacity>:
            JSON.parse(object.members).some(i => i === this.props.reducer.userId[3])?  
  <TouchableOpacity onPress={() => {this.leaveGroup(object["group_name"], object["group_id"])}}>
              <Text style = {{fontSize:18, fontWeight:'bold', color:'red'}}>Leave</Text>
            </TouchableOpacity>:null}
</Right>

</ListItem>



  )}
          

        
      
          </List>
          </Content>





            </Tab>
            </Tabs>
          <AddGroup changeState = {this.changeState}/>
          <YourGroup  title = {this.state.groupTitle} id = {this.state.groupId} admin = {this.state.adminId}/>
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
      setAnanimous: (x) => dispatch({ type: "SET_ANANIMOUS", value: x }),
      openAddPlaygroundModal: () => dispatch({ type: "OPEN_CLOSE_ADD_GROUP_MODAL", value: true}),
      openYourPlaygroundModal: (x) => dispatch({ type: "OPEN_CLOSE_YOUR_GROUP_MODAL", value: true})
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(Groups)