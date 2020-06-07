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

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';
import Loader from '../../components/Loader';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import * as appAction from '../../store/actions/appAction';
import {URL} from '../../socketURL';

import io from 'socket.io-client';
import {YellowBox} from 'react-native';

const CancelAppoitment = (props) => {
  const socket = io(URL);
  const dispatch = useDispatch();

  const {
    openCancelAppoitmentModal,
    setOpenCancelAppoitmentModal,
    cancelAppoitmentData,
    appointments,
    setHasAppointment,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [viewToRender, setViewToRender] = useState('');

  let responseView;

  const onClose = () => {
    setViewToRender('');
    setOpenCancelAppoitmentModal(false);
  };

  const onClosingState = (state) => {
    console.log('the open/close of the swipeToClose just changed');
  };

  const handleCancelAppoitment = async () => {
    try {
      setIsLoading(true);
      await dispatch(appAction.handleCancelAppoitment(cancelAppoitmentData));
      setIsLoading(false);
      socket.emit('cancelAppoitment', cancelAppoitmentData);
      setViewToRender('success');
    } catch (e) {
      setIsLoading(false);
      setViewToRender('error');
    }
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
        <View style={{alignItems: 'center', marginTop: 40}}>
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
        <View style={{alignItems: 'center', marginTop: 40}}>
          <Icon name="md-close-circle" size={55} color={Colors.pink} />
          <Text
            style={{
              fontSize: 20,
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
      isOpen={openCancelAppoitmentModal}
      position="bottom"
      backdropPressToClose={isLoading ? false : true}
      onClosed={onClose}>
      {isLoading ? (
        <View style={{marginTop: '20%', alignItems: 'center'}}>
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
        <View>
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
                alignItems: 'flex-end',
                paddingRight: 10,
              }}>
              <Icon
                name="ios-close-circle-outline"
                size={25}
                style={{marginBottom: 20, paddingTop: 10}}
              />
            </View>
          </TouchableWithoutFeedback>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              textAlign: 'center',
            }}>
            Hi, we do not encorange cancellations on iBeautyConnect. We advice
            you to reschedule for a later date. If you continue to cancellation
            we refund you only 30% of the total you paid.
          </Text>

          <ButtonComponent
            moreStyles={{
              width: '100%',
              height: 70,
              padding: 20,
              marginTop: 20,
              backgroundColor: Colors.purple_darken,
            }}
            buttonTextStyle={{color: '#fff'}}
            title="Continue to cancellation"
            onButtonPress={handleCancelAppoitment}
          />
        </View>
      ) : (
        responseView
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '38%',
    width: '100%',
    padding: 15,
    borderRadius: 5,
  },
});

export default CancelAppoitment;
