import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {TabHeading, Tab, Tabs} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {MaterialIndicator} from 'react-native-indicators';
import MessageModal from '../components/MessageModal';
import RatingControl from '../components/RatingControl';

import * as appAction from '../store/actions/appAction';
import Cart from '../components/Orders/Cart';
import OrderAgain from '../components/Orders/OrderAgain';
import PaymentModalMessage from '../components/PaymentModalMessage';
import CardAddedMessage from '../components/CardAddedMessage';
//import _ from 'lodash';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ModalHeader from '../components/ModalHeader';
//import Modal from 'react-native-modalbox';

import {URL} from '../socketURL';

import io from 'socket.io-client';

const Orders = props => {
  const socket = io(URL);

  const {
    openModalOrder,
    setOpenModalOrder,
    clientId,
    setHasCart,
    stripeId,
    setHasAppointment,
    setPartnerProfileData_services,
    setOpenModal,
    setTabToRender,
  } = props;
  const [activity, setActivity] = useState(false);
  const [activityOrderAgain, setActivityOrderAgain] = useState(false);
  const [allCart, setAllCart] = useState([]);
  const [orderAgainData, setOrderAgainData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [openPaymentModalMessage, setOpenPaymentModalMessage] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState('');
  const [openMessageModal, setOpenMessageModal] = useState(false);

  const [partnerProfileData, setPartnerProfileData] = useState({});

  const [openRatingControl, setOpenRatingControl] = useState(false);
  const [ratingControlData, setRatingControlData] = useState({});

  const [openCardErrorMessage, setOpenCardErrorMessage] = useState(false);

  const onClose = () => {
    setOpenModalOrder(false);
    if (allCart.length === 0) {
      setHasCart(false);
    }
  };

  const getCartOnOpen = async () => {
    const cart = await appAction.getCart(clientId);

    if (cart.cart !== null) {
      setItemsData(cart.cart.items);
    } else {
      setItemsData([]);
    }
    setAllCart(cart.cart);
  };

  const getOrderAgain = async () => {
    setActivityOrderAgain(true);
    const response = await appAction.getOrderAgain(clientId, 1);
    //  console.log(cart.cart);
    setOrderAgainData(response.cart);
    setActivityOrderAgain(false);
  };

  useEffect(() => {
    const getCart = async () => {
      setActivity(true);
      const cart = await appAction.getCart(clientId);

      if (cart.cart !== null) {
        setItemsData(cart.cart.items);
      } else {
        setItemsData([]);
      }
      setAllCart(cart.cart);
      setActivity(false);
    };
    getCart();
  }, []);

  useEffect(() => {
    getOrderAgain();
  }, []);

  const onClosingState = state => {
    console.log('the open/close of the swipeToClose just changed');
  };
  return (
    <Modal animationType="slide" transparent={false} visible={openModalOrder}>
      <ModalHeader
        headerTitle="Orders"
        modal_to_close="orders"
        setOpenModalOrder={setOpenModalOrder}
        onClose={onClose}
      />
      <Tabs tabBarUnderlineStyle={{backgroundColor: '#fff'}}>
        <Tab
          heading={
            <TabHeading style={{backgroundColor: Colors.blue}}>
              <Text
                style={{
                  marginLeft: 5,
                  color: '#fff',
                  fontFamily: Fonts.poppins_regular,
                }}>
                Orders
              </Text>
            </TabHeading>
          }>
          <View style={{flex: 1}}>
            {activity ? (
              <MaterialIndicator
                color={Colors.purple_darken}
                style={{marginTop: 30}}
              />
            ) : (
              <Cart
                allCart={allCart}
                clientId={clientId}
                itemsData={itemsData}
                setItemsData={setItemsData}
                setAllCart={setAllCart}
                setHasCart={setHasCart}
                stripeId={stripeId}
                setOpenModalOrder={setOpenModalOrder}
                openPaymentModalMessage={openPaymentModalMessage}
                setOpenPaymentModalMessage={setOpenPaymentModalMessage}
                paymentResponse={paymentResponse}
                setPaymentResponse={setPaymentResponse}
                setOpenMessageModal={setOpenMessageModal}
                setPartnerProfileData={setPartnerProfileData}
                setOpenCardErrorMessage={setOpenCardErrorMessage}
              />
            )}
          </View>
        </Tab>
        <Tab
          heading={
            <TabHeading style={{backgroundColor: Colors.blue}}>
              <Text
                style={{
                  marginLeft: 5,
                  color: '#fff',
                  fontFamily: Fonts.poppins_regular,
                }}>
                Order again
              </Text>
            </TabHeading>
          }>
          <View style={{flex: 1}}>
            {activityOrderAgain ? (
              <MaterialIndicator color={Colors.purple_darken} />
            ) : (
              <OrderAgain
                orderAgainData={orderAgainData}
                setPartnerProfileData={setPartnerProfileData}
                setOpenMessageModal={setOpenMessageModal}
                setPartnerProfileData_services={setPartnerProfileData_services}
                setOpenModal={setOpenModal}
                setOpenModalOrder={setOpenModalOrder}
                setTabToRender={setTabToRender}
                setOpenRatingControl={setOpenRatingControl}
                setRatingControlData={setRatingControlData}
                setOrderAgainData={setOrderAgainData}
              />
            )}
          </View>
        </Tab>
      </Tabs>
      {openPaymentModalMessage && (
        <PaymentModalMessage
          openPaymentModalMessage={openPaymentModalMessage}
          setOpenPaymentModalMessage={setOpenPaymentModalMessage}
          paymentResponse={paymentResponse}
          setOpenModalOrder={setOpenModalOrder}
          setHasCart={setHasCart}
          setHasAppointment={setHasAppointment}
        />
      )}

      {openCardErrorMessage && (
        <CardAddedMessage
          openCardErrorMessage={openCardErrorMessage}
          setOpenCardErrorMessage={setOpenCardErrorMessage}
        />
      )}

      <MessageModal
        openMessageModal={openMessageModal}
        setOpenMessageModal={setOpenMessageModal}
        partnerProfileData={partnerProfileData}
      />

      <RatingControl
        openRatingControl={openRatingControl}
        setOpenRatingControl={setOpenRatingControl}
        ratingControlData={ratingControlData}
        setRatingControlData={setRatingControlData}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {},
});

export default Orders;
