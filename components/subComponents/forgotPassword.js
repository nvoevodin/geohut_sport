import React, { Component } from 'react';
import { StyleSheet, Modal,Text } from 'react-native';
import {Container,  Form, Input, Item, Button, Label} from 'native-base';
import * as firebase from 'firebase';



class forgotPassword extends Component {

    state = {
        email: null
    }  
    
    forgotPassword = (yourEmail) => {
        console.log(yourEmail);
        firebase.auth().sendPasswordResetEmail(yourEmail)
          .then(function (user) {
            alert('Your reset link has been sent to your email, make sure to check your spam folder if you do not see it...')
          }).catch(function (e) {
            console.log(e)
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
                    Enter your email below to recover your password:
                  </Text>

                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input
                        autoCorrect={false}
                        autoCapitalize='none'
                        onChangeText={email => this.setState({ email })}
                    value={this.state.email}/>
                    </Item>

                    <Button style ={{margin:10}}
                    full
                    rounded
                    success
                    onPress={()=> this.forgotPassword(this.state.email)}>

                        <Text style = {{color:'white'}}>Reset</Text>
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

export default forgotPassword;
//onPress={this.forgotPassword(this.state.email)} 

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 40
      },
  
   
  });

