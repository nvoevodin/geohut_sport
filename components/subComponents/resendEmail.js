import React, { Component } from 'react';
import { StyleSheet, Modal,Text,KeyboardAvoidingView } from 'react-native';
import {Container,  Form, Input, Item, Button, Label} from 'native-base';
import * as firebase from 'firebase';



class ResendEmail extends Component {

    state = {
        email: '',
        password:''
    } 
    
    updateEmail = (email) => {
        this.setState({ email: email.trim() });
      }
    
      updatePassword = (password) => {
        this.setState({ password: password.trim() });
      }
    
    //LOGS U IN, DISPLAYS ERROR MESSAGE IF ANY
    handleReset = (email, password) => {
        firebase.auth()
        .signInWithEmailAndPassword(email.trim(), password)
        .then(() => firebase.auth().currentUser.sendEmailVerification())
        .catch((error) => {this.setState({ errorMessage: error.message })
        console.log(error.message)})
        alert('We sent a new verification link to the email that you specified. It should be there within the next 15 minutes. If you do not receive the link in the next few hours, email us at volleypalapp@gmail.com. Include your email address so we can reset it for you.')
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
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"}>
                <Form>
                <Text style={{padding: 10, fontSize: 17}}>
                    Enter your email and password to resend verification email:
                  </Text>

                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input
                        autoCorrect={false}
                        autoCapitalize='none'
                        onChangeText={(email) => this.updateEmail(email)}
                    value={this.state.email}/>
                    </Item>

                    <Item floatingLabel>
                        <Label>Password</Label>
                        <Input
                        autoCorrect={false}
                        autoCapitalize='none'
                        onChangeText={(password) => this.updatePassword(password)}
                    value={this.state.password}/>
                    </Item>

                    <Button style ={{margin:10}}
                    full
                    rounded
                    success
                    onPress={()=> this.handleReset(this.state.email, this.state.password)}>

                        <Text style = {{color:'white'}}>Resend</Text>
                    </Button>

                    <Button style ={{margin:10}}
                    full
                    rounded
                    primary
                    onPress={()=> this.props.showModal()} >

                        <Text style = {{color:'white'}}>Go Back</Text>
                    </Button>

      

                    </Form>
                    </KeyboardAvoidingView>
                </Container>
                  

              </Modal>

        
        
        );
    }
}

export default ResendEmail;
//onPress={this.forgotPassword(this.state.email)} 

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 40
      },
  
   
  });