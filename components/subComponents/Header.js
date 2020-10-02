import React, {Component} from 'react';
import {Text,View, StyleSheet, TouchableOpacity} from 'react-native';





class PageTemplate extends Component {



    render() {
        return (
            <React.Fragment>
            <View style={{backgroundColor: '#5cb85c', alignSelf: 'stretch',width: '100%', height:'11%',
    justifyContent: 'flex-end'}}>

      <Text 
              style={{
                  position: 'absolute',
                  marginTop: '6%',
                  marginLeft: '3%',
                  color: 'white', 
                  fontSize: 35}}
                  >
                       {this.props.title}
              </Text>

</View>
                
                <View style=
                        {{position:'absolute',
                          marginTop: '10%',
                          right: 14,
                          
                          display: 'flex',
                          flexDirection: 'row',
                          flex:1
                          }}>
                <TouchableOpacity onPress={this.props.logout}>
                    <Text style ={{color:'white',fontSize: 20}}>Logout</Text>
                    {/* <Ionicons  name="ios-arrow-dropleft" size={32} color="white" /> */}
                </TouchableOpacity>
                </View>
 
                </React.Fragment>
    
         
        );
    }
}

export default PageTemplate;
