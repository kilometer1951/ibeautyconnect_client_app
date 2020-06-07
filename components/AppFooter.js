import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {NavigationActions} from 'react-navigation';
import io from 'socket.io-client';
import {URL} from '../socketURL';
import * as appAction from '../store/actions/appAction';

import {useSelector, useDispatch} from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const AppFooter = (props) => {
  const user = useSelector((state) => state.authReducer.user);
  const dispatch = useDispatch();

  const {
    activeTab,
    hasCart,
    setOpenModalOrder,
    setOpenAppointmentModal,
    hasAppointment,
    setHasAppointment,
    setHasCart,
  } = props;
  const socket = io(URL);

  // useEffect(() => {
  //   const getCartCount = async () => {
  //     const response = await appAction.getCartCount(user.user._id);
  //     if (response.status) {
  //       setHasCart(response.status);
  //     }
  //   };
  //   getCartCount();
  // });
  //
  // useEffect(() => {
  //   const getAppointmentCount = async () => {
  //     const response = await appAction.getAppointmentCount(user.user._id);
  //     if (response.status) {
  //       setHasAppointment(response.status);
  //     }
  //   };
  //   getAppointmentCount();
  // });

  useEffect(() => {
    socket.on('addedToCart', async function (clientId) {
      if (clientId == user.user._id) {
        console.log('here');
        setHasCart(true);
      }
    });
  }, []);

  useEffect(() => {
    socket.on('newOrder', async function (order) {
      if (order.from == user.user._id) {
        setHasAppointment(true);
      }
    });
  }, []);

  useEffect(() => {
    socket.on('noDataInCart', async function (clientId) {
      if (clientId == user.user._id) {
        setHasCart(false);
      }
    });
  }, []);

  return (
    <View style={styles.footer}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 15,
          justifyContent: 'space-around',
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            //setActiveTab('home');

            //  console.log(online);
            props.navigation.navigate('Home');
            //socket.emit('newMessage', {message: 'new message'});
          }}>
          <View style={styles.tabWidth}>
            <Icon
              name="ios-home"
              size={30}
              color={activeTab === 'home' ? Colors.purple_darken : '#bdbdbd'}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            setOpenAppointmentModal(true);
          }}>
          <View style={styles.tabWidth}>
            {hasAppointment && <View style={styles.notification} />}
            <Icon name="ios-calendar" size={30} color="#bdbdbd" />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            setOpenModalOrder(true);
          }}>
          <View style={styles.tabWidth}>
            {hasCart && <View style={styles.notification} />}
            <Icon name="ios-cart" size={30} color="#bdbdbd" />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            dispatch(appAction.getMessages(user.user._id));
            props.navigation.navigate('Message');
          }}>
          <View
            style={{
              width: '20%',
              alignItems: 'center',
            }}>
            <Icon
              name="ios-chatbubbles"
              size={30}
              color={activeTab === 'message' ? Colors.purple_darken : '#bdbdbd'}
            />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate('Profile');
          }}>
          <View style={styles.tabWidth}>
            <Icon
              name="ios-options"
              size={30}
              color={activeTab === 'profile' ? Colors.purple_darken : '#bdbdbd'}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    height: 90,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'white',
    bottom: 0,
    elevation: 5,
  },
  tabWidth: {
    width: '20%',
    alignItems: 'center',
  },
  footerText: {
    color: Colors.light_grey,
    fontFamily: Fonts.poppins_regular,
    fontSize: 10,
  },
  notification: {
    backgroundColor: '#bdbdbd',
    borderRadius: 55,
    width: 10,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    height: 10,
    right: 5,
    marginRight: 20,
    zIndex: 1,
  },
  modalStyle: {
    flex: 1,
  },
});

export default AppFooter;
