import { combineReducers } from 'redux';

const INITIAL_STATE = {
email: null,
playgroundName: '',
playgroundId:'',
playgroundLat:null,
playgroundLon:null,
playgroundModal: false,
addPlaygroundModal: false,
preCheckModal: false,

preCheckStatus: false,
userInfo:null
};

const ourReducer = (state = INITIAL_STATE, action) => {
    const newState = { ...state };

  switch (action.type) {
        
                    case "SET_EMAIL_DATA":
                      return{
                        ...state,
                        email: action.value
                      }
                    break;

                    case "SET_USER_DATA":
                      return{
                        ...state,
                        userInfo: action.value
                      }
                    break;

                    case "STORE_PLAYGROUND":
                      return{
                        ...state,
                        playgroundName: action.value,
                        playgroundId: action.value1,
                        playgroundLat:action.value2,
                        playgroundLon:action.value3
                      }
                    break;
                    case "STORE_PRECHECK":
                      return{
                        ...state,
                        
                        preCheckStatus: action.value
                      }
                    break;
                    case "CANCEL_PRECHECK":
                      return{
                        ...state,
                        
                        preCheckStatus: action.value
                      }
                    break;
                    case "CLOSE_MODAL_1":
      
      return{
        ...state,
        playgroundModal: action.value,
        

      }
      break;
      case "CLOSE_MODAL_2":
      
      return{
        ...state,
        preCheckModal: action.value,
        

      }
      break;
      case "CLOSE_MODAL_3":
      
        return{
          ...state,
          addPlaygroundModal: action.value,
          
  
        }
        break;

  
  }
  return newState;
};


export default combineReducers({
  reducer: ourReducer,
});
