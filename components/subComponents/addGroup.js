import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity,View,ActivityIndicator, Switch} from 'react-native';
import {Container, Header, Content, Item, Label, Icon, Button, Left,Input, Body, Title,Text, Form,Textarea} from 'native-base';
import { connect } from 'react-redux';






class AddGroup extends Component {

    state = {
    
            name: "",
            submittedAnimation: false,
            isEnabled: false,
            submittedAnimation: false,
            password: ''
        
        
    }


    toggleSwitch = () => {

        
        this.setState({isEnabled: !this.state.isEnabled})
   
      
      };

      createGroup = () => {


        
        fetch(
            // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
            `${global.x}/addGroup?admin_id=${this.props.reducer.userId[3]}&playground_id=${this.props.reducer.playgroundId}&group_name=${this.state.name}&password=${this.state.password}&member=${this.props.reducer.userId[3]}`,
            { method: "POST" }
          ).catch((error) => {
            console.log(error)
          })

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

<Text style = {{textAlign:'center',fontSize:20, marginTop:'10%', marginBottom:'3%'}}>Password?</Text>

<View style = {{flexDirection:'row'}}>
    
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
          } 


          
    

            {/* <Text style = {{textAlign:'center',fontSize:20, marginTop:'10%', marginBottom:'3%'}}>Address</Text>

<Textarea underline blurOnSubmit={true} placeholder='Use the closest known address to the playground. Ex.: Central Park West, New York, NY 10019'
onChangeText={(Address) => this.setState({ Address })}
/> */}
    


          </Form>

<Button style ={{margin: 10,marginTop:80}}
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