import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Modal} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const Loader = (props) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.isLoading}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.screen}>
          <View>
            <View style={{height: 100}}>
              <MaterialIndicator color={Colors.pink} />
            </View>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                color: Colors.grey_darken,
                fontSize: 20,
              }}>
              {props.loadingMessage}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .5)',
  },
});

export default Loader;
