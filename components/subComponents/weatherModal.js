import React, { Component } from "react";
import {
  Alert,
  Modal,



  View,
  SafeAreaView,
  TouchableOpacity,

} from "react-native";
import {Container, Header, Content, ListItem, List, Icon, Button, Left,Title,Text, Right} from 'native-base';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import moment from "moment";

class WeatherReport extends Component {
  state = {
    temperature:null,
    conditions:null,
    wind:null,
    lastUpdated:null,
    overall:''

  };

  async componentDidMount() {

    fetch(`${global.x}/pullTemperature/${this.props.reducer.playgroundId}`)
    .then((res) => res.json())
    .then( async (res)  => {
        
        const weather = await res.data[0]["weather"].split(',')

        this.setState({temperature:parseFloat(weather[0]), conditions: weather[1], wind: parseFloat(weather[2]), lastUpdated:res.data[0]["weather_datetime"]})
        //console.log(JSON.parse("[" + res.data[0]["weather"] + "]"))

        console.log('no error')
        {weather !== null?(new Date()).getTime() - moment(res.data[0]["weather_datetime"]).valueOf() > 3560000?this.updateWeather():null:this.updateWeather()}
        
        console.log(parseFloat(weather[0]) > 95 || parseFloat(weather[0]) < 40 || weather[1] !== 'Clear' && weather[1] !== 'Clouds' || parseFloat(weather[2]) > 14)
        try{
            if(parseFloat(weather[0]) > 95 || parseFloat(weather[0]) < 40 || (weather[1] !== 'Clear' && weather[1] !== 'Clouds') || parseFloat(weather[2]) > 14) {
                this.props.setWeather('Bad')
                this.setState({overall:'Bad'})

              } else if ((parseFloat(weather[0]) <= 95 && parseFloat(weather[0]) >= 60) && (weather[1] === 'Clear' || weather[1] === 'Clouds') && parseFloat(weather[2]) < 7){
                this.props.setWeather('Perfect')
                this.setState({overall:'Perfect'})
              } else if(parseFloat(weather[2]) < 11 && (parseFloat(weather[0]) <= 95 && parseFloat(weather[0]) >= 50)){
                this.props.setWeather('Good')
                this.setState({overall:'Good'})
              }
              else if(parseFloat(weather[2]) <= 14 && parseFloat(weather[0]) >= 40) {
                this.props.setWeather('Acceptable')
                this.setState({overall:'Acceptable'})
              } 

        } catch(e){console.log(e)}

    //this.setState({players:res.data})
    }).catch((error) => {
        //this.setState({temperature:0, conditions: '', wind: 0, lastUpdated:null, overall:''})
        this.updateWeather()
      console.log('error')
    });


  }


  componentDidUpdate(prevProps){
    if(prevProps.reducer.playgroundId !== this.props.reducer.playgroundId){


        fetch(`${global.x}/pullTemperature/${this.props.reducer.playgroundId}`)
        .then((res) => res.json())
        .then((res) => {

            const weather = res.data[0]["weather"].split(',')
            this.setState({temperature:parseFloat(weather[0]), conditions: weather[1], wind: parseFloat(weather[2]), lastUpdated:res.data[0]["weather_datetime"]})
            //console.log(JSON.parse("[" + res.data[0]["weather"] + "]"))
            {weather !== null?(new Date()).getTime() - moment(res.data[0]["weather_datetime"]).valueOf() > 3560000?this.updateWeather():null:this.updateWeather()}
            console.log('weather')
            console.log(weather)
            console.log(parseFloat(weather[0]) > 95 || parseFloat(weather[0]) < 40 || weather[1] !== 'Clear' || weather[1] !== 'Clouds' || parseFloat(weather[2]) > 14)
            try{
                if(parseFloat(weather[0]) > 95 || parseFloat(weather[0]) < 40 || (weather[1] !== 'Clear' && weather[1] !== 'Clouds') || parseFloat(weather[2]) > 14) {
                    this.props.setWeather('Bad')
                    this.setState({overall:'Bad'})

                  } else if ((parseFloat(weather[0]) <= 95 && parseFloat(weather[0]) >= 60) && (weather[1] === 'Clear' || weather[1] === 'Clouds') && parseFloat(weather[2]) < 7){
                    this.props.setWeather('Perfect')
                    this.setState({overall:'Perfect'})
                  } else if(parseFloat(weather[2]) <= 14 && parseFloat(weather[0]) >= 40) {
                    this.props.setWeather('Acceptable')
                    this.setState({overall:'Acceptable'})
                  } else if(parseFloat(weather[2]) < 11 && (parseFloat(weather[0]) <= 95 && parseFloat(weather[0]) >= 50)){
                    this.props.setWeather('Good')
                    this.setState({overall:'Good'})
                  }

            } catch(e){console.log(e)}

        //this.setState({players:res.data})
        }).catch((error) => {
            //this.setState({temperature:0, conditions: '', wind: 0, lastUpdated:null, overall:''})
            this.updateWeather()
          console.log('error')
        });

  }
  }


