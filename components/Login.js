import React, {Component} from 'react';
import { StyleSheet, Text} from 'react-native';
import {Container, Form, Input, Item, Button, Label} from 'native-base';
import * as firebase from 'firebase';
import ForgotPassword from './subComponents/forgotPassword'
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
class Login extends Component {


    state = {
      firstName:'',
      lastName:'',
      
      email:null,
      password:'',
      errorMessage: null,
      modalVisible: false,
      data: null
    }










    //FORGET PASSWORD MODAL TOGGLE
    showModal =() => {
      this.setState({ modalVisible : !this.state.modalVisible })
    }
  
    //LOGS U IN, DISPLAYS ERROR MESSAGE IF ANY
    handleLogin = (email, password) => {
      firebase.auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then(() => {
        AsyncStorage.getItem('user_info', async (error, result) => {
          var res = JSON.parse(result) 
    
          
          try {
            console.log(res)
            if(res === null){
              await fetch(`${global.x}/get_user/${firebase.auth().currentUser.uid}`)
              .then((res) => res.json())
              .then(async(res) => {
    
    
                try {
                console.log(res)
                console.log('in log')
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
    
            }
    
         
          } catch(e){console.log(e)}
        })
      })
      .then(() => this.props.navigation.navigate('Home'))
      .catch(error => this.setState({ errorMessage: error.message }))
           
    }


      goBack = () => {
        this.props.navigation.navigate('StartScreen')
      }
    


    render(){

        
        return (
            <Container style = {styles.container}>
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
                    onPress={() => this.handleLogin(this.state.email, this.state.password)}>

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
                    onPress={this.showModal}>

                        <Text style = {{color:'white'}}>Forgot Password</Text>
                    </Button>

                    {this.state.modalVisible && ( 
                  <ForgotPassword 
                    modalVisible = {this.state.modalVisible}
                    showModal = {this.showModal}
         
                  />)}


                </Form>
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