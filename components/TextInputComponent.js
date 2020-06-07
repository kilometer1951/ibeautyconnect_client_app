import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import Fonts from '../contants/Fonts';

const TextInputComponent = props => {
  const {placeholder} = props;
  return (
    <View style={{width: '100%'}}>
      <Text
        style={{fontFamily: Fonts.poppins_bold, fontSize: 20, marginBottom: 5}}>
        {props.label}
      </Text>
      <TextInput
        placeholder={placeholder}
        style={[styles.textInput, {...props.moreStyles}]}
        onChangeText={props.onChangeText}
        value={props.value}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#bdbdbd',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    fontSize: 20,
    fontFamily: Fonts.poppins_regular,
  },
});

export default TextInputComponent;
