/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';

import React, {useState, useEffect} from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';

import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';

import * as appAction from './store/actions/appAction';

import io from 'socket.io-client';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AppState,
  YellowBox,
  TouchableWithoutFeedback,
} from 'react-native';
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);

import authReducer from './store/reducers/authReducer';
import appReducer from './store/reducers/appReducer';

import Colors from './contants/Colors';
import Fonts from './contants/Fonts';
import {URL} from './socketURL';

const rootReducer = combineReducers({
  authReducer: authReducer,
  appReducer: appReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

import AppNavigator from './navigation/AppNavigator';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);

const App: () => React$Node = () => {
  const socket = io(URL);
  const [messageNotification, setMessageNotification] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      //  console.log('App has come to the foreground!');
    } else {
      //    console.log('background');
    }
  };

  // useEffect(() => {
  //   const _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
  //     'FinishedPlaying',
  //     ({success}) => {
  //       //  console.log('finished playing', success);
  //     },
  //   );
  //
  //   return () => {
  //     _onFinishedPlayingSubscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    socket.on('newMessage', async function (msg) {
      const userData = await AsyncStorage.getItem('@userData');
      const data = await JSON.parse(userData);
      if (data) {
        if (msg.msg.to == data.user._id) {
          //  SoundPlayer.playSoundFile('newMessage', 'mp3');
          setNewMessageText(`You have a new message from ${msg.msg.from_name}`);
          setMessageNotification(true);
          setTimeout(() => {
            setMessageNotification(false);
          }, 2000);
        }
      }
    });
  }, []);

  useEffect(() => {
    socket.on('newSupportMessage', async function (messageData) {
      const userData = await AsyncStorage.getItem('@userData');
      const data = await JSON.parse(userData);

      if (data) {
        if (messageData.to == data.user._id) {
          //  SoundPlayer.playSoundFile('newMessage', 'mp3');
          setNewMessageText(`You have a new message from support`);
          setMessageNotification(true);
          setTimeout(() => {
            setMessageNotification(false);
          }, 2000);
        }
      }
    });
  }, []);

  useEffect(() => {
    socket.on('noShow', async function (noShowAppoitmentData) {
      const userData = await AsyncStorage.getItem('@userData');
      const data = await JSON.parse(userData);

      if (data) {
        if (noShowAppoitmentData.clientId == data.user._id) {
          setNewMessageText(`You missed one of your appointment`);
          setMessageNotification(true);
          setTimeout(() => {
            setMessageNotification(false);
          }, 2000);
        }
      }
    });
  }, []);
  return (
    <Provider store={store}>
      <View style={{flex: 1}}>
        {messageNotification && (
          <SafeAreaView
            style={{
              backgroundColor: Colors.purple_darken,
              alignItems: 'center',
              height: 80,
              flex: 1,
              position: 'absolute',
              zIndex: 1,
              width: '100%',
            }}>
            <Text style={{color: '#fff', fontFamily: Fonts.poppins_regular}}>
              {newMessageText}
            </Text>
          </SafeAreaView>
        )}
        <AppNavigator />
      </View>
    </Provider>
  );
};

export default App;
