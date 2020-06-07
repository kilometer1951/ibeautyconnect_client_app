import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as appAction from '../../store/actions/appAction';
import {MaterialIndicator} from 'react-native-indicators';

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';
import DeleteItem from './DeleteItem';

import DisplayCart from './DisplayCart';
import CheckOutFlow from './CheckOutFlow';
import io from 'socket.io-client';
import {URL} from '../../socketURL';

const ViewCartItem = props => {
  const socket = io(URL);
  const user = useSelector(state => state.authReducer.user);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState();
  const [subTotal, setSubTotal] = useState(0.0);
  const [total, setTotal] = useState(0);
  const [viewToRender, setViewToRender] = useState('display_cart');
  const {
    openCheckOutModal,
    setOpenCheckOutModal,
    cartPerPartner,
    setCartPerPartner,
    setItemPerPartner,
    itemPerPartner,
    setHasCart,
    allCart,
    setAllCart,
    stripeId,
    clientId,
    setOpenModalOrder,
    cardData,
    setCardData,
    itemActivity,
    setItemActivity,
    openPaymentModalMessage,
    setOpenPaymentModalMessage,
    paymentResponse,
    setPaymentResponse,
    setOpenCardErrorMessage,
  } = props;

  const getTotal = () => {
    let count_sub_total = 0;
    for (let i = 0; i < itemPerPartner.length; i++) {
      let pricePerItem = parseFloat(
        itemPerPartner[i].services.servicePricePerHour,
      );
      count_sub_total += parseFloat(pricePerItem);
    }
    setSubTotal(count_sub_total.toFixed(2));
    setTotal((count_sub_total + 0.0).toFixed(2));
  };
  useEffect(() => {
    getTotal();
  }, [itemPerPartner]);

  const onClose = () => {
    setSubTotal(0.0);
    setViewToRender('display_cart');
    setCartPerPartner({});
    setItemPerPartner([]);
    setOpenCheckOutModal(false);
  };

  const onClosingState = state => {
    console.log('the open/close of the swipeToClose just changed');
  };

  const openDelete = itemId => {
    setOpenDeleteModal(true);
    setItemToDelete(itemId);
  };

  const handleDeleteCart = () => {
    appAction.deleteCartItem(cartPerPartner._id, itemToDelete);
    const deleteData = itemPerPartner.filter(
      value => value._id !== itemToDelete,
    );

    setItemPerPartner(deleteData);

    if (deleteData.length === 0) {
      const removeCart = allCart.filter(
        value => value._id !== cartPerPartner._id,
      );
      socket.emit('noDataInCart', user.user._id);
      onClose();
      setAllCart(removeCart);
    }

    setOpenDeleteModal(false);
  };

  const handleCheckOut = () => {
    setViewToRender('checkout_flow');
  };

  return (
    <View style={{height: '100%'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent:
            viewToRender !== 'display_cart' ? 'space-between' : 'flex-start',
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            setOpenCheckOutModal(false);
          }}>
          <View
            style={{
              marginRight: 10,
              marginLeft: 25,
              marginTop: 10,
              paddingRight: 10,
              display: viewToRender !== 'display_cart' && 'none',
            }}>
            <Icon name="md-arrow-back" size={20} />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {viewToRender === 'display_cart' ? (
        itemActivity ? (
          <MaterialIndicator
            color={Colors.purple_darken}
            style={{marginTop: 30}}
          />
        ) : (
          <DisplayCart
            itemPerPartner={itemPerPartner}
            openDelete={openDelete}
            handleDeleteCart={handleDeleteCart}
            setOpenDeleteModal={setOpenDeleteModal}
            subTotal={subTotal}
            total={total}
            handleCheckOut={handleCheckOut}
            openDeleteModal={openDeleteModal}
          />
        )
      ) : (
        <CheckOutFlow
          cartPerPartner={cartPerPartner}
          total={total}
          setTotal={setTotal}
          cardData={cardData}
          clientId={clientId}
          setCardData={setCardData}
          subTotal={subTotal}
          setOpenCheckOutModal={setOpenCheckOutModal}
          setOpenModalOrder={setOpenModalOrder}
          stripeId={stripeId}
          getTotal={getTotal}
          setViewToRender={setViewToRender}
          allCart={allCart}
          setAllCart={setAllCart}
          openPaymentModalMessage={openPaymentModalMessage}
          setOpenPaymentModalMessage={setOpenPaymentModalMessage}
          paymentResponse={paymentResponse}
          setPaymentResponse={setPaymentResponse}
          setHasCart={setHasCart}
          setOpenCardErrorMessage={setOpenCardErrorMessage}
        />
      )}
      <DeleteItem
        openDeleteModal={openDeleteModal}
        handleDeleteCart={handleDeleteCart}
        setOpenDeleteModal={setOpenDeleteModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default ViewCartItem;
