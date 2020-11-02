import React, {Component} from 'react';
import { StyleSheet, Text,KeyboardAvoidingView, Alert} from 'react-native';
import {Container, Form, Input, Item, Button, Label} from 'native-base';
import * as firebase from 'firebase';
import ForgotPassword from './subComponents/forgotPassword'
import ResendEmail from './subComponents/resendEmail'
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import moment from "moment";
class Login extends Component {


    state = {
      firstName:'',
      lastName:'',
      email:'',
      password:'',
      errorMessage: null,
      forgotPasswordModalVisible: false,
      resendEmailModalVisible: false,
      data: null
    }










    //FORGET PASSWORD MODAL TOGGLE
    showForgotPasswordModal =() => {
      this.setState({ forgotPasswordModalVisible : !this.state.forgotPasswordModalVisible })
    }

        //FORGET PASSWORD MODAL TOGGLE
        showResendEmailModal =() => {
          this.setState({ resendEmailModalVisible : !this.state.resendEmailModalVisible })
        }

        resendEmailIfLogged =() => {
          if((new Date()).getTime() - moment(firebase.auth().currentUser.metadata.creationTime).valueOf() > 600000){
            firebase.auth().currentUser.sendEmailVerification()
            alert('We sent a new verification link to the email that you specified. It should be there within the next 15 minutes. If you do not receive the link in the next few hours, email us at volleypalapp@gmail.com. Include your email address so we can reset it for you.')

          } else {
            alert('Wait for at least 10 minutes before requesting anothere verification email. Check your spam folder.')

          }
          
          
        }
  
    //LOGS U IN, DISPLAYS ERROR MESSAGE IF ANY
    handleLogin = (email, password) => {
      firebase.auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then(() => {
        
        AsyncStorage.getItem('user_info', async (error, result) => {
          var res = JSON.parse(result) 
console.log('storage')
          console.log(res)
    
          // if(res !== null){
          //   console.log('login')
          //   console.log(res)
          //   console.log(res.data[0]["uid"])
          //   try{
          //     console.log('fuckkkkkkkkkkkkkkkkkkk1')
          //     this.props.storeUserId(res.data[0]["uid"],res.data[0]["first_name"], res.data[0]["last_name"], res.data[0]["email"])
          //     console.log('fuckkkkkkkkkkkkkkkkkkk2')
            
          //   }catch(e){console.log('fuckkkkkkkkkkkkkkkkkkk')}
          // } else {
            try {

              if(res === null){

                await fetch(`${global.x}/get_user/${firebase.auth().currentUser.uid}`)
                .then((res) => res.json())
                .then(async(res) => {
      
      
                  try {
               
                  try{
                    
                    this.props.storeUserId(res.data[0]["uid"],res.data[0]["first_name"], res.data[0]["last_name"], res.data[0]["email"])
                  } catch (e){
                    console.log('signup 1')
                    console.log(e)}
                  
                   await  AsyncStorage.setItem('user_info', JSON.stringify([res.data[0]["uid"], res.data[0]["first_name"], res.data[0]["last_name"], res.data[0]["email"]]))
                  } catch (e) {
                    console.log('something wrong (storage)')
                  }
                
                }).catch((error) => {
                  console.log(error)
                });

              }
            
            
              else if(res === undefined || res.length == 0){
                await fetch(`${global.x}/get_user/${firebase.auth().currentUser.uid}`)
                .then((res) => res.json())
                .then(async(res) => {
      
      
                  try {
               
                  try{
                    
                    this.props.storeUserId(res.data[0]["uid"],res.data[0]["first_name"], res.data[0]["last_name"], res.data[0]["email"])
                  } catch (e){
                    console.log('signup 1')
                    console.log(e)}
                  
                   await  AsyncStorage.setItem('user_info', JSON.stringify([res.data[0]["uid"], res.data[0]["first_name"], res.data[0]["last_name"], res.data[0]["email"]]))
                  } catch (e) {
                    console.log('something wrong (storage)')
                  }
                
                }).catch((error) => {
                  console.log(error)
                });
      
              } else if (res[0] !== firebase.auth().currentUser.uid){
                await fetch(`${global.x}/get_user/${firebase.auth().currentUser.uid}`)
                .then((res) => res.json())
                .then(async(res) => {
      
      
                  try {
              
                  try{
                    
                    this.props.storeUserId(res.data[0]["uid"],res.data[0]["first_name"], res.data[0]["last_name"], res.data[0]["email"])
                  } catch (e){console.log(e)}
                  
                   await  AsyncStorage.setItem('user_info', JSON.stringify([res.data[0]["uid"], res.data[0]["first_name"], res.data[0]["last_name"], res.data[0]["email"]]))
                  } catch (e) {
                    console.log('something wrong (storage)')
                  }
                
                }).catch((error) => {
                  console.log(error)
                });
  
              } else {

                await fetch(`${global.x}/get_user/${firebase.auth().currentUser.uid}`)
                .then((res) => res.json())
                .then(async(res) => {
      
      
                
              
                  try{
                    
                    this.props.storeUserId(res.data[0]["uid"],res.data[0]["first_name"], res.data[0]["last_name"], res.data[0]["email"])
                  } catch (e){console.log(e)}

              })}
      
           
            } catch(e){console.log(e)}
          




        })
      })
      .then(() => {firebase.auth().currentUser.emailVerified?this.props.navigation.navigate('Home'):this.props.navigation.navigate('StartScreen')})
      .catch(error => this.setState({ errorMessage: error.message }))
           
    }


