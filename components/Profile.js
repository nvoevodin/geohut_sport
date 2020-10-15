import React, {Component} from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Switch } from 'react-native';
import { Button, Content, Card, CardItem, Body, Right, Left } from "native-base";
import * as firebase from 'firebase';
import PageTemplate from './subComponents/Header'
import ChangeInfo from './subComponents/changeInformationModal'
import { AntDesign } from '@expo/vector-icons'; 
//import Layout from '../constants/Layout';
import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';

class Profile extends Component {


  logout = () =>{
    firebase.auth().signOut()
        .catch(error => console.log(error))

    this.props.navigation.navigate('StartScreen')
  }


  uid = firebase.auth().currentUser.uid;

  state = {
    firstName:'',
    lastName:'',
    email:'',
    modalVisible: false,
    total: null,
    totalWeek: null,
    showHistory: false,
    data:null,
    isEnabled: this.props.reducer.isAnanimous
  }

  toggleSwitch = () => {

    this.props.setAnanimous(!this.state.isEnabled)
    this.setState({isEnabled: !this.state.isEnabled})
    try {
     AsyncStorage.setItem('anonimous', JSON.stringify(!this.state.isEnabled))
    } catch (e) {
      console.log(e)
      console.log('something wrong (storage)')
    }
  
  };


//CHANGE INFO MODAL TOGGLE
  showModal =() => {
    this.setState({ modalVisible : !this.state.modalVisible })
  }


  componentDidMount() {
    console.log(this.props.reducer.isAnanimous)
    this.readUserData()
    
  }

  // getCheckinData =() => {
  
  //   fetch(`https://geohut.metis-data.site/historycheckins/${this.props.reducer.userInfo.workId}`)
  //     .then(res => res.json())
  //     .then(res => {
  //      console.log(res["data"])
  //       this.setState({ data: res["data"], showHistory: true })
  //     })
  // }


  readUserData() {

  
    firebase.database().ref('UsersList/'+ this.uid + '/info').once('value', snapshot => {
     
    let data = snapshot.val()

       
        this.setState({ firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email});

                    //     fetch(`https://geohut.metis-data.site/checkins/${this.props.reducer.userInfo.workId}`)
                    //     .then(res => res.json())
                    //     .then(res => {
                    //       console.log(res.data)
                
                    // this.setState({total:res.data[0]['total']})
                    
                    //     }).catch(error => this.setState({totalWeek: 0}))
                      
                        


                    //     fetch(`https://geohut.metis-data.site/checkinsWeek/${this.props.reducer.userInfo.workId}`)
                    //     .then(res => res.json())
                    //     .then(res => {
                    //       console.log(res.data)
                    // this.setState({totalWeek:res.data[0]['count_ins']})
                    
                    //     }).catch(error => {
                         
                          
                    //       this.setState({totalWeek: 0})})
    })
    
  }

  // showHistory = () => {
  //   this.setState({ showHistory : !this.state.showHistory })
  // }

question = () => {
  alert("If you are anonimous, your name will not be displayed in the CheckIn and Pre-CheckIn lists in the Players tab")
}
    render(){

        return (
          <React.Fragment>
          <PageTemplate title={'Profile'} logout = {this.logout}/>
          <Content padder>
            <Card>
              <CardItem header bordered>
                <View style={styles.cardContainer}>
                  <Text style={styles.cartTitles}>User Id: </Text>
                  <Text>{this.state.email}</Text>
                </View>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <View style={styles.cardContainer}>
                    <Text style={styles.cartTitles}>First Name: </Text>
                    <Text>{this.state.firstName}</Text>
                  </View>
                  <View style={styles.cardContainer}>
                    <Text style={styles.cartTitles}>Last Name: </Text>
                    <Text>{this.state.lastName}</Text>
                  </View>
                  {/* <View style={styles.cardContainer}>
                    <Text style={styles.cartTitles}>Check-Ins This Week: </Text>
                    <Text>{this.state.totalWeek}</Text>
                  </View>
                  <View style={styles.cardContainer}>
                    <Text style={styles.cartTitles}>Total Check-Ins: </Text>
                    <Text>{this.state.total}</Text>
                  </View> */}
                
                </Body>
              </CardItem>
              <CardItem>
<Left>
              <Text style={styles.cartTitles}>Anonimous: </Text>
                    {this.state.isEnabled?<Text>Yes</Text>:<Text>No</Text>}
                    <TouchableOpacity onPress={this.question}>
                    <AntDesign style = {{marginLeft: 10}} name="questioncircleo" size={24} color="black" />
                    </TouchableOpacity>
                    </Left>
                <Right>
              <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={this.state.isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={this.toggleSwitch}
        value={this.state.isEnabled}
      />
      </Right>
              </CardItem>
            </Card>
              
               <Button style ={{margin:10, marginTop: 40}}
               full
               rounded
               primary
               onPress={this.showModal}>
                   <Text style = {{color:'white'}}>Change Info</Text>
               </Button>
              
           
                    
                    {/* <Button style ={{margin:10}}
                      full
                      rounded
                      primary
                      onPress={this.getCheckinData}>
                      <Text style = {{color:'white'}}>{this.state.showHistory ? 'Refresh Checkin History' : 'Show Checkin History'}</Text>
                    </Button> */}
                    {/* { this.state.showHistory ?
                    <Button style ={{margin:10, marginTop: 5}}
                      full
                      rounded
                      primary
                      onPress={()=>Alert.alert('Data sharing is coming soon! Thank you for your patience.')}>
                      <Text style = {{color:'white'}}>Share my Data</Text>
                    </Button> : <View></View>
                    } */}

                    {/* { this.state.showHistory ?
                     
                      this.state.data.map((item, index) => (
                        <View key = {index} style = {styles.item}>
                                <View style={styles.cardContainer}>
                                  <Text style={styles.cartTitles}>Name: </Text>
                                  <Text>{`${this.state.firstName} ${this.state.lastName}`}</Text>
                                </View>
                                <View style={styles.cardContainer}>
                                  <Text style={styles.cartTitles}>Checkin Site: </Text>
                                  <Text>{`${item.site_id}`}</Text>
                                </View>
                                <View style={styles.cardContainer}>
                                  <Text style={styles.cartTitles}>Checkin Time Stamp: </Text>
                                  <Text>{`${item.checkin_date_time.substring(0,10)} ${item.checkin_date_time.substring(11,16)}`}</Text>
                                </View>
                        </View>
                      ))  : <View></View>
                    } */}

                   
          </Content>
       <ChangeInfo 
       modalVisible = {this.state.modalVisible}
       showModal = {this.showModal}
       
       />
        </React.Fragment>
          );

    }



}


const mapStateToProps = (state) => {
    
  const { reducer } = state
  return { reducer }
};

const mapDispachToProps = dispatch => {
  return {
    setAnanimous: (x) => dispatch({ type: "SET_ANANIMOUS", value: x}),

  };
};



export default connect(mapStateToProps,
  mapDispachToProps
  )(Profile);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding:40
  },
  item: {
    //flex: 1,
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
    padding: 20,
    margin: 2,
    //borderColor: '#2a4944',
    borderRadius: 10,
    //idth: Layout.window.width - 20,
    //width:'100%',
    alignSelf: 'stretch',
    borderWidth: 1,
    backgroundColor: '#a7a6ba'
 },
  cardContainer: {
    //marginTop: 8,
    //paddingVertical: 15,
    //paddingHorizontal: 5,
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
},
  cartTitles: {
    fontWeight: "bold"
}
});