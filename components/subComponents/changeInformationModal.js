import React, { Component } from 'react';
import { StyleSheet, Modal,Text } from 'react-native';
import {Container,  Form, Input, Item, Button, Label} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';


class changeInfo extends Component {

    

    state = {
        firstName: '',
        lastName: ''
    }


    updateFName = (firstName) => {
        this.setState({ firstName: firstName.trim() });
      }
    
      updateLName = (lastName) => {
        this.setState({ lastName: lastName.trim() });
      }
    
    
    
    submitInfo = async (firstName,lastName,uid) => {


       await fetch(
            // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
            `${global.x}/update_user_info?first_name=${firstName}&last_name=${lastName}&uid=${uid}`,
            { method: "PUT" }
          ).catch((error) => {
            console.log(error)
          })

          try{
          await  AsyncStorage.setItem('user_info', JSON.stringify([uid, firstName, lastName, this.props.reducer.userId[3]]))
          console.log('as')
          await this.props.storeUserId(uid, firstName, lastName, this.props.reducer.userId[3])
        } catch (e) {
          console.log(e)
        }

        alert('Name changed.')
          
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
                        onChangeText={(firstName) => this.updateFName(firstName)}
                    value={this.state.firstName}/>
                    </Item>

                    <Item floatingLabel>
                        <Label>Last Name</Label>
                        <Input
                        autoCorrect={false}
                        autoCapitalize='none'
                        onChangeText={(lastName) => this.updateFName(lastName)}
                    value={this.state.lastName}/>
                    </Item>

                    <Button style ={{margin:10}}
                    full
                    rounded
                    success
                    onPress={()=> this.submitInfo(this.state.firstName, this.state.lastName, this.props.reducer.userId[0])}>

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

const mapStateToProps = (state) => {
    
    const { reducer } = state
    return { reducer }
  };
  
  const mapDispachToProps = dispatch => {
    return {
  
      storeUserId: (id,fname,sname,email) => dispatch({ type: "STORE_USER_ID", value: id, value1:fname, value2:sname, value3:email})
  
    };
  };
  
  export default connect(mapStateToProps, mapDispachToProps)(changeInfo);

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 40
      },
  
   
  });