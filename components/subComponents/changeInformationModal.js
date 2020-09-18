import React, { Component } from 'react';
import { StyleSheet, Modal,Text } from 'react-native';
import {Container,  Form, Input, Item, Button, Label} from 'native-base';
import * as firebase from 'firebase';



class changeInfo extends Component {

    

    state = {
        firstName: '',
        lastName: ''
    }  
    
    submitInfo = (firstName,lastName,uid) => {
        console.log(firstName,lastName);
        firebase.database().ref('UsersList/' + uid + '/info/').update({
            firstName,
            lastName
        })
          
          this.props.showModal()
    }

    render() {
        return (
        
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
              }}>



<Container style = {styles.container}>
                <Form>
                <Text style={{padding: 10, fontSize: 17}}>
                    You can change the following information:
                  </Text>

                    <Item floatingLabel>
                        <Label>Fist Name</Label>
                        <Input
                        autoCorrect={false}
                        autoCapitalize='none'
                        onChangeText={firstName => this.setState({ firstName })}
                    value={this.state.firstName}/>
                    </Item>

                    <Item floatingLabel>
                        <Label>Last Name</Label>
                        <Input
                        autoCorrect={false}
                        autoCapitalize='none'
                        onChangeText={lastName => this.setState({ lastName })}
                    value={this.state.lastName}/>
                    </Item>

                    <Button style ={{margin:10}}
                    full
                    rounded
                    success
                    onPress={()=> this.submitInfo(this.state.firstName, this.state.lastName, firebase.auth().currentUser.uid)}>

                        <Text style = {{color:'white'}}>Submit</Text>
                    </Button>

                    <Button style ={{margin:10}}
                    full
                    rounded
                    primary
                    onPress={()=> this.props.showModal()} >

                        <Text style = {{color:'white'}}>Go Back</Text>
                    </Button>

      

                    </Form>
                </Container>
                  

              </Modal>

        
        
        );
    }
}

export default changeInfo;
//onPress={this.forgotPassword(this.state.email)} 

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 40
      },
  
   
  });