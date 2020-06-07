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

import {useSelector, useDispatch} from 'react-redux';
import * as appAction from '../store/actions/appAction';
import io from 'socket.io-client';
import {URL} from '../socketURL';
import {MaterialIndicator} from 'react-native-indicators';
import RefreshNetworkError from '../components/RefreshNetworkError';

import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Svg, {Path} from 'react-native-svg';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ConversationHeader from '../components/Conversations/ConversationHeader';
import TextInputComponent from '../components/TextInputComponent';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Icon from 'react-native-vector-icons/Ionicons';

const SupportConversationScreen = (props) => {
  const socket = io(URL);
  const user = useSelector((state) => state.authReducer.user);
  const scrollView = useRef();
  const [isLoading, setIsloading] = useState(false);

  const [messageInput, setMessageInput] = useState('');

  const supportMessageId = props.navigation.getParam('supportMessageId');
  const clientId = props.navigation.getParam('clientId');
  const category = props.navigation.getParam('category');

  const [conversations, setConversations] = useState([]);
  //console.log(messageId);

  useEffect(() => {
    scrollView.current.scrollToEnd();
  });

  useEffect(() => {
    const getSupportConversations = async () => {
      setIsloading(true);
      const response = await appAction.getSupportConversations(
        supportMessageId,
      );
      setConversations(response.supportConvo.message_data);
      setIsloading(false);
    };
    getSupportConversations();
  }, []);

  useEffect(() => {
    socket.on('newSupportMessage', async function (messageData) {
      if (messageData.supportMessageId == supportMessageId) {
        const getSupportConversations = async () => {
          const response = await appAction.getSupportConversations(
            supportMessageId,
          );
          setConversations(response.supportConvo.message_data);
        };
        getSupportConversations();
      }
    });
  }, []);

  const newSupportMessage = async () => {
    if (messageInput !== '') {
      const messageData = {
        clientId: user.user._id,
        message: messageInput,
        to: 'supportAdmin@iBeautyConnect.com',
        from_: user.user._id,
        supportMessageId: supportMessageId,
        category: category,
      };
      setConversations((prev) => [...prev, messageData]);
      socket.emit('newSupportMessage', messageData);
      appAction.newSupportMessage(messageData);
      setMessageInput('');
    }

    //  setViewToRender('schedule');
  };

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
          <View style={[styles.balloon, {backgroundColor: Colors.blue}]}>
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
                  fill={Colors.blue}
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
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('Support');
              }}>
              <View style={{width: '20%', alignItems: 'center', marginTop: 9}}>
                <Icon
                  name="md-arrow-back"
                  size={25}
                  color={Colors.midnight_blue}
                />
              </View>
            </TouchableWithoutFeedback>

            <View
              style={{
                marginTop: 8,
                width: '62%',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                }}>
                You and Support
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.screen}>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={200}>
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
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableWithoutFeedback onPress={newSupportMessage}>
                  <View style={{padding: 10}}>
                    <Text style={{fontFamily: Fonts.poppins_bold}}>Send</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: '11%',
    top: 0,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    height: 90,
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
});

export default SupportConversationScreen;
