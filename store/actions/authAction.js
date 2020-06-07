import AsyncStorage from '@react-native-community/async-storage';
import {URL} from '../../socketURL';

export const USER = 'USER';

//https://hidden-lowlands-41526.herokuapp.com
//http://localhost:5002

export const verifiyPhoneNumber = async phone => {
  //  return async dispatch => {
  const response = await fetch(`${URL}/auth_client/verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const createAcctount = async (name, phone, email) => {
  const response = await fetch(`${URL}/auth_client/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      phone,
      email,
    }),
  });
  const resData = await response.json();
  await AsyncStorage.setItem(
    '@userData',
    JSON.stringify({
      user: resData.user,
    }),
  );

  return resData;
};

export const getUser = userData => {
  return async dispatch => {
    const data = await JSON.parse(userData);
    dispatch({type: USER, user: data});
  };
};
