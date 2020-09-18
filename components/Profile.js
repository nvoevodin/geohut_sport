import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button, Content, Card, CardItem, Body } from "native-base";
import * as firebase from 'firebase';
import PageTemplate from './subComponents/Header'
import ChangeInfo from './subComponents/changeInformationModal'
//import Layout from '../constants/Layout';
 

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
    modalVisible: false,
    total: null,
    totalWeek: null,
    showHistory: false,
    data:null
  }



//CHANGE INFO MODAL TOGGLE
  showModal =() => {
    this.setState({ modalVisible : !this.state.modalVisible })
  }


  componentDidMount() {
    this.readUserData()
    
  }

  getCheckinData =() => {
  
    fetch(`https://geohut.metis-data.site/historycheckins/${this.props.reducer.userInfo.workId}`)
      .then(res => res.json())
      .then(res => {
       console.log(res["data"])
        this.setState({ data: res["data"], showHistory: true })
      })
  }


  readUserData() {

  
    firebase.database().ref('UsersList/'+ this.uid + '/info').once('value', snapshot => {
     
    let data = snapshot.val()

       
        this.setState({ firstName: data.firstName,
                        lastName: data.lastName,
                        workId: data.workId});

                        fetch(`https://geohut.metis-data.site/checkins/${this.props.reducer.userInfo.workId}`)
                        .then(res => res.json())
                        .then(res => {
                          console.log(res.data)
                
                    this.setState({total:res.data[0]['total']})
                    
                        }).catch(error => this.setState({totalWeek: 0}))
                      
                        


                        fetch(`https://geohut.metis-data.site/checkinsWeek/${this.props.reducer.userInfo.workId}`)
                        .then(res => res.json())
                        .then(res => {
                          console.log(res.data)
                    this.setState({totalWeek:res.data[0]['count_ins']})
                    
                        }).catch(error => {
                         
                          
                          this.setState({totalWeek: 0})})
    })
    
  }

  showHistory = () => {
    this.setState({ showHistory : !this.state.showHistory })
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
                  <Text>{this.state.workId}</Text>
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
                  <View style={styles.cardContainer}>
                    <Text style={styles.cartTitles}>Check-Ins This Week: </Text>
                    <Text>{this.state.totalWeek}</Text>
                  </View>
                  <View style={styles.cardContainer}>
                    <Text style={styles.cartTitles}>Total Check-Ins: </Text>
                    <Text>{this.state.total}</Text>
                  </View>
                
                </Body>
              </CardItem>
              
            </Card>
              
               <Button style ={{margin:10, marginTop: 40}}
               full
               rounded
               primary
               onPress={this.showModal}>
                   <Text style = {{color:'white'}}>Change Info</Text>
               </Button>
              
           
                    
                    <Button style ={{margin:10}}
                      full
                      rounded
                      primary
                      onPress={this.getCheckinData}>
                      <Text style = {{color:'white'}}>{this.state.showHistory ? 'Refresh Checkin History' : 'Show Checkin History'}</Text>
                    </Button>
                    { this.state.showHistory ?
                    <Button style ={{margin:10, marginTop: 5}}
                      full
                      rounded
                      primary
                      onPress={()=>Alert.alert('Data sharing is coming soon! Thank you for your patience.')}>
                      <Text style = {{color:'white'}}>Share my Data</Text>
                    </Button> : <View></View>
                    }

                    { this.state.showHistory ?
                     
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
                    }

                   
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



export default connect(mapStateToProps
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