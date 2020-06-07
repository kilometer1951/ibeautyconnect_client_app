import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import * as appAction from '../../store/actions/appAction';

import Icon from 'react-native-vector-icons/Ionicons';

import ViewCartItem from './ViewCartItem';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';

const Cart = props => {
  const {
    clientId,
    allCart,
    itemsData,
    setItemsData,
    setAllCart,
    setHasCart,
    stripeId,
    setOpenModalOrder,
    openPaymentModalMessage,
    setOpenPaymentModalMessage,
    paymentResponse,
    setPaymentResponse,
    setOpenMessageModal,
    setPartnerProfileData,
    setOpenCardErrorMessage,
  } = props;

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCheckOutModal, setOpenCheckOutModal] = useState(false);
  const [itemActivity, setItemActivity] = useState(false);
  const [cartPerPartner, setCartPerPartner] = useState({});
  const [itemPerPartner, setItemPerPartner] = useState([]);
  const [cardData, setCardData] = useState([]);

  String.prototype.trunc =
    String.prototype.trunc ||
    function(n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this;
    };

  const getClientCards = async () => {
    const response = await appAction.getClientCards(stripeId);
    const data = response.cards.data.reverse();
    setCardData(data);
  };

  const handleCheckoutModal = async cart => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setItemActivity(true);
    setOpenCheckOutModal(true);
    getClientCards();
    const response = await appAction.getItemInCartPerClient(cart._id);
    setItemPerPartner(response.items);
    setCartPerPartner(cart);
    setItemActivity(false);
  };

  const onClose = () => {
    setOpenDeleteModal(false);
  };

  const handleMessageModal = (_id, fName) => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setPartnerProfileData({_id, fName});
    setOpenMessageModal(true);
  };

  let cart;

  if (allCart.length === 0) {
    return (cart = (
      <View
        style={{
          marginTop: '50%',
          alignItems: 'center',
          flex: 1,
        }}>
        <Icon name="ios-cart" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
          }}>
          You have no orders
        </Text>
      </View>
    ));
  } else {
    cart = (
      <View style={{flex: 1}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={allCart}
          renderItem={({item, index}) => (
            <View style={styles.listView}>
              <TouchableWithoutFeedback
                onPress={handleCheckoutModal.bind(this, item)}>
                <View style={styles.serviceContainer}>
                  <View style={styles.leftContainer}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{uri: item.partner.profilePhoto}}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: Fonts.poppins_bold,
                          fontSize: 15,
                          marginLeft: 5,
                        }}>
                        {item.partner.fName + ' ' + item.partner.lName}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.poppins_regular,
                          marginLeft: 5,
                        }}>
                        {item.partner.profession}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rightContainer}>
                    <TouchableWithoutFeedback
                      onPress={handleMessageModal.bind(
                        this,
                        item.partner._id,
                        item.partner.fName,
                      )}>
                      <View style={styles.button}>
                        <Icon
                          name="ios-chatbubbles"
                          size={30}
                          style={{marginRight: 10}}
                          color={Colors.pink}
                        />
                        <Text
                          style={{
                            fontFamily: Fonts.poppins_regular,
                            marginTop: 2,
                          }}>
                          Message
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={handleCheckoutModal.bind(this, item)}>
                      <View style={styles.button}>
                        <Icon
                          name="md-eye"
                          size={30}
                          style={{marginRight: 10}}
                          color={Colors.green}
                        />
                        <Text
                          style={{
                            fontFamily: Fonts.poppins_regular,
                            marginTop: 2,
                          }}>
                          View order
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
          keyExtractor={item => item._id}
          extraData={allCart}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {cart}
      {openCheckOutModal && (
        <ViewCartItem
          openCheckOutModal={openCheckOutModal}
          setOpenCheckOutModal={setOpenCheckOutModal}
          cartPerPartner={cartPerPartner}
          setCartPerPartner={setCartPerPartner}
          itemPerPartner={itemPerPartner}
          setItemPerPartner={setItemPerPartner}
          setHasCart={setHasCart}
          setAllCart={setAllCart}
          allCart={allCart}
          stripeId={stripeId}
          clientId={clientId}
          setOpenModalOrder={setOpenModalOrder}
          cardData={cardData}
          setCardData={setCardData}
          itemActivity={itemActivity}
          setItemActivity={setItemActivity}
          openPaymentModalMessage={openPaymentModalMessage}
          setOpenPaymentModalMessage={setOpenPaymentModalMessage}
          paymentResponse={paymentResponse}
          setPaymentResponse={setPaymentResponse}
          setOpenCardErrorMessage={setOpenCardErrorMessage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listView: {
    flexDirection: 'column',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    backgroundColor: 'white',
    bottom: 0,
    elevation: 5,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  serviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    width: '100%',
  },
  leftContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  rightContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  button: {
    width: '30%',
    padding: 5,
    flexDirection: 'row',
    marginTop: 5,
    marginRight: 30,
  },
});

export default Cart;
