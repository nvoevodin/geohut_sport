import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity,View,ActivityIndicator, Switch} from 'react-native';
import {Container, Header, CheckBox, ListItem, Label, Icon, Button, Left,Input, Body, Title,Text, Form,Textarea} from 'native-base';
import { connect } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';





class AddGroup extends Component {

    state = {
    
            name: "",
            submittedAnimation: false,
            isEnabled: false,
            submittedAnimation: false,
            password: '',
            status:'public'
        
        
    }

    groupStatus = (x) =>{
      this.setState({status:x})

    }

    question = () => {
      alert("Select one of the three group types. 1) Public Group - anybody can join a public group or see who is in a public group. 2) Private Group - anybody can apply to join a private group, and it is up to the creator of the group to approve or deny access. Outsiders can not see who is in a private group. 3) Hidden Group - an invisible private group. Players can join hidden group only by invite from an admin.")
    }

    
    toggleSwitch = () => {

        
        this.setState({isEnabled: !this.state.isEnabled})
   
      
      };

      createGroup = () => {


        
        fetch(
            // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
            `${global.x}/addGroup?admin_id=${this.props.reducer.userId[3]}&playground_id=${this.props.reducer.playgroundId}&group_name=${this.state.name.trim()}&status=${this.state.status}&member=${this.props.reducer.userId[3]}&waiting=${this.props.reducer.userId[3]}&invited=${this.props.reducer.userId[3]}`,
            { method: "POST" }
          ).catch((error) => {
            console.log(error)
          })
          this.props.changeState()
          alert("Success! You created a new group.")

          this.props.closeAddPlaygroundModal()
          
      }



  render() {


      
    return (
        <React.Fragment>
        <Modal
          animationType="slide"
          transparent={false}
          visible={true}
          visible={this.props.reducer.addGroupModal}
          >

<Container>
        <Header style = {{backgroundColor:'#e3e8e6'}}>
        <Left>
            <Button transparent onPress={this.props.closeAddPlaygroundModal}>
              <Icon name='arrow-back' style = {{color:'black'}}/>
            </Button>
          </Left>
          <Body>
            <Title style = {{color:'black'}}>Create a Group</Title>
          </Body>

        </Header>
        <View style = {styles.container}>
           
            <Text style = {{textAlign:'center', fontSize:14, color:'#545755',marginLeft:'25%', marginRight:'25%', marginTop:'7%'}}>Please do not create some nonsense group.</Text>
           <Form>
        
          
           <Text style = {{textAlign:'center',fontSize:20, marginTop:'10%', marginBottom:'3%'}}>Name</Text>

            <Textarea underline blurOnSubmit={true} placeholder='Name the group. Something like: Net Number 1.'
            onChangeText={(name) => this.setState({ name })}
            />
                   { this.state.name < 4   && 
          <Text style = {{color:'red', width: '80%', textAlign:'center', marginLeft: '10%'}}>Name is too short.</Text>
          }  

<Text style = {{textAlign:'center',fontSize:20, marginTop:'10%', marginBottom:'5%'}}>Group Status</Text>
<View style={{justiftyContent:"center", alignItems:"center"}}>
<TouchableOpacity onPress={this.question}>
                  <AntDesign name="questioncircleo" size={35} color="black" />
                </TouchableOpacity>
</View>

<ListItem style ={{marginTop:'3%'}}>
  <Left>
  <TouchableOpacity onPress={() =>this.groupStatus('public')}>
    <Text>Public Group</Text>
    </TouchableOpacity>
    </Left>
<Body>
{this.state.status === 'public'?<AntDesign name="check" size={24} color="green" />:null}
</Body>

</ListItem>
<ListItem>
  <Left>
  <TouchableOpacity onPress={() =>this.groupStatus('private')}>
    <Text>Private Group</Text>
    </TouchableOpacity>
    </Left>
<Body>
{this.state.status === 'private'?<AntDesign name="check" size={24} color="green" />:null}
</Body>

</ListItem>
<ListItem>
  <Left>
  <TouchableOpacity onPress={() =>this.groupStatus('hidden')}>
    <Text>Hidden Group</Text>
    </TouchableOpacity>
    </Left>
<Body>
{this.state.status === 'hidden'?<AntDesign name="check" size={24} color="green" />:null}
</Body>

</ListItem>

{/* <View style = {{flexDirection:'row'}}>
    
<Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={this.state.isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={this.toggleSwitch}
        value={this.state.isEnabled}
       />
 <Text>Toggle to add password.</Text>
       </View>
       {this.state.isEnabled && 
    <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              
              onChangeText={(password) => this.setState({ password })}
              
            />
          </Item> }

      

          
         
       { (this.state.isEnabled && this.state.password.length < 4 )  && 
          <Text style = {{color:'red', width: '80%', marginLeft: '10%', marginTop: '2%'}}>Can be simple, but at least 4 characters.</Text>
          }  */}


          
    

            {/* <Text style = {{textAlign:'center',fontSize:20, marginTop:'10%', marginBottom:'3%'}}>Address</Text>

<Textarea underline blurOnSubmit={true} placeholder='Use the closest known address to the playground. Ex.: Central Park West, New York, NY 10019'
onChangeText={(Address) => this.setState({ Address })}
/> */}
    


          </Form>

<Button style ={{margin: 10,marginTop:80}}
disabled={this.state.name < 4?true:false}
                    full
                    rounded
                    success
                    onPress={this.createGroup}
                    >

                        <Text style = {{color:'white'}}>Create</Text>
                    </Button>
        </View>
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
      closeAddPlaygroundModal: () => dispatch({ type: "OPEN_CLOSE_ADD_GROUP_MODAL", value: false})
      
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(AddGroup)