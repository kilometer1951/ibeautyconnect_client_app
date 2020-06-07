import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-community/async-storage';

import * as authActions from '../store/actions/authAction';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {WebView} from 'react-native-webview';
const deviceWidth = Dimensions.get('window').width;

const WebViewScreen = (props) => {
  const url = props.navigation.getParam('url');
  const title = props.navigation.getParam('title');
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('Profile');
              }}>
              <View
                style={{
                  marginHorizontal: 20,
                  height: 30,
                  width: 30,
                  paddingTop: 4,
                  alignItems: 'center',
                }}>
                <Icon name="md-arrow-back" size={20} />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                width: '60%',
                marginLeft: 17,
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 19}}>
                {title === 'privacy' ? 'Data and Privacy' : 'Terms of Use'}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
      <WebView
        source={{uri: `${url}`}}
        startInLoadingState={true}
        scalesPageToFit
        javaScriptEnabled={true}
        style={{flex: 1, width: deviceWidth}}
        scrollEnabled
      />
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
  header: {
    width: '100%',
    height: '11%',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
});

export default WebViewScreen;
