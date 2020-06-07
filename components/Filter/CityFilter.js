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

const CityFilter = (props) => {
  const cities = useSelector((state) => state.appReducer.cities);

  const {
    searchByCity,
    setSearchByCity,
    openCityModal,
    setOpenCityModal,
  } = props;

  let responseView;

  const onClose = () => {
    setOpenCityModal(false);
  };

  const onClosingState = (state) => {
    console.log('the open/close of the swipeToClose just changed');
  };

  const city = cities.map((city, index) => {
    return <Picker.Item label={city.city} value={city.city} key={index} />;
  });

  return (
    <Modal
      style={styles.modal}
      isOpen={openCityModal}
      position="bottom"
      swipeToClose={false}
      backdropPressToClose={false}
      onClosed={onClose}>
      <View style={styles.topHeader}>
        <TouchableWithoutFeedback
          onPress={() => {
            setSearchByCity(
              searchByCity === '' ? cities[0].city : searchByCity,
            );
            setOpenCityModal(false);
          }}>
          <View>
            <Text>Done</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.bottomHeader}>
        <Picker
          selectedValue={searchByCity}
          style={{height: '100%', width: '100%'}}
          onValueChange={(itemValue, itemIndex) => {
            setSearchByCity(itemValue);
          }}>
          {city}
        </Picker>
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

export default CityFilter;
