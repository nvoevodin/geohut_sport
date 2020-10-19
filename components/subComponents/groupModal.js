import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity,View,ActivityIndicator, Switch} from 'react-native';
import {Container, Header, Content, ListItem, List, Icon, Button, Left,Input, Body, Title,Text, Form,Textarea} from 'native-base';
import { connect } from 'react-redux';






class YourGroup extends Component {

    state = {
    

            submittedAnimation: false,
            members:["i"]
        
        
    }

    componentDidMount() {

        console.log('first skometing')
        //this.getMembers()
          
      }

      componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.id !== prevProps.id) {
            this.getMembers()
        }
      }


 


      getMembers = () =>{
        fetch(`${global.x}/get_group_members/${this.props.id}`)
        .then((res) => res.json())
        .then((res) => {
            
        this.setState({members:JSON.parse(res.data[0]["JSON_EXTRACT(members, '$')"])})
        
        }).catch((error) => {
          console.log(error)
        });
      }


 




  render() {

//console.log(this.state.groupId)
      
    return (
        <React.Fragment>
        <Modal
          animationType="slide"
          transparent={false}
          visible={true}
          visible={this.props.reducer.yourGroupModal}
          >

<Container>
        <Header style = {{backgroundColor:'#e3e8e6'}}>
        <Left>
            <Button transparent onPress={this.props.closeYourPlaygroundModal}>
              <Icon name='arrow-back' style = {{color:'black'}}/>
            </Button>
          </Left>
          <Body>
            <Title style = {{color:'black'}}>{this.props.title}</Title>
          </Body>
          
        </Header>
        <List>
        
        {this.state.members.map((object,index) =>
          
          <ListItem  key = {index}>
  <Left>
<Text>{object}</Text>
  </Left>
  </ListItem>)}

  </List>



  
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
      closeYourPlaygroundModal: () => dispatch({ type: "OPEN_CLOSE_YOUR_GROUP_MODAL", value: false})
      
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(YourGroup)