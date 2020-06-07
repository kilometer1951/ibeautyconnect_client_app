import {USER} from '../actions/authAction';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  user: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER:
      return {
        user: action.user,
      };
    default:
      return state;
  }
  return state;
};
