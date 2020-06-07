import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';

const WalkThrough = (props) => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          position: 'absolute',
          zIndex: -1,
          marginLeft: 165,
        }}>
        <Image
          source={require('../../assets/icon.jpg')}
          style={{width: 700, height: 500}}
        />
      </View>
      <SafeAreaView>
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: '50%',
          }}>
          <View
            style={{
              paddingHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 35,
                color: Colors.pink,
              }}>
              iBeautyConnect
            </Text>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 17,
              }}>
              instant Beauty Connect
            </Text>
          </View>
          <View style={{marginHorizontal: 10}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 18,
                marginTop: 15,
                textAlign: 'center',
                color: '#757575',
              }}>
              Get connected with licensed Estheticians, Cosmetologists, Barbers,
              Tattoo Artists, Fitness Trainers, Massage Therapists and
              Chiropractors in your area.
            </Text>
          </View>
        </View>
        <View style={{width: '100%', alignItems: 'center', marginTop: 30}}>
          <TouchableWithoutFeedback
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
              props.setShowAuthComponent(true);
            }}>
            <View style={styles.button}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                Get started
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
              Linking.openURL('http://appstore.com/ibeautyconnect');
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_light,
                  fontSize: 17,
                  marginTop: 10,
                }}>
                Sell your services. It's free
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                color={Colors.light_grey}
                size={30}
                style={{marginTop: 7, marginLeft: 5}}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 20,
    backgroundColor: Colors.pink,
    width: '60%',
    alignItems: 'center',
    borderRadius: 40,
  },
});

export default WalkThrough;
