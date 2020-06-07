import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import Fonts from '../contants/Fonts';

const TextComponent = props => {
  return (
    <Text style={[styles.textStyle, {...props.styles}]}>{props.text}</Text>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.poppins_regular,
    fontSize: 18,
    marginBottom: 5,
  },
});

export default TextComponent;
