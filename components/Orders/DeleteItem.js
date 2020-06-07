import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ActivityIndicator, Linking} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modalbox';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';

import * as appAction from '../../store/actions/appAction';

const DeleteItem = props => {
  const {setOpenDeleteModal, handleDeleteCart, openDeleteModal} = props;

  const onClose = () => {
    setOpenDeleteModal(false);
  };

  const onClosingState = state => {
    console.log('the open/close of the swipeToClose just changed');
  };

  return (
    <Modal
      style={[styles.modal, styles.modal3]}
      position={'bottom'}
      isOpen={openDeleteModal}
      onClosed={onClose}>
      <View style={{width: '100%'}}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 18,
            fontFamily: Fonts.poppins_regular,
          }}>
          Are you sure?
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            marginTop: 30,
            width: '100%',
          }}>
          <ButtonComponent
            moreStyles={{
              width: '40%',
              backgroundColor: Colors.purple_darken,
            }}
            buttonTextStyle={{fontSize: 18, color: '#fff'}}
            title="Delete"
            onButtonPress={handleDeleteCart}
          />
          <ButtonComponent
            moreStyles={{
              width: '40%',
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#9e9e9e',
            }}
            buttonTextStyle={{fontSize: 18, color: '#000'}}
            title="Close"
            onButtonPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal3: {
    height: 200,
    width: '100%',
  },
});

export default DeleteItem;
