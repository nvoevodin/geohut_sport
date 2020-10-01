import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity} from 'react-native';
import {Container, Header, Content, List, ListItem, Icon, Button, Left,Right, Body, Title,Text, Picker} from 'native-base';
import { connect } from 'react-redux';



//let x = 'http://10.244.57.219:3002'

//let x = 'http://192.168.2.5:3002'
let x = 'https://volleybuddy.metis-data.site'


class PlaygroundModal extends Component {

    state = {
         playgrounds: []
    }

    componentDidMount() {
        this.getPlaygrounds()
        
    }

    getPlaygrounds = () => {
    fetch(`${x}/sites`)
    .then((res) => res.json())
    .then((res) => {
    this.setState({playgrounds:res.data})
    
    }).catch((error) => {
      console.log(error)
    });

}

selectPlayground = (name,id,lat,lon) => {
this.props.storePlayground(name,id,lat,lon)





}


  render() {

  
      
    return (
        <React.Fragment>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.reducer.playgroundModal}
          //visible={this.props.reducer.playgroundModal}
          >

<Container>
        <Header style = {{backgroundColor:'#e3e8e6'}}>
        <Left>
            <Button transparent onPress={this.props.onModalOne}>
              <Icon name='arrow-back' style = {{color:'black'}}/>
            </Button>
          </Left>
          <Body>
            <Title style = {{color:'black'}}>Select Playground</Title>
          </Body>
        </Header>
        <Content>
          <List>
          {this.state.playgrounds.map((object,index) =>
          
            <ListItem key = {index}>
                <Left>
              <Text>{object["site_name"]}</Text>
              </Left>
              <Right>
            <Button onPress={() => {this.selectPlayground(object["site_name"], object["site_id"], object["latitude"], object["longitude"]), this.props.onModalOne(), this.props.checkIfChecked()}}>
              <Icon name='arrow-forward'/>
            </Button>
          </Right>
              
            </ListItem>
        
          )}
          </List>
        </Content>
      </Container>


        </Modal>

        </React.Fragment>
    );
  }
}


// const styles = StyleSheet.create({
    
//   container: {
      
//      // <-- the magic
     
//     flex: 1,
//     flexDirection: 'column',
//     alignItems: 'center',
//     //justifyContent: 'center',
//     backgroundColor: '#e6eded'
   
//   },
//   buttonContainer: {
//       width: '40%',
//       position: 'absolute',
//   bottom:40
//   },
//   titleText: {
//     fontSize: 25,
//     fontWeight: 'bold',
//     marginTop: '5%'
//   },
//   listedText:{
//       marginTop:'3%',
//     fontSize: 15,
//     width: '80%',
//     textAlign: 'center'
//   }
 
// });

const mapStateToProps = (state) => {
    
    const { reducer } = state
    return { reducer }
  };

  const mapDispachToProps = dispatch => {
    return {
      onModalOne: () => dispatch({ type: "CLOSE_MODAL_1", value: false}),
      storePlayground: (name,id,lat,lon) => dispatch({ type: "STORE_PLAYGROUND", value: name,value1: id, value2:lat,value3:lon})
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(PlaygroundModal)

