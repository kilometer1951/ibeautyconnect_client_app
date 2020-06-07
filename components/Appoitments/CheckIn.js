import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modalbox';
import Moment from 'moment';
import {MaterialIndicator} from 'react-native-indicators';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';

import * as appAction from '../../store/actions/appAction';
import {URL} from '../../socketURL';

import io from 'socket.io-client';
import {YellowBox} from 'react-native';

const CheckIn = (props) => {
  const socket = io(URL);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [viewToRender, setViewToRender] = useState('');

  let responseView;

  const {
    checkInData,
    openCheckInModal,
    setOpenCheckInModal,
    appointments,
    setHasAppointment,
  } = props;

  const onClose = () => {
    setViewToRender('');
    setOpenCheckInModal(false);
  };

  const onClosingState = (state) => {
    console.log('the open/close of the swipeToClose just changed');
  };

  const myApiKey = 'AIzaSyDEeUA1zS0cT-YHR8UyawDsYkoJop-enog';
  const myLocation = async (section) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${myApiKey}`,
        );
        const res = await response.json();
        let address = res.results[0].formatted_address;

        appAction.checkInLocation(address, checkInData.cartId);
      },
      (error) => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const updateCartCheckIn = async () => {
    try {
      setIsLoading(true);
      await dispatch(appAction.updateCartCheckIn(checkInData));
      setIsLoading(false);
      socket.emit('checkIn', checkInData);
      setViewToRender('success');
    } catch (e) {
      setIsLoading(false);
      setViewToRender('error');
    }
  };

  const handleCheckIn = async () => {
    //get location
    await myLocation();
    await updateCartCheckIn();
    //  setOpenCheckInModal(false);
  };

  if (viewToRender === 'success') {
    responseView = (
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            onClose();
          }}>
          <Icon
            name="ios-close-circle-outline"
            size={25}
            style={{alignSelf: 'flex-end', marginBottom: 20}}
          />
        </TouchableWithoutFeedback>
        <View style={{alignItems: 'center'}}>
          <Icon
            name="md-checkmark-circle"
            size={55}
            color={Colors.purple_darken}
          />
          <Text style={{fontSize: 30, fontFamily: Fonts.poppins_regular}}>
            success
          </Text>
        </View>
      </View>
    );
  } else if (viewToRender === 'error') {
    responseView = (
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            onClose();
          }}>
          <Icon
            name="ios-close-circle-outline"
            size={25}
            style={{alignSelf: 'flex-end', marginBottom: 20}}
          />
        </TouchableWithoutFeedback>
        <View style={{alignItems: 'center'}}>
          <Icon name="md-close-circle" size={55} color={Colors.pink} />
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.poppins_regular,
              textAlign: 'center',
            }}>
            Snap, this appointment does not exist!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Modal
      style={styles.modal}
      position={'bottom'}
      isOpen={openCheckInModal}
      backdropPressToClose={isLoading ? false : true}
      onClosed={onClose}>
      {isLoading ? (
        <View style={{marginTop: '19%', alignItems: 'center'}}>
          <MaterialIndicator color={Colors.purple_darken} />
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.poppins_regular,
              marginTop: 20,
            }}>
            Please wait
          </Text>
        </View>
      ) : viewToRender === '' ? (
        <View style={{width: '100%'}}>
          <TouchableWithoutFeedback
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
              onClose();
            }}>
            <View
              style={{
                width: 50,
                alignItems: 'center',
                paddingTop: 10,
                alignSelf: 'flex-end',
              }}>
              <Icon
                name="ios-close-circle-outline"
                size={25}
                style={{marginBottom: 20}}
              />
            </View>
          </TouchableWithoutFeedback>
          <View style={{marginHorizontal: 20}}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.poppins_regular,
              }}>
              Your appointment date is{' '}
              {Moment(checkInData.booking_date).format('MMM Do, YYYY') +
                ' at ' +
                checkInData.booking_time}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              marginTop: 10,
              width: '100%',
            }}>
            <ButtonComponent
              moreStyles={{
                width: '90%',
                marginTop: 10,
                backgroundColor: Colors.purple_darken,
              }}
              buttonTextStyle={{fontSize: 18, color: '#fff'}}
              title="Check-In"
              onButtonPress={handleCheckIn}
            />
          </View>
        </View>
      ) : (
        responseView
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '30%',
    width: '100%',
    padding: 15,
    borderRadius: 5,
  },
});

export default CheckIn;
