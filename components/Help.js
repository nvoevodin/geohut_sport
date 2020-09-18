import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Linking } from 'react-native'
import PageTemplate from './subComponents/Header';
import Accordian from './subComponents/accordian'
import Layout from '../constants/Layout';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; 

const Colors = {
  PRIMARY:'#1abc9c',
  WHITE:'#ffffff',
  GREEN:'#0da935',
  LIGHTGRAY: '#C7C7C7',
  DARKGRAY: '#5E5E5E',
  CGRAY: '#ececec',
}


class Help extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menu :[
        { 
          title: "I am unable to get to my site, what should I do?", 
          data: 'You can document your excuse with your business services manager. Make sure to pre-checkin on the homepage so that REBNY staff know where you are.',
        },
        { 
          title: 'My site manager says I am not on the list for work, what should I do?',
          data: 'Please contact your business services manager at REBNY immediately for assistance with this issue.'
        },
        { 
         title: 'The app is not allowing me to pre-checkin and/or check in.',
         data: 'Please contact your business services manager to let them know you attempted to check in and send us an email at the address under "contact us".'
        },
        { 
         title: 'The app says I am not close enough to check in but I am, what do I do?',
         data: 'Please contact your business services manager to let them know you attempted to check in and send us an email at the address under "contact us".'
        }
      ]
     }
  }

  
  logout = () =>{
    firebase.auth().signOut()
        .catch(error => console.log(error))

    this.props.navigation.navigate('StartScreen')
  }


    render(){
      

        return (
          
          <View style={{flex:1}}>
            <PageTemplate title={'Help'} logout = {this.logout}/>
   
          <ScrollView style={{}}>
            <View style={{marginBottom: 60}}>

            <View style={styles.container}>
              <Text style={styles.titleText}>
                General
              </Text>
              <Text
                style={styles.generalText}
              >GeoHut is used by REBNY to help workers track their time at work. If you feel that any of the information regarding your account in this app is inaccurate please contact your case manager immediately.</Text>
              <Text style={styles.titleText}>
                FAQs
              </Text>
              <View style={styles.accordianContainer}>
                {
                this.state.menu.map((item, index) => (
                  <Accordian 
                    key = {index} 
                    title={item.title}
                    data={item.data}
                  />
                      
                  
                ))
                }
              </View>

              

              {/** PORTION DEALING WITH CONTACT*/}
              <View>
                <Text 
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginTop: '5%',
                    marginLeft: 130
                  }}
                >
                  Contact Us
                </Text>
                <Text
                  style={styles.generalText}
                >
                  If you are unable to resolve your issue using the information on this page please send an email to the following.
                </Text>

                <View style={{marginTop: 10}}>
                {/** FIRST CONTACT*/}
                <View style={styles.linkContainer}>
                  <Text>
                    Issues with your case: 
                  </Text>
                  <TouchableOpacity
                    style={[styles.helpButton, {marginLeft: 10}]}
                    onPress={() => Linking.openURL('mailto:support@example.com?subject=SendMail&body=Description')}
                  >
                    <Ionicons name="ios-mail" size={28} color="black" />
                  </TouchableOpacity>
                  
                </View>
                
              
                {/** SECOND CONTACT*/}
                <View style={styles.linkContainer}>
                  <Text>
                    Issues with the App: 
                  </Text>

                  <TouchableOpacity
                    style={[styles.helpButton, {marginLeft: 22}]}
                    onPress={() => Linking.openURL('mailto:support@example.com?subject=SendMail&body=Description')}
                  >
                  <Ionicons name="ios-mail" size={28} color="black" />
                </TouchableOpacity>
                </View>
                </View>

              </View>
              
            </View>


            </View>
            </ScrollView>
   
            </View>
        
          );

    }



}


export default Help

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: Layout.window.width - 20,
    marginLeft:10,
  },
  accordianContainer: {
    //flex:1,
    marginTop: 5,
    //backgroundColor:Colors.PRIMARY,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: '5%',
  },
  contactUs: {
    marginBottom: 280,
    backgroundColor: 'black'
  },
  generalText: {
    marginTop:5, 
  },
  linkContainer: {
    marginTop: 8,
    flexDirection: 'row',
    //paddingVertical: 15,
    //paddingHorizontal: 5,
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
  },
  helpButton: {
                      //position: 'absolute',
                      borderWidth:1,
                      borderColor:'rgba(0,0,0,0.2)',
                      alignItems:'center',
                      justifyContent:'center',
                      width:35,
                      height:35,
                      backgroundColor: '#FFDF00',
                      borderRadius:100,
                      shadowColor: 'rgba(0,0,0, .4)', // IOS
                      shadowOffset: { height: 1, width: 1 }, // IOS
                      shadowOpacity: 1, // IOS
                      shadowRadius: 1, //IOS
                      elevation: 15, // Android
                      zIndex: 1
  }

});