      goBack = () => {
        this.props.navigation.navigate('StartScreen')
      }

      resendEmail = () =>{
        //firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        alert('resending')
      }
    


    render(){

      //new Date()).getTime() - moment(this.state.lastUpdated).valueOf() > 3560000
      // try{
      //   console.log((new Date()).getTime() -moment(firebase.auth().currentUser.metadata.creationTime).valueOf())
      // }catch(e){console.log('not there')}
    

        return (
            <Container style = {styles.container}>
                                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"}>

                <Form>
                {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input
                        autoCorrect={false}
                        autoCapitalize='none'
                        onChangeText = {(email) => this.setState({email})}/>
                    </Item>

                    <Item floatingLabel>
                        <Label>Password</Label>
                        <Input
                        secureTextEntry={true}
                        autoCorrect={false}
                        autoCapitalize='none'
                        onChangeText = {(password) => this.setState({password})}/>
                    </Item>

                    <Button style ={{margin:10}}
                    full
                    rounded
                    success
                    onPress={() => {
                      //firebase.auth().currentUser['emailVerified']?
                      this.handleLogin(this.state.email, this.state.password)
                      //:alert('Verify your your email first. It should be in your inbox within the next 10 minutes. Check your spam folder as well.')
                      }}>

                        <Text style = {{color:'white'}}>Login</Text>
                    </Button>

                    <Button style ={{margin:10}}
                    full
                    rounded
                    primary
                    onPress={this.goBack}>

                        <Text style = {{color:'white'}}>Go Back</Text>
                    </Button>

                    <Button style ={{margin:10}}
                    full
                    rounded
                    danger
                    onPress={this.showForgotPasswordModal}>

                        <Text style = {{color:'white'}}>Forgot Password</Text>
                    </Button>

                    <Button style ={{margin:10}}
                    full
                    rounded
                    danger
                    onPress={firebase.auth().currentUser === null?this.showResendEmailModal:this.resendEmailIfLogged}>

                        <Text style = {{color:'white'}}>Resend Verification Email</Text>
                    </Button>

  


                </Form>
                </KeyboardAvoidingView>
                {this.state.forgotPasswordModalVisible && ( 
                  <ForgotPassword 
                    modalVisible = {this.state.forgotPasswordModalVisible}
                    showModal = {this.showForgotPasswordModal}
         
                  />)}
                                    {this.state.resendEmailModalVisible && ( 
                  <ResendEmail 
                    modalVisible = {this.state.resendEmailModalVisible}
                    showModal = {this.showResendEmailModal}
         
                  />)}
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

    storeUserId: (id,fname,sname,email) => dispatch({ type: "STORE_USER_ID", value: id, value1:fname, value2:sname, value3:email})

  };
};

export default connect(mapStateToProps, mapDispachToProps)(Login);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 40
  },
});