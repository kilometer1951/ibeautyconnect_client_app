import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  Linking,
  FlatList,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import AppFooter from '../components/AppFooter';
import * as appAction from '../store/actions/appAction';
import Moment from 'moment';
import {MaterialIndicator} from 'react-native-indicators';
import RefreshNetworkError from '../components/RefreshNetworkError';

import PartnerAccountModal from '../modal/PartnerAccountModal';
import Icon from 'react-native-vector-icons/Ionicons';
import ButtonComponent from '../components/ButtonComponent';

import Orders from '../modal/Orders';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Appointment from '../modal/Appointment';
import io from 'socket.io-client';
import {URL} from '../socketURL';

const MessageScreen = (props) => {
  const socket = io(URL);
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.appReducer.messages);

  const user = useSelector((state) => state.authReducer.user);
  const [openModalOrder, setOpenModalOrder] = useState(false);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [activeTab, setActiveTab] = useState('message');
  const [hasCart, setHasCart] = useState(false);
  const [partnerProfileData, setPartnerProfileData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [tabToRender, setTabToRender] = useState('');
  const [today, setToday] = useState(new Date());
  const clientId = user.user._id;

  const [isLoading, setIsloading] = useState(false);

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this;
    };

  useEffect(() => {
    const getCartCount = async () => {
      const response = await appAction.getCartCount(clientId);
      if (response.status) {
        setHasCart(response.status);
      }
    };
    getCartCount();
  }, []);

  useEffect(() => {
    const getAppointmentCount = async () => {
      const response = await appAction.getAppointmentCount(clientId);
      if (response.status) {
        setHasAppointment(response.status);
      }
    };
    getAppointmentCount();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      setIsloading(true);
      await dispatch(appAction.getMessages(clientId));
      //  console.log(response.messages);
      //    setMessages(response.messages);
      setIsloading(false);
    };
    getMessages();
  }, []);

  const getMessagesSocket = async () => {
    await dispatch(appAction.getMessages(clientId));
    //  setMessages(response.messages);
  };

  useEffect(() => {
    socket.on('newMessage', function (msg) {
      if (msg.msg.to == user.user._id || msg.msg.from == user.user._id) {
        getMessagesSocket();
      }
    });
  }, []);

  useEffect(() => {
    socket.on('checkIn', function (checkInData) {
      if (checkInData.clientId == user.user._id) {
        getMessagesSocket();
      }
    });
  }, []);

  useEffect(() => {
    socket.on('cancelAppoitment', function (cancelAppoitmentData) {
      if (cancelAppoitmentData.clientId == user.user._id) {
        getMessagesSocket();
      }
    });
  }, []);

  useEffect(() => {
    socket.on('noShow', function (noShowAppoitmentData) {
      if (noShowAppoitmentData.clientId == user.user._id) {
        getMessagesSocket();
      }
    });
  }, []);

  const openConversation = (messageId, partner_name, partnerId) => {
    props.navigation.navigate('Conversations', {
      messageId,
      partner_name,
      partnerId,
    });
  };

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback
      key={item._id}
      onPress={openConversation.bind(
        this,
        item._id,
        item.partner.fName + ' ' + item.partner.lName,
        item.partner._id,
      )}>
      <View style={{marginTop: 10}}>
        <View>
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: item.partner.profilePhoto}}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={{marginTop: 5, width: '75%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}>
                  {item.partner.fName} {item.partner.lName}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    color: '#757575',
                  }}>
                  {Moment(item.dateModified).format('MM/DD/YYYY') ==
                  Moment(today).format('MM/DD/YYYY')
                    ? 'Today'
                    : Moment(item.dateModified).format('MMM, DD YYYY')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '80%'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      color: '#757575',
                    }}>
                    {item.recentMesage.trunc(70)}
                  </Text>
                </View>

                {!item.clientHasViewMessage && (
                  <View style={styles.notification} />
                )}
              </View>
            </View>
          </View>
          <View style={styles.line} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  let view;

  if (messages.length === 0) {
    view = (
      <View style={{flex: 1}}>
        <View
          style={{
            marginTop: '40%',
            alignItems: 'center',
            flex: 1,
            marginHorizontal: 15,
          }}>
          <Icon name="ios-chatbubbles" size={30} color="#9e9e9e" />
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              color: '#9e9e9e',
              textAlign: 'center',
            }}>
            You have no chats yet. Messages between you and iBeautyConnect
            partners are displayed here.
          </Text>
          <ButtonComponent
            moreStyles={{
              width: '90%',
              marginTop: 30,
              backgroundColor: Colors.purple_darken,
            }}
            buttonTextStyle={{
              color: '#fff',
              fontSize: 15,
              textAlign: 'center',
            }}
            title="Explore Health and Beauty Professionals"
            onButtonPress={() => {
              props.navigation.navigate('Home');
            }}
          />
        </View>
      </View>
    );
  } else {
    view = (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        extraData={messages}
        initialNumToRender={10}
        style={{marginTop: 2}}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <RefreshNetworkError navigation={props.navigation} />
      <SafeAreaView>
        <View style={styles.messageHeader}>
          <Text
            style={{
              fontFamily: Fonts.poppins_bold,
              fontSize: 30,
            }}>
            Chats
          </Text>
        </View>
      </SafeAreaView>
      {isLoading ? (
        <MaterialIndicator
          color={Colors.purple_darken}
          style={{marginTop: 30}}
        />
      ) : (
        view
      )}

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
        />
      )}

      {openAppointmentModal && (
        <Appointment
          setOpenAppointmentModal={setOpenAppointmentModal}
          openAppointmentModal={openAppointmentModal}
          setHasAppointment={setHasAppointment}
        />
      )}

      <AppFooter
        navigation={props.navigation}
        activeTab={activeTab}
        hasCart={hasCart}
        setOpenModalOrder={setOpenModalOrder}
        setOpenAppointmentModal={setOpenAppointmentModal}
        hasAppointment={hasAppointment}
        setHasAppointment={setHasAppointment}
        setHasCart={setHasCart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  notification: {
    backgroundColor: Colors.purple_darken,
    borderRadius: 55,
    width: 10,
    borderWidth: 1,
    borderColor: '#fff',
    height: 10,
  },

  line: {
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    marginLeft: '25%',
    backgroundColor: '#e0e0e0',
  },
  messageHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export default MessageScreen;
