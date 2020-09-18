import { combineReducers } from 'redux';

const INITIAL_STATE = {
email: null,
siteData: null,
workId: null,
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

                    case "SET_SITE_DATA":
                      return{
                        ...state,
                        siteData: action.value
                      }
                    break;
  
  }
  return newState;
};


export default combineReducers({
  reducer: ourReducer,
});
