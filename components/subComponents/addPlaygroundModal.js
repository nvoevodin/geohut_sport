import React, {Component} from 'react';
import {StyleSheet,Modal, ScrollView,View,ActivityIndicator} from 'react-native';
import {Container, Header, Content, Item, Label, Icon, Button, Left,Input, Body, Title,Text, Form,Textarea} from 'native-base';
import { connect } from 'react-redux';
import { getDistance } from "geolib";
import * as Location from "expo-location";
import CountryPicker from './countryPicker'
import ImageSelector from './imagePicker'



class AddPlayground extends Component {

    state = {
    
            Name: "",
            City: "",
            Country: "",
            Address: "",
            Image:null,
            submittedAnimation: false
        
        
    }

    componentDidMount = async () => {

      try {
        let location = await Location.getCurrentPositionAsync({});
        location = await JSON.stringify(location);
        location = await eval("(" + "[" + location + "]" + ")");

        const place = await Location.reverseGeocodeAsync({
          latitude : location[0].coords.latitude,
          longitude : location[0].coords.longitude
      });

        console.log(place)
       

      } catch(e){console.log('cant get')}

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
              `${global.x}/addPlayground?name=${this.state.Name}&city=${this.state.City.toLowerCase().trim()}&country=${this.state.Country.toLowerCase().trim()}&address=${this.state.Address}&latitude=${location[0].coords.latitude}&longitude=${location[0].coords.longitude}`,
              { method: "POST" }
            ).catch((error) => {
              console.log(error)
            })
            alert("Playground is successfully added!");
            this.props.closeAddPlaygroundModal()
          }

          



          



        } catch (e) {
          alert("cannot get current location");
        }


        this.setState({ submittedAnimation: false });
      };

      pickCountry = (x) =>{
    
        this.setState({Country:x})   
    }

    selectImage = (x) =>{
    
      this.setState({Image:x})   
  }



  uploadImage = async () => {
    // Check if any file is selected or not
    if (this.state.Image != null) {
      // If file selected then create FormData
      const fileToUpload = this.state.Image;
      const data = new FormData();
      data.append('name', 'Image Upload');
      data.append('file_attachment', fileToUpload);
      // Please change file upload URL
      console.log(data)
      const config = {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
      }
      fetch('http://192.168.2.6:3007/addImage', config)
       .then((checkStatusAndGetJSONResponse)=>{       
         console.log(checkStatusAndGetJSONResponse);
       }).catch((err)=>{console.log(err)});
    } else {
      // If no file selected the show alert
      alert('Please Select File first');
    }
  };




  render() {

console.log(this.state.Image)
      
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
        <ScrollView>
            <Text style = {{textAlign:'center', fontSize:14, color:'#545755',marginLeft:'20%', marginRight:'20%', marginTop:'7%'}}>Please be responsible when adding your playground! Add all requested information! You must be at the playground to add it to the list.</Text>
           <Form>
        
          
           <Text style = {{textAlign:'center',fontSize:20, marginTop:'10%', marginBottom:'3%'}}>Name *</Text>

            <Textarea underline blurOnSubmit={true} placeholder='Name the playground. Use the most recognized name. Ex.: Central Park Beach Volleyball Playground'
            onChangeText={(Name) => this.setState({ Name })}
            />

<Text style = {{textAlign:'center',fontSize:20, marginTop:'10%', marginBottom:'3%'}}>Country *</Text>

<Button 
full
primary
rounded 
onPress={this.props.onModalOne}>
<Text>Select Country</Text>
</Button>   
          
          <Text style = {{textAlign:'center',fontSize:20, marginTop:'10%', marginBottom:'3%'}}>City *</Text>

<Textarea underline blurOnSubmit={true} placeholder='Enter city here. Use a city, not a neighborhood. Ex.: New York.'
onChangeText={(City) => this.setState({ City })}
/>


            <Text style = {{textAlign:'center',fontSize:20, marginTop:'10%', marginBottom:'3%'}}>Address (optional)</Text>

<Textarea underline blurOnSubmit={true} placeholder='Use the closest known address to the playground. Ex.: Central Park West, New York, NY 10019'
onChangeText={(Address) => this.setState({ Address })}
/>

<ImageSelector selectImage = {this.selectImage}/>
    


          </Form>
          <Text style = {{textAlign:'center', fontSize:14, color:'#545755',marginLeft:'20%', marginRight:'20%', marginTop:'7%'}}>Once you click 'Submit', the location of the playground will be stored in the database. Make sure you are located at the playground before submitting!</Text>

<Button style ={{margin: 10,marginTop:80, marginBottom:80}}
                    full
                    rounded
                    success
                    onPress={this.getCurrentLoc}
                    >

                        <Text style = {{color:'white'}}>Submit</Text>
                    </Button>



                    <Button style ={{margin: 10,marginTop:80, marginBottom:80}}
                    full
                    rounded
                    success
                    onPress={this.uploadImage}
                    >

                        <Text style = {{color:'white'}}>upload</Text>
                    </Button>
                    </ScrollView>
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

<CountryPicker pickCountry = {this.pickCountry}/>
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
      closeAddPlaygroundModal: () => dispatch({ type: "CLOSE_MODAL_3", value: false}),
      onModalOne: () => dispatch({ type: "MODAL_COUNTRY_PICKER", value: true}),
      
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(AddPlayground)