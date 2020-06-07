import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ActivityIndicator, Linking} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

import AsyncStorage from '@react-native-community/async-storage';

import * as authActions from '../store/actions/authAction';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {DotIndicator} from 'react-native-indicators';

const StartUpScreen = (props) => {
  const dispatch = useDispatch();
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    //AsyncStorage.clear();
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        setNetworkError(false);
        const tryLogin = async () => {
          const userData = await AsyncStorage.getItem('@userData');
          //  console.log(userData);
          if (!userData) {
            props.navigation.navigate('Auth');
            return;
          }
          //dispatch
          await dispatch(authActions.getUser(userData));
          props.navigation.navigate('App');
        };

        tryLogin();
      } else {
        setNetworkError(true);
      }
    });
  }, []);

  return (
    <View style={styles.screen}>
      {networkError && (
        <Text
          style={{
            position: 'absolute',
            top: 70,
            fontFamily: Fonts.poppins_regular,
            zIndex: 1,
          }}>
          Network error please check your network
        </Text>
      )}
      <View style={styles.screen}>
        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 30,
            color: Colors.pink,
          }}>
          iBeautyConnect
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
          }}>
          Instant Beauty Connect
        </Text>
      </View>
      <View style={{bottom: 40, flexDirection: 'row'}}>
        <View style={{height: 20}}>
          <DotIndicator
            color={Colors.purple_darken}
            size={10}
            style={{marginTop: 15}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default StartUpScreen;
