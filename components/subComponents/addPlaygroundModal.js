import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity,View,ActivityIndicator} from 'react-native';
import {Container, Header, Content, Item, Label, Icon, Button, Left,Input, Body, Title,Text, Form,Textarea} from 'native-base';
import { connect } from 'react-redux';
import { getDistance } from "geolib";
import * as Location from "expo-location";





class AddPlayground extends Component {

    state = {
    
            Name: "",
            Address: "",
            submittedAnimation: false
        
        
    }


    calculateDistance = (start_x,start_y, end_x,end_y, name) => {
      try {
        let distance = getDistance(
          {
            latitude: start_x,
            longitude: start_y,
          },
          {
            latitude: end_x,
            longitude: end_y,
          },
          accuracy = 10
        );
       
        //checkin(distance);
        
          return {name: name, distance:distance};  
        } catch (error) {
        console.log(error)
      }
    }



    getCurrentLoc = async () => {
      this.setState({ submittedAnimation: true });
        try {
          let location = await Location.getCurrentPositionAsync({});
          location = await JSON.stringify(location);
          location = await eval("(" + "[" + location + "]" + ")");
          //location && console.log(location[0].coords.latitude);
          

          console.log(this.state.Name)
          console.log(this.state.Address)


          const map1 = await this.props.playgrounds.map((court) => {

          
            
            let distance = this.calculateDistance(
              court.latitude,
              court.longitude,
              location[0].coords.latitude,
              location[0].coords.longitude,
              court.site_name
            )
          
return(distance)

            
          })

         

          if (map1.some(e => e["distance"] < 350)){
            map1.map(e => {
              
              if(
                e["distance"] < 350
              ){
                alert(`This court already exists! Look for ${e["name"]} in the list of courts.`)
              }
              
            
             } )
         
          } else {
            fetch(
              // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
              `${global.x}/addPlayground?name=${this.state.Name}&address=${this.state.Address}&latitude=${location[0].coords.latitude}&longitude=${location[0].coords.longitude}`,
              { method: "POST" }
            ).catch((error) => {
              console.log(error)
            })
            alert("Playground is successfully added!");
            this.props.closeAddPlaygroundModal()
          }

          



          



        } catch (e) {
          alert("cannot get current location, try again or ask for help");
        }


        this.setState({ submittedAnimation: false });
      };


  render() {


      
    return (
        <React.Fragment>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.reducer.addPlaygroundModal}
          //visible={this.props.reducer.playgroundModal}
          >

<Container>
        <Header style = {{backgroundColor:'#e3e8e6'}}>
        <Left>
            <Button transparent onPress={this.props.closeAddPlaygroundModal}>
              <Icon name='arrow-back' style = {{color:'black'}}/>
            </Button>
          </Left>
          <Body>
            <Title style = {{color:'black'}}>Add a Playground</Title>
          </Body>

        </Header>
        <View style = {styles.container}>
           
            <Text style = {{textAlign:'center', fontSize:14, color:'#545755',marginLeft:'25%', marginRight:'25%', marginTop:'7%'}}>Please be responsible when adding your playground! Add all requested information! You must be at the playground to add it to the list.</Text>
           <Form>
        
          
           <Text style = {{textAlign:'center',fontSize:20, marginTop:'10%', marginBottom:'3%'}}>Name</Text>

            <Textarea underline blurOnSubmit={true} placeholder='Name the playground. Use the most recognized name. Ex.: Central Park Beach Volleyball Playground'
            onChangeText={(Name) => this.setState({ Name })}
            />
          
    

            <Text style = {{textAlign:'center',fontSize:20, marginTop:'10%', marginBottom:'3%'}}>Address</Text>

<Textarea underline blurOnSubmit={true} placeholder='Use the closest known address to the playground. Ex.: Central Park West, New York, NY 10019'
onChangeText={(Address) => this.setState({ Address })}
/>
    


          </Form>
          <Text style = {{textAlign:'center', fontSize:14, color:'#545755',marginLeft:'25%', marginRight:'25%', marginTop:'7%'}}>Once you click 'Submit', the location of the playground will be stored in the database. Make sure you are located at the playground before submitting!</Text>

<Button style ={{margin: 10,marginTop:80}}
                    full
                    rounded
                    success
                    onPress={this.getCurrentLoc}
                    >

                        <Text style = {{color:'white'}}>Submit</Text>
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
      closeAddPlaygroundModal: () => dispatch({ type: "CLOSE_MODAL_3", value: false})
      
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(AddPlayground)