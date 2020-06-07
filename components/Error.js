import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import Fonts from '../contants/Fonts';

const Error = props => {
  return (
    <Text style={[styles.textStyle, {...props.moreStyles}]}>{props.error}</Text>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.poppins_regular,
    fontSize: 18,
    marginBottom: 5,
    color: '#8e24aa',
    marginTop: 5,
  },
});

export default Error;
