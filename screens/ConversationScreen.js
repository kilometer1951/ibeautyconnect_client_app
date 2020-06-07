import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Button,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  InputAccessoryView,
} from 'react-native';
import Modal from 'react-native-modalbox';
import {useSelector, useDispatch} from 'react-redux';
import * as appAction from '../store/actions/appAction';
import io from 'socket.io-client';
import {URL} from '../socketURL';
import {MaterialIndicator} from 'react-native-indicators';
import PartnerAccountModal from '../modal/PartnerAccountModal';
import Orders from '../modal/Orders';
import Icon from 'react-native-vector-icons/Ionicons';
import RefreshNetworkError from '../components/RefreshNetworkError';

import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Svg, {Path} from 'react-native-svg';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ConversationHeader from '../components/Conversations/ConversationHeader';
import TextInputComponent from '../components/TextInputComponent';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Geolocation from '@react-native-community/geolocation';

const ConversationScreen = (props) => {
  const socket = io(URL);
  const user = useSelector((state) => state.authReducer.user);
  const scrollView = useRef();
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [hasCart, setHasCart] = useState(false);
  const [openModalOrder, setOpenModalOrder] = useState(false);
  const [tabToRender, setTabToRender] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);

  const [messageInput, setMessageInput] = useState('');
  const easyText = [
    {
      message: 'Can I know your schedule for today?',
    },
    {
      message: 'I will like to book an appointment',
    },
    {
      message: 'Ok, got you',
    },
    {
      message: 'Can you come to my location',
    },

    {
      message: 'How much is your comfort fee',
    },
  ];

  const messageId = props.navigation.getParam('messageId');
  const partner_name = props.navigation.getParam('partner_name');
  const partnerId = props.navigation.getParam('partnerId');
  const [conversations, setConversations] = useState([]);
  const [partnerProfileData, setPartnerProfileData] = useState({});
  //console.log(messageId);

  useEffect(() => {
    const getCartCount = async () => {
      const response = await appAction.getCartCount(user.user._id);
      if (response.status) {
        setHasCart(response.status);
      }
    };
    getCartCount();
  }, []);

  useEffect(() => {
    scrollView.current.scrollToEnd();
  });

  useEffect(() => {
    const getConversations = async () => {
      setIsloading(true);
      const response = await appAction.getConversations(messageId);
      setPartnerProfileData(response.allConversationsData.partner);
      setConversations(response.conversations);
      setIsloading(false);
    };
    getConversations();
  }, []);

  useEffect(() => {
    socket.on('newMessage', async function (msg) {
      if (msg.msg.to == user.user._id) {
        setConversations((prev) => [...prev, msg.msg]);
      }
    });
  }, []);

  const sendMessage = async () => {
    try {
      ReactNativeHapticFeedback.trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      if (messageInput !== '') {
        const phoneExp = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gim;
        const emailExp = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gim;

        const message = messageInput
          .replace(emailExp, '*********')
          .replace(phoneExp, '##########');

        if (message.indexOf('*') > -1 || message.indexOf('#') > -1) {
          setOpenWarningModal(true);
        }

        const messageData = {
          partnerId: partnerId,
          clientId: user.user._id,
          message: message,
          to: partnerId,
          from: user.user._id,
          from_name: user.user.name,
          type: 'messages',
        };

        appAction.newMessage(messageData);
        setConversations((prev) => [...prev, messageData]);
        socket.emit('newMessage', messageData);
        setMessageInput('');
      }
    } catch (e) {
      console.log('network error');
    }
  };

  const myApiKey = 'AIzaSyDEeUA1zS0cT-YHR8UyawDsYkoJop-enog';

  const sendCurrentLocation = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    Geolocation.getCurrentPosition(
      async (position) => {
        setActivityIndicator(true);
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${myApiKey}`,
        );
        const res = await response.json();
        let address = res.results[0].formatted_address;
        const messageData = {
          partnerId: partnerId,
          clientId: user.user._id,
          message: 'I am located at ' + address,
          to: partnerId,
          from: user.user._id,
          from_name: user.user.name,
          type: 'messages',
        };
        appAction.newMessage(messageData);
        setConversations((prev) => [...prev, messageData]);
        socket.emit('newMessage', messageData);
        setActivityIndicator(false);
      },
      (error) => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const sendEasyMessage = (message) => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    const messageData = {
      partnerId: partnerId,
      clientId: user.user._id,
      message: message,
      to: partnerId,
      from: user.user._id,
      from_name: user.user.name,
      type: 'messages',
    };
    appAction.newMessage(messageData);
    setConversations((prev) => [...prev, messageData]);
    socket.emit('newMessage', messageData);
  };

  const easyTextView = easyText.map((data, index) => {
    return (
      <TouchableWithoutFeedback
        key={index}
        onPress={sendEasyMessage.bind(this, data.message)}>
        <View style={styles.easyMessage}>
          <Text style={styles.textStyle}>{data.message}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  });

  const onClose = () => {
    setOpenWarningModal(false);
  };

  const handleWarningInfo = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    onClose();
  };

  const inputAccessoryViewID = 'uniqueID';

  let view;

  const conversationView = conversations.map((conversation, index) => {
    //console.log(index);
    if (conversation.to == user.user._id) {
      view = (
        <View style={[styles.item, styles.itemIn]}>
          <View style={[styles.balloon, {backgroundColor: '#eeeeee'}]}>
            <Text
              style={{
                paddingTop: 5,
                color: 'white',
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
                color: '#000',
              }}>
              {conversation.message}
            </Text>
            <View style={[styles.arrowContainer, styles.arrowLeftContainer]}>
              <Svg
                style={styles.arrowLeft}
                width={moderateScale(15.5, 0.6)}
                height={moderateScale(17.5, 0.6)}
                viewBox="32.484 17.5 15.515 17.5"
                enable-background="new 32.485 17.5 15.515 17.5">
                <Path
                  d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                  fill="#eeeeee"
                  x="0"
                  y="0"
                />
              </Svg>
            </View>
          </View>
        </View>
      );
    } else {
      view = (
        <View style={[styles.item, styles.itemOut]}>
          <View
            style={[styles.balloon, {backgroundColor: Colors.purple_darken}]}>
            <Text
              style={{
                paddingTop: 5,
                color: 'white',
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
              }}>
              {conversation.message}
            </Text>
            <View style={[styles.arrowContainer, styles.arrowRightContainer]}>
              <Svg
                style={styles.arrowRight}
                width={moderateScale(15.5, 0.6)}
                height={moderateScale(17.5, 0.6)}
                viewBox="32.485 17.5 15.515 17.5"
                enable-background="new 32.485 17.5 15.515 17.5">
                <Path
                  d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                  fill={Colors.purple_darken}
                  x="0"
                  y="0"
                />
              </Svg>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View key={index}>
        <View
          style={{
            width: '100%',
            marginTop: 10,
          }}>
          {view}
        </View>
      </View>
    );
  });
  return (
    <View style={styles.screen}>
      <RefreshNetworkError navigation={props.navigation} />
      <ConversationHeader
        navigation={props.navigation}
        partner_name={partner_name}
        setPartnerProfileData={setPartnerProfileData}
        setOpenModal={setOpenModal}
        isLoading={isLoading}
      />

      <View style={styles.screen}>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={150}>
          <ScrollView ref={scrollView} style={{height: '83%'}}>
            {isLoading ? (
              <MaterialIndicator
                color={Colors.purple_darken}
                style={{marginTop: 90}}
              />
            ) : (
              conversationView
            )}
          </ScrollView>

          {!isLoading && (
            <View style={styles.topContainer}>
              <View style={styles.textInputContainer}>
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  style={{
                    padding: 10,
                    fontSize: 15,
                    height: 40,
                    fontFamily: Fonts.poppins_regular,
                  }}
                  onChangeText={(value) => setMessageInput(value)}
                  value={messageInput}
                  autoFocus
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableWithoutFeedback onPress={sendMessage}>
                  <View style={{padding: 10}}>
                    <Text style={{fontFamily: Fonts.poppins_bold}}>Send</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          )}

          {!isLoading && (
            <View style={styles.bottomContainer}>
              <ScrollView
                horizontal={true}
                keyboardShouldPersistTaps="always"
                showsHorizontalScrollIndicator={false}>
                <View style={{flexDirection: 'row'}}>
                  {activityIndicator ? (
                    <View
                      style={{
                        padding: 10,
                        height: 40,
                        marginRight: 5,
                        borderRadius: 20,
                        borderColor: '#bdbdbd',
                      }}>
                      <MaterialIndicator color={Colors.purple_darken} />
                    </View>
                  ) : (
                    <TouchableWithoutFeedback onPress={sendCurrentLocation}>
                      <View style={styles.easyMessage}>
                        <Text style={styles.textStyle}>Send my location</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                  {easyTextView}
                </View>
              </ScrollView>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
      {openModal && (
        <PartnerAccountModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          partnerProfileData={partnerProfileData}
          setPartnerProfileData={setPartnerProfileData}
          navigation={props.navigation}
          setHasCart={setHasCart}
          setOpenModalOrder={setOpenModalOrder}
          tabToRender={tabToRender}
        />
      )}

      {openModalOrder && (
        <Orders
          setOpenModalOrder={setOpenModalOrder}
          openModalOrder={openModalOrder}
          clientId={user.user._id}
          setHasCart={setHasCart}
          stripeId={user.user.stripeId}
          setHasAppointment={setHasAppointment}
          setPartnerProfileData_services={setPartnerProfileData}
          setOpenModal={setOpenModal}
          setTabToRender={setTabToRender}
          setPartnerProfileData_services={setPartnerProfileData}
        />
      )}
      <Modal
        style={styles.modal}
        position={'center'}
        isOpen={openWarningModal}
        backdropPressToClose={false}
        onClosed={onClose}>
        <View style={{padding: 20, flex: 1}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 20,
              textAlign: 'center',
            }}>
            Hi there, sharing of contacts is not allowed for security purposes.
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={handleWarningInfo}>
          <View
            style={{
              borderTopWidth: 1,
              padding: 20,
              borderTopColor: Colors.light_grey,
              bottom: 0,
              width: '100%',
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 20,
                alignSelf: 'center',
                color: '#000',
              }}>
              Okay
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    zIndex: -1,
    backgroundColor: '#fff',
  },
  item: {
    marginVertical: moderateScale(7, 2),
    flexDirection: 'row',
  },
  itemIn: {
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 20,
  },
  arrowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  arrowRightContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
  },

  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  textInputContainer: {
    width: '80%',
  },
  bottomContainer: {
    height: 100,
    bottom: 0,
    marginLeft: 5,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  easyMessage: {
    borderWidth: 1,
    padding: 10,
    height: 40,
    marginRight: 5,
    borderRadius: 20,
    borderColor: '#bdbdbd',
  },
  textStyle: {
    fontFamily: Fonts.poppins_regular,
  },
  modal: {
    height: '20%',
    width: '90%',
    borderRadius: 5,
  },
});

export default ConversationScreen;
