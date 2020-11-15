import { combineReducers } from 'redux';

const INITIAL_STATE = {
email: null,
playgroundName: '',
playgroundId:'',
playgroundLat:null,
playgroundLon:null,
playgroundModal: false,
addPlaygroundModal: false,
addGroupModal: false,
yourGroupModal: false,
preCheckModal: false,
isAnanimous: false,
preCheckStatus: false,
userInfo:null,
reportModal: false,
reportWeatherModal: false,
userId:[],
tracking: false,
weather:null,
isRunningNotification: false,
playgroundIdAuto: null
};

const ourReducer = (state = INITIAL_STATE, action) => {
    const newState = { ...state };

  switch (action.type) {

    case "TRACKING":
                      return{
                        ...state,
                        tracking: action.value
                      }
                    break;
    case "STORE_PLAYGROUND_AUTO":
      return{
        ...state,
        playgroundIdAuto: action.value,
      }
    break;
    
    case "MODAL_REPORT":
      return{
        ...state,
        reportModal: action.value,
      }
    break;

    case "MODAL_WEATHER":
      return{
        ...state,
        reportWeatherModal: action.value,
      }
    break;

    case "SET_WEATHER":
      return{
        ...state,
        weather: action.value,
      }
    break;

    case "SET_NOTIFICATIONS":
      return{
        ...state,
        isRunningNotification: action.value,
      }
    break;

    

    case "SET_SITE_DATA":
      return{
        ...state,
        playgroundId: action.value
      }
    break;

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
        
        case "OPEN_CLOSE_YOUR_GROUP_MODAL":
      
          return{
            ...state,
            yourGroupModal: action.value,
            
    
          }
          break;
        case "OPEN_CLOSE_ADD_GROUP_MODAL":
      
          return{
            ...state,
            addGroupModal: action.value,
            
    
          }
          break;
        case "SET_ANANIMOUS":
      
          return{
            ...state,
            isAnanimous: action.value,
            
    
          }
          break;
          case "STORE_USER_ID":
      
            return{
              ...state,
              userId: [action.value,action.value1,action.value2,action.value3],
              
      
            }
            break;

         

  
  }
  return newState;
};


export default combineReducers({
  reducer: ourReducer,
});