  updateWeather = async () =>{

    await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${this.props.reducer.playgroundLat}&lon=${this.props.reducer.playgroundLon}&units=imperial&appid=e9eca7a76db49a5c816dde3e666730db`)
    .then(res => res.json())
    .then(res => {
this.setState({temperature:res["main"]['temp'], conditions: res["weather"][0]["main"], wind:res["wind"]["speed"], lastUpdated: moment()})

fetch(
    // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
    `${global.x}/addTemperature?playground_id=${this.props.reducer.playgroundId}&weather=${[res["main"]['temp'],res["weather"][0]["main"],res["wind"]["speed"]]}&weather_datetime=${moment().utc().format("YYYY-MM-DD HH:mm:ss").substr(0, 18) + "0"}`,
    { method: "POST" }
  ).catch((error) => {
    console.log(error)
  })



    })
    .catch((error) => {
      console.log(error)
    });






  }


  render() {

//console.log(this.state)

   //console.log(moment(this.state.lastUpdated).valueOf())

    return (

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.reducer.reportWeatherModal}
          propagateSwipe={true}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >

<View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'}}>

    <SafeAreaView style={{
        borderRadius:20,
            width: 300,
            height: 420,
            flexDirection: 'column',
            padding: 20,
            backgroundColor:"#ebf2f2",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
            }}>

<Title style = {{textAlign:'center', color: 'black', fontWeight:'bold', marginBottom: 3, fontSize:18, marginTop: 3}}>Playing Conditions</Title>
        <Title style = {{textAlign:'center', color: 'red', marginBottom: 5, fontWeight:'bold', fontSize:20}}>{this.state.overall}</Title>

                <List>
        <ListItem style = {{marginTop:10}}>

          <Left>
          <FontAwesome5 name="temperature-low" size={30} color="black" />
          </Left>


        <Text style ={{fontWeight:'bold',fontSize:25}}>{Math.round(this.state.temperature)}F</Text>


            </ListItem>
            <ListItem style = {{marginTop:7}}>

<Left>
<FontAwesome5 name="cloud-sun" size={30} color="black" /></Left>


<Text style ={{fontWeight:'bold',fontSize:25}}>{this.state.conditions}</Text>


  </ListItem>
  <ListItem style = {{marginTop:7}}>

<Left>
<FontAwesome5 name="wind" size={30} color="black" />
</Left>


        <Text style ={{fontWeight:'bold',fontSize:25}}>{Math.round(this.state.wind)}M</Text>


  </ListItem>
            </List>

            <Text style = {{textAlign:'right', fontSize:11, marginTop:3, marginRight:5}}>Last Updated: {moment(this.state.lastUpdated).format('LT')}</Text>

            {/* <Button style={{ margin: 10, marginTop:15 }}
            full
            rounded
            success
            onPress = {()=>{this.state.lastUpdated !== null?(new Date()).getTime() - moment(this.state.lastUpdated).valueOf() > 3560000?this.updateWeather():alert('Update only once an hour!'):this.updateWeather()}}
            >
            <Text style={{ color: 'white', fontSize:12 }}>Refresh</Text>
          </Button>
          <Button style={{ margin: 10, marginTop:15 }}
            full
            rounded
            danger
            onPress={this.props.onModalOne}
            >
            <Text style={{ color: 'white', fontSize:12 }}>Close</Text>
          </Button> */}

                      {/* <Button style={{ margin: 10 }}
            full
            rounded
            primary
            >
            <Text style={{ color: 'white' }}>Add Yourself</Text>
          </Button>     */}
          <View style={{width: '70%', marginTop: '7%', marginLeft:'15%',marginRight:'15%',flexDirection:'row', justifyContent:'space-between'}}>
          <TouchableOpacity onPress={this.props.onModalOne}
>
    <MaterialIcons name="cancel" size={40} color="black" />
    </TouchableOpacity>
    <TouchableOpacity 
    onPress = {()=>{this.state.lastUpdated !== null?(new Date()).getTime() - moment(this.state.lastUpdated).valueOf() > 3560000?this.updateWeather():alert('Update only once an hour!'):this.updateWeather()}}

    >
    <Ionicons name="md-refresh-circle" size={41} color="green" />
        </TouchableOpacity>
          </View>


    </SafeAreaView>
    {/* <TouchableOpacity onPress={this.props.onModalOne}>
    <MaterialIcons style = {{marginTop: 15}} name="cancel" size={40} color="black" />
    </TouchableOpacity> */}
    </View>
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
      onModalOne: () => dispatch({ type: "MODAL_WEATHER", value: false}),
      setWeather: (x) => dispatch({ type: "SET_WEATHER", value: x}),
     // storePlayground: (name,id,lat,lon) => dispatch({ type: "STORE_PLAYGROUND", value: name,value1: id, value2:lat,value3:lon})

    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(WeatherReport)