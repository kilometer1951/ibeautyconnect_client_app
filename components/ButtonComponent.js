import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const ButtonComponent = props => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        ReactNativeHapticFeedback.trigger('impactLight', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
        props.onButtonPress();
      }}
      {...props}>
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            borderRadius: 50,
            backgroundColor: Colors.purple_darken,
          },
          {...props.moreStyles},
        ]}>
        {props.icon}
        <Text
          style={[
            {
              fontSize: 20,
              color: '#fff',
              fontFamily: Fonts.poppins_regular,
            },
            {...props.buttonTextStyle},
          ]}>
          {props.title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default ButtonComponent;
