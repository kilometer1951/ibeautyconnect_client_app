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
  Modal,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {WebView} from 'react-native-webview';
const deviceWidth = Dimensions.get('window').width;

const ModalWebView = props => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.modalWebView}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <SafeAreaView>
            <View style={styles.headerContainer}>
              <TouchableWithoutFeedback
                onPress={() => {
                  props.setModalWebView(false);
                }}>
                <View
                  style={{
                    marginHorizontal: 20,
                    height: 30,
                    width: 30,
                    paddingTop: 4,
                    alignItems: 'center',
                  }}>
                  <Icon name="md-close" size={20} />
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  width: '60%',
                  marginLeft: 17,
                  alignItems: 'center',
                }}>
                <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 19}}>
                  Terms of Use
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </View>
        <WebView
          source={{uri: 'https://www.ibeautyconnect.com/terms.html'}}
          startInLoadingState={true}
          scalesPageToFit
          javaScriptEnabled={true}
          style={{flex: 1, width: deviceWidth}}
          scrollEnabled
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default ModalWebView;
