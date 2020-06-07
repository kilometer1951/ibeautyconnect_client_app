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
//import Toast from 'react-native-root-toast';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import TextInputComponent from './TextInputComponent';
import {MaterialIndicator} from 'react-native-indicators';

import Modal from 'react-native-modalbox';
import Moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ButtonComponent from './ButtonComponent';
import SupportCategory from './Support/SupportCategory';

import * as appAction from '../store/actions/appAction';
import {URL} from '../socketURL';

import io from 'socket.io-client';
import {YellowBox} from 'react-native';

const SupportModal = props => {
  const socket = io(URL);
  const user = useSelector(state => state.authReducer.user);
  const [messageSent, setMessageSent] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [messageInput, setMessageInput] = useState();
  const [category, setCategory] = useState('');

  const {supportModal, setSupportModal} = props;

  const onClose = () => {
    setCategory('');
    setMessageInput('');
    setOpenCategory(false);
    setSupportModal(false);
  };

  const onClosingState = state => {
    console.log('the open/close of the swipeToClose just changed');
  };

  const newSupportMessage = async () => {
    if (messageInput !== '') {
      const messageData = {
        clientId: user.user._id,
        message: messageInput,
        to: 'supportAdmin@iBeautyConnect.com',
        from_: user.user._id,
        category: category,
      };
      socket.emit('newSupportMessage', messageData);
      appAction.newSupportMessage(messageData);

      Keyboard.dismiss();
      setMessageInput('');
      setMessageSent(true);
      setTimeout(() => {
        setMessageSent(false);
      }, 3000);
      //  setViewToRender('schedule');
    }
  };

  return (
    <Modal
      style={styles.modal3}
      isOpen={supportModal}
      position="bottom"
      onClosed={onClose}>
      <View style={{flex: 1, width: '100%', padding: 20, marginTop: 10}}>
        <View
          style={{
            flexDirection: 'column',
            borderBottomWidth: 1,
            borderColor: '#bdbdbd',
          }}>
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
              style={{alignSelf: 'flex-end'}}
            />
          </TouchableWithoutFeedback>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              marginBottom: 20,
              marginTop: 5,
            }}>
            Hi there, please do not forget to include the date and approximate
            time of your appointment thanks. To respond to this support ticket,
            go to profile >> support.
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontFamily: Fonts.poppins_bold,
              fontSize: 20,
              marginBottom: 5,
              marginTop: 20,
            }}>
            Category
          </Text>
          <TouchableWithoutFeedback onPress={() => setOpenCategory(true)}>
            <View style={styles.dropDownList}>
              <Text
                style={{
                  fontSize: 22,
                  paddingLeft: 13,
                  paddingBottom: 10,
                  color: category === '' ? '#bdbdbd' : '#000',
                  marginTop: 10,
                  fontFamily: Fonts.poppins_regular,
                }}>
                {category !== '' ? category : 'Select a category'}
              </Text>
              <Icon
                name="ios-arrow-down"
                size={30}
                style={{marginRight: 10, marginTop: 10}}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{width: '100%', marginTop: 20}}>
          <Text
            style={{
              display: messageSent ? 'flex' : 'none',
              fontFamily: Fonts.poppins_regular,
            }}>
            Your support message has been sent.
          </Text>
          <TextInputComponent
            placeholder={'We usually respond in minutes '}
            onChangeText={value => setMessageInput(value)}
            value={messageInput}
            moreStyles={{width: '100%', height: 130, marginBottom: 10}}
            label="Enter message"
            multiline={true}
            numberOfLines={4}
          />
          <ButtonComponent
            moreStyles={{
              width: '100%',
              opacity: messageInput === '' || category === '' ? 0.1 : 1,
            }}
            title="Send"
            onButtonPress={newSupportMessage}
            disabled={messageInput == '' || category === '' ? true : false}
          />
        </View>
      </View>

      <SupportCategory
        category={category}
        setCategory={setCategory}
        setOpenCategory={setOpenCategory}
        openCategory={openCategory}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal3: {
    height: 600,
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

export default SupportModal;
