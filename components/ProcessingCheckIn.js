import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ButtonComponent from './ButtonComponent';

const ProcessingCheckIn = props => {
  let view;
  if (props.processingCheckInResponse === 'success') {
    view = (
      <View>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            color: '#000',
            fontSize: 20,
          }}>
          {props.processingCheckInResponse}
        </Text>
        <Button
          title="click"
          onPress={() => {
            props.setProcessingCheckInResponse('');
            props.setProcessingCheckIn(false);
          }}
        />
      </View>
    );
  } else {
    view = (
      <View>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            color: '#000',
            fontSize: 20,
          }}>
          {props.processingCheckInResponse}
        </Text>
        <Button
          title="click"
          onPress={() => {
            props.setProcessingCheckInResponse('');
            props.setProcessingCheckIn(false);
          }}
        />
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <View style={{}}>{view}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});

export default ProcessingCheckIn;
