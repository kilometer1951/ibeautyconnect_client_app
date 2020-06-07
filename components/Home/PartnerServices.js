import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Modal from 'react-native-modalbox';
//import Toast from 'react-native-root-toast';

import * as appAction from '../../store/actions/appAction';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import {MaterialIndicator} from 'react-native-indicators';
import ButtonComponent from '../ButtonComponent';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

import {URL} from '../../socketURL';

import io from 'socket.io-client';
import {YellowBox} from 'react-native';

const PartnerServices = props => {
  const socket = io(URL);

  const user = useSelector(state => state.authReducer.user);
  const [disableButtonLoad, setDisableButtonLoad] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [bookData, setBookData] = useState({});
  const [activity, setActivity] = useState(false);
  const {
    services,
    partnerId,
    setOpenModal,
    setHasCart,
    setOpenModalOrder,
  } = props;
  String.prototype.trunc =
    String.prototype.trunc ||
    function(n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this;
    };

  const viewService = async services => {
    try {
      const clientId = user.user._id;
      setOpenBookingModal(true);
      setBookData(services);
      const response = await appAction.checkCart(
        clientId,
        partnerId,
        services._id,
      );
      if (response.item_exist) {
        setDisableButtonLoad(true);
      } else {
        setDisableButtonLoad(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddToCart = async services => {
    //  console.log(services);
    setActivity(true);
    const response = await appAction.addToCart(
      services,
      partnerId,
      user.user._id,
    );
    socket.emit('addedToCart', user.user._id);
    setActivity(false);
    // if (!response.status) {
    //   Toast.show(
    //     'You have a booking apointment in your cart you have not checked out. Either clear the booking or checkout to continue with this profesional',
    //     {
    //       duration: Toast.durations.LONG,
    //       position: 50,
    //       shadow: true,
    //       animation: true,
    //       hideOnPress: true,
    //       delay: 0,
    //       backgroundColor: Colors.tan,
    //       shadow: false,
    //       textColor: Colors.midnight_blue,
    //       opacity: 1,
    //     },
    //   );
    //   return;
    // } else {
    //
    // }
    setHasCart(true);
    setDisableButtonLoad(true);
    //console.log(response);
  };

  const onClose = () => {
    setOpenBookingModal(false);
    setBookData(false);
    console.log('Modal just closed');
  };

  const onOpen = async () => {
    console.log('open modal');
  };

  const onClosingState = state => {
    console.log('the open/close of the swipeToClose just changed');
  };

  return (
    <View style={styles.screen}>
      <Text
        style={{
          fontFamily: Fonts.poppins_regular,
          paddingVertical: 10,
          paddingHorizontal: 10,
          color: Colors.pink,
        }}>
        In order to secure your appointment time, please send the professional a
        message.
      </Text>
      <FlatList
        data={services}
        renderItem={({item, index}) => (
          <View style={styles.listView}>
            <TouchableWithoutFeedback>
              <View style={styles.serviceContainer}>
                <View style={styles.rightContainer}>
                  <Text style={{fontFamily: Fonts.poppins_regular}}>
                    {item.serviceName}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      color: '#9e9e9e',
                      fontFamily: Fonts.poppins_regular,
                    }}>
                    {item.serviceDescription.trunc(30)}
                  </Text>
                </View>
                <View style={styles.leftContainer}>
                  <ButtonComponent
                    moreStyles={{
                      width: '100%',
                      height: 50,
                      padding: 15,
                      alignItems: 'flex-start',
                    }}
                    buttonTextStyle={{fontSize: 16}}
                    title={'$' + item.servicePricePerHour + ' - Book'}
                    onButtonPress={viewService.bind(this, item)}
                  />
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: Fonts.poppins_bold,
                    }}>
                    {item.serviceHour}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
        keyExtractor={item => item._id}
      />
      <Modal
        style={styles.modalStyle}
        isOpen={openBookingModal}
        swipeToClose={true}
        onClosed={onClose}
        onOpened={onOpen}
        onClosingState={onClosingState}>
        <ScrollView>
          <TouchableWithoutFeedback>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setOpenBookingModal(false);
                }}>
                <View
                  style={{
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    width: 50,
                  }}>
                  <Icon
                    name="ios-close"
                    size={40}
                    style={{alignSelf: 'center'}}
                  />
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
                  {bookData.serviceName}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
                    ${bookData.servicePricePerHour} ||
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 18,
                      marginLeft: 3,
                    }}>
                    {bookData.serviceHour}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    marginLeft: 3,
                  }}>
                  {bookData.serviceDescription}
                </Text>
              </View>
              {!disableButtonLoad ? (
                activity ? (
                  <MaterialIndicator
                    color={Colors.purple_darken}
                    style={{marginTop: 30}}
                  />
                ) : (
                  <ButtonComponent
                    moreStyles={{
                      width: '100%',
                      marginTop: 20,
                    }}
                    buttonTextStyle={{fontSize: 20}}
                    title={'$' + bookData.servicePricePerHour + ' - Add'}
                    onButtonPress={handleAddToCart.bind(this, bookData)}
                  />
                )
              ) : (
                <ButtonComponent
                  moreStyles={{
                    width: '100%',
                    marginTop: 20,
                    backgroundColor: Colors.blue,
                  }}
                  buttonTextStyle={{fontSize: 20}}
                  title="Go to my orders"
                  onButtonPress={() => {
                    setOpenModal(false);
                    setOpenModalOrder(true);
                  }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listView: {
    flexDirection: 'column',
    padding: 5,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
  },
  serviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    width: '100%',
  },
  rightContainer: {
    width: '60%',
    justifyContent: 'flex-start',
  },
  leftContainer: {width: '40%', alignItems: 'flex-end'},
});

export default PartnerServices;
