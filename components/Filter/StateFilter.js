import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Picker} from '@react-native-community/picker';

import Modal from 'react-native-modalbox';
import {MaterialIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';
import Loader from '../../components/Loader';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import * as appAction from '../../store/actions/appAction';

const StateFilter = (props) => {
  const dispatch = useDispatch();

  const states = useSelector((state) => state.appReducer.states);

  const {
    searchByState,
    setSearchByState,
    openStateModal,
    setOpenStateModal,
    showLoader,
  } = props;

  let responseView;

  const onClose = () => {
    setOpenStateModal(false);
  };

  const onClosingState = (state) => {
    console.log('the open/close of the swipeToClose just changed');
  };

  const handleSelectedState = async () => {
    setSearchByState(searchByState === '' ? states[0].state : searchByState);
    setOpenStateModal(false);
    await dispatch(
      appAction.getCities(
        searchByState === '' ? states[0].state : searchByState,
      ),
    );
  };

  const state = states.map((state, index) => {
    return <Picker.Item label={state.state} value={state.state} key={index} />;
  });

  return (
    <Modal
      style={styles.modal}
      isOpen={openStateModal}
      position="bottom"
      swipeToClose={false}
      backdropPressToClose={false}
      onClosed={onClose}>
      <View style={styles.topHeader}>
        <TouchableWithoutFeedback onPress={handleSelectedState}>
          <View style={{display: showLoader ? 'none' : 'flex'}}>
            <Text style={{fontFamily: Fonts.poppins_regular}}>Done</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.bottomHeader}>
        {showLoader ? (
          <View
            style={{
              paddingRight: 20,
            }}>
            <MaterialIndicator color={Colors.pink} size={40} />
          </View>
        ) : (
          <Picker
            selectedValue={searchByState}
            style={{
              height: '100%',
              width: '100%',
            }}
            onValueChange={(itemValue, itemIndex) => {
              setSearchByState(itemValue);
            }}>
            <Picker.Item label="Select a state" value={''} key="emplty" />
            {state}
          </Picker>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '30%',
    width: '100%',
    borderRadius: 5,
  },
  topHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  bottomHeader: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
});

export default StateFilter;
