import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modalbox';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import * as appAction from '../store/actions/appAction';

import TextInputComponent from './TextInputComponent';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ButtonComponent from './ButtonComponent';
import Icon from 'react-native-vector-icons/Ionicons';

import {URL} from '../socketURL';
import io from 'socket.io-client';
import {YellowBox} from 'react-native';

const height = Dimensions.get('window').height;

const MessageModal = props => {
  const user = useSelector(state => state.authReducer.user);
  const socket = io(URL);

  const {openMessageModal, setOpenMessageModal, partnerProfileData} = props;
  const [messageInput, setMessageInput] = useState(
    'Hi, can i know your availability? I will like to book an appointment for .....',
  );
  const [messageSent, setMessageSent] = useState(false);
  const sendMessage = async () => {
    try {
      if (messageInput !== '') {
        const phoneExp = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gim;
        const emailExp = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gim;

        const message = messageInput
          .replace(emailExp, '*********')
          .replace(phoneExp, '##########');
        const messageData = {
          partnerId: partnerProfileData._id,
          clientId: user.user._id,
          message: message,
          to: partnerProfileData._id,
          from: user.user._id,
          from_name: user.user.name,
          type: 'from_orders',
        };
        appAction.newMessage(messageData);
        socket.emit('newMessage', messageData);
        setMessageInput('');
        setMessageSent(true);
        setTimeout(() => {
          setMessageSent(false);
        }, 1000);
      }
    } catch (e) {
      console.log('Network error');
    }
  };

  const onCloseMessageModal = () => {
    Keyboard.dismiss();
    setOpenMessageModal(false);
  };
  return (
    <Modal
      style={styles.modal}
      position={'bottom'}
      isOpen={openMessageModal}
      onClosed={onCloseMessageModal}>
      <View style={{width: '100%'}}>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            onCloseMessageModal();
          }}>
          <View>
            <Icon
              name="ios-close-circle-outline"
              size={30}
              style={{alignSelf: 'flex-end'}}
            />
          </View>
        </TouchableWithoutFeedback>
        <TextInputComponent
          placeholder={'Hi, can i know your availability ? '}
          onChangeText={value => setMessageInput(value)}
          value={messageInput}
          moreStyles={{width: '100%', height: 90, marginBottom: 10}}
          label="Enter message"
          multiline={true}
          numberOfLines={4}
        />
        <Text style={{display: messageSent ? 'flex' : 'none'}}>
          Your message to {partnerProfileData.fName} has been sent
        </Text>

        <View style={{alignItems: 'flex-end'}}>
          <ButtonComponent
            moreStyles={{
              width: '30%',
              height: 50,
              padding: 15,
              borderRadius: 50,
              marginTop: 10,
            }}
            buttonTextStyle={{fontSize: 16}}
            title="Send"
            onButtonPress={sendMessage}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    borderRadius: 10,
    padding: 20,
    height: '40%',
  },
});

export default MessageModal;
