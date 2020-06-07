import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import TextInputComponent from '../../components/TextInputComponent';
import {MaterialIndicator} from 'react-native-indicators';

import Modal from 'react-native-modalbox';
import Moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';

import * as appAction from '../../store/actions/appAction';
import {URL} from '../../socketURL';

import io from 'socket.io-client';
import {YellowBox} from 'react-native';

const ReSchedule = (props) => {
  const socket = io(URL);
  const user = useSelector((state) => state.authReducer.user);
  const {
    setOpenReScheduleModal,
    openReScheduleModal,
    reScheduleData,
    setReScheduleData,
    getAppointmentOnOpen,
  } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [textColorDate, setTextColorDate] = useState('#bdbdbd');
  const [bookingDate, setBookingDate] = useState('Select a date');
  const [textColorTime, setTextColorTime] = useState('#bdbdbd');
  const [bookingTime, setBookingTime] = useState('Select a time');
  const [viewToRender, setViewToRender] = useState('schedule');
  const partner_name = reScheduleData.partner_name;
  const [messageInput, setMessageInput] = useState();
  const [messageSent, setMessageSent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingViewToRender, setLoadingViewToRender] = useState('');
  let responseView;

  const onClose = () => {
    setBookingDate('Select a date');
    setBookingTime('Select a time');
    setLoadingViewToRender('');
    setViewToRender('schedule');
    setOpenReScheduleModal(false);
  };

  const onClosingState = (state) => {
    //  console.log('the open/close of the swipeToClose just changed');
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const newDate = Moment(date).format('MM / DD / YYYY');
    setBookingDate(newDate);
    hideDatePicker();
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    //  console.log('A time has been picked: ', time);
    let formatted = Moment(time, 'HH:mm:ss').format('hh:mm A');
    setBookingTime(formatted);
    hideTimePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const handleReSchedule = async () => {
    setIsLoading(true);
    const response = await appAction.reSchedule(
      reScheduleData,
      bookingDate,
      bookingTime,
    );
    setIsLoading(false);
    if (response.status) {
      socket.emit('reSchedule', {reScheduleData, bookingDate, bookingTime});
      getAppointmentOnOpen();
      setLoadingViewToRender('success');
      setIsLoading(false);
    } else {
      setLoadingViewToRender('error');
    }
  };

  const sendMessage = async () => {
    const messageData = {
      partnerId: reScheduleData.partnerId,
      clientId: user.user._id,
      message: messageInput,
      to: reScheduleData.partnerId,
      from: user.user._id,
      from_name: user.user.name,
      type: 'reschedule',
      partnerPhone: reScheduleData.partnerPhone,
    };
    appAction.newMessage(messageData);
    socket.emit('newMessage', messageData);
    Keyboard.dismiss();
    setMessageInput('');

    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
    }, 1000);
    //  setViewToRender('schedule');
  };

  if (loadingViewToRender === 'success') {
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
        <View style={{alignItems: 'center', marginTop: 50}}>
          <Icon
            name="md-checkmark-circle"
            size={55}
            color={Colors.purple_darken}
          />
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
              textAlign: 'center',
            }}>
            Success, your appointment has been rescheduled. Thanks for choosing
            iBeautyConnect.
          </Text>
        </View>
      </View>
    );
  } else if (loadingViewToRender === 'error') {
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
        <View style={{alignItems: 'center', marginTop: 50}}>
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

  let view;

  if (viewToRender === 'schedule') {
    view = (
      <View>
        <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 17}}>
          Inorder for your appointment time to be respected, please contact{' '}
          {reScheduleData.partner_name} before rescheduling thanks.
        </Text>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            setMessageInput(
              'Hi ' +
                reScheduleData.partner_name +
                ' i will like to reschedule my appoitment from ' +
                Moment(reScheduleData.booking_date).format('MMM, D YYYY') +
                ' at ' +
                reScheduleData.booking_time +
                ' to .....',
            );
            setViewToRender('');
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 17,
              color: 'blue',
              marginBottom: 10,
              color: Colors.purple_darken,
            }}>
            New Message
          </Text>
        </TouchableWithoutFeedback>
        <View style={{marginBottom: 20}}>
          <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 20}}>
            Select an appointment date
          </Text>
          <TouchableOpacity
            style={styles.dropDownList}
            onPress={showDatePicker}>
            <Text
              style={{
                fontSize: 18,
                paddingLeft: 13,
                paddingBottom: 10,
                color: bookingDate === 'Select a date' ? textColorDate : '#000',
                marginTop: 10,
                fontFamily: Fonts.poppins_regular,
              }}>
              {bookingDate}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={30}
              style={{marginRight: 10, marginTop: 10}}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 20}}>
            Select an appointment time
          </Text>
          <TouchableOpacity
            style={styles.dropDownList}
            onPress={showTimePicker}>
            <Text
              style={{
                fontSize: 18,
                paddingLeft: 13,
                paddingBottom: 10,
                color: bookingTime === 'Select a time' ? textColorTime : '#000',
                marginTop: 10,
                fontFamily: Fonts.poppins_regular,
              }}>
              {bookingTime}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={30}
              style={{marginRight: 10, marginTop: 10}}
            />
          </TouchableOpacity>
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
              width: '100%',
              backgroundColor: Colors.purple_darken,
              opacity:
                bookingTime == 'Select a time' || bookingDate == 'Select a date'
                  ? 0.4
                  : 1,
            }}
            buttonTextStyle={{fontSize: 18, color: '#fff'}}
            title="Reschedule"
            onButtonPress={handleReSchedule}
            disabled={
              bookingTime == 'Select a time' || bookingDate == 'Select a date'
                ? true
                : false
            }
          />
        </View>
      </View>
    );
  } else {
    view = (
      <View style={{width: '100%', marginTop: 20}}>
        <Text
          style={{
            display: messageSent ? 'flex' : 'none',
            fontFamily: Fonts.poppins_regular,
          }}>
          Your message has been sent
        </Text>
        <TextInputComponent
          placeholder={
            'Hi, can i know your availability? I will like to reschedule'
          }
          onChangeText={(value) => setMessageInput(value)}
          value={messageInput}
          moreStyles={{width: '100%', height: 130, marginBottom: 10}}
          label="Enter message"
          multiline={true}
          numberOfLines={4}
        />
        <ButtonComponent
          moreStyles={{
            width: '100%',

            opacity: messageInput === '' ? 0.1 : 1,
          }}
          title="Send"
          onButtonPress={sendMessage}
          disabled={messageInput == '' ? true : false}
        />
      </View>
    );
  }

  return (
    <Modal
      style={styles.modal3}
      isOpen={openReScheduleModal}
      position="bottom"
      onClosed={onClose}>
      <View style={{flex: 1, width: '100%', padding: 20, marginTop: 10}}>
        {isLoading ? (
          <View style={{marginTop: '19%', alignItems: 'center', height: '30%'}}>
            <MaterialIndicator color={Colors.purple_darken} />
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.poppins_regular,
              }}>
              Please wait
            </Text>
          </View>
        ) : loadingViewToRender === '' ? (
          <View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent:
                  viewToRender === 'schedule' ? 'flex-end' : 'space-between',
                marginBottom: 10,
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  ReactNativeHapticFeedback.trigger('impactLight', {
                    enableVibrateFallback: true,
                    ignoreAndroidSystemSettings: false,
                  });
                  setViewToRender('schedule');
                }}>
                <Icon
                  name="ios-arrow-back"
                  size={25}
                  style={{
                    display: viewToRender !== 'schedule' ? 'flex' : 'none',
                    width: '15%',
                  }}
                />
              </TouchableWithoutFeedback>
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
                    height: 50,
                    alignItems: 'center',
                    paddingTop: 10,
                  }}>
                  <Icon name="ios-close-circle-outline" size={25} />
                </View>
              </TouchableWithoutFeedback>
            </View>
            {view}
          </View>
        ) : (
          responseView
        )}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          locale="en_GB" // Use "en_GB" here
          date={new Date()}
          isDarkModeEnabled={false}
          minimumDate={new Date()}
        />
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
          isDarkModeEnabled={false}
          headerTextIOS="Pick a time"
          minimumDate={new Date()}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal3: {
    height: 500,
    borderRadius: 10,
  },
  dropDownList: {
    borderColor: '#bdbdbd',
    borderRadius: 5,
    width: '100%',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

//
// backdropContent={
//   <View
//     style={{
//       marginTop: 200,
//       backgroundColor: 'red',
//       alignItems: 'center',
//       width: '50%',
//       alignSelf: 'center',
//     }}>
//     <Text>Done</Text>
//   </View>
// }

export default ReSchedule;
