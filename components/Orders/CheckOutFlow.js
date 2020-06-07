import React, {useState, useEffect, Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  Button,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {MaterialIndicator} from 'react-native-indicators';
import Geolocation from '@react-native-community/geolocation';
import TextInputComponent from '../TextInputComponent';

import Moment from 'moment';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonComponent from '../ButtonComponent';
import Loader from '../Loader';
import stripe from 'tipsi-stripe';

import * as appAction from '../../store/actions/appAction';
import io from 'socket.io-client';
import {URL} from '../../socketURL';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const CheckOutFlow = (props) => {
  const user = useSelector((state) => state.authReducer.user);
  const socket = io(URL);

  const {
    cartPerPartner,
    total,
    setTotal,
    cardData,
    clientId,
    setCardData,
    subTotal,
    setOpenCheckOutModal,
    setOpenModalOrder,
    stripeId,
    getTotal,
    allCart,
    setAllCart,
    setOpenPaymentModalMessage,
    openPaymentModalMessage,
    setPaymentResponse,
    paymentResponse,
    setHasCart,
    setOpenCardErrorMessage,
  } = props;
  const [activity, setActivity] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [textColorDate, setTextColorDate] = useState('#bdbdbd');
  const [textColorTime, setTextColorTime] = useState('#bdbdbd');
  const [bookingDate, setBookingDate] = useState(
    Moment(new Date()).format('MM / DD / YYYY'),
  );
  const [bookingTime, setBookingTime] = useState('Select a time');
  const [viewToRender, setViewToRender] = useState('appointment_date_time');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [comfortFee, setComfortFee] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [comfortFeeView, setComfortFeeView] = useState('');
  const [paymentMessage, setPaymentMessage] = useState(
    'Processing please wait..',
  );
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [displayNextButton, setDisplayNextButton] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [comfortFeeAddress, setComfortFeeAddress] = useState('');

  const [search, setSearch] = useState('');

  stripe.setOptions({
    publishableKey: 'pk_live_QWsiQoGX6Jrxu9x2kjUrL8Pu',
    merchantId: 'MERCHANT_ID', // Optional
    androidPayMode: 'test', // Android only
  });

  const creditCardHandler = async () => {
    try {
      setActivity(true);
      setLoadingMessage('Creating card please wait ...');
      const options = {
        managedAccountCurrency: 'usd',
        //  requiredBillingAddressFields: 'full',
        // prefilledInformation: {
        //   billingAddress: {
        //     name: user.user.name,
        //     country: 'US',
        //   },
        // },
      };
      const token = await stripe.paymentRequestWithCardForm(options);
      const response = await appAction.addCard(clientId, token.tokenId);
      if (!response.status) {
        setOpenCardErrorMessage(true);
        setLoadingMessage('');
        setActivity(false);
      } else {
        const data = response.cards.data.reverse();
        setCardData(data);
        setLoadingMessage('');
        setActivity(false);
      }
    } catch (e) {
      setLoadingMessage('');
      setActivity(false);
      console.log(e);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const newDate = Moment(date).format('MM / DD / YYYY');
    setBookingDate(newDate);
    hideDatePicker();
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    //  console.log('A time has been picked: ', time);
    let formatted = Moment(time, 'HH:mm:ss').format('hh:mm A');
    setBookingTime(formatted);
    hideTimePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const myApiKey = 'AIzaSyDEeUA1zS0cT-YHR8UyawDsYkoJop-enog';
  const myLocation = () => {
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

        setSearch(address);
        setActivityIndicator(false);
        setDisplayNextButton(true);
      },
      (error) => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleSearch = async (value) => {
    setSearch(value);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${value}&key=${myApiKey}`,
    );
    const resData = await response.json();
    setSearchData(resData.results);
    let newAdressArray = search.split(',');
    newAdressArray.length !== 4 && setDisplayNextButton(false);
  };

  updateLocation = async () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    let newAdressArray = search;
    setComfortFeeAddress(newAdressArray);
    setViewToRender('select_card');
    setComfortFeeView('');
    //console.log(comfortFeeAddress);
  };

  const updateTotal = (comfort_fee) => {
    setTotal((parseFloat(total) + parseFloat(comfort_fee)).toFixed(2));
    setComfortFee(comfort_fee);
    setComfortFeeView('enter_comfort_fee_location');
  };

  const chargeCard = async (cardId) => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    const chargeCardData = {
      cardId,
      cartId: cartPerPartner._id,
      partner_phone_number: cartPerPartner.partner.phone,
      client_phone_number: user.user.phone,
      subTotal,
      total,
      comfort_fee: comfortFee,
      bookingDate,
      bookingTime,
      stripeId,
      client_name: user.user.name,
      partner_name: cartPerPartner.partner.fName,
      comfortFeeAddress,
    };

    setIsLoading(true);
    const response = await appAction.chargeCard(chargeCardData);
    setIsLoading(false);
    if (!response.status) {
      setIsLoading(false);
      setPaymentResponse('error');
      setOpenPaymentModalMessage(true);
    } else {
      //emit newOrder to  partner
      const order = {
        to: cartPerPartner.partner._id,
        from: user.user._id,
      };
      socket.emit('newOrder', order);

      //remove from cart on front end
      const removeCart = allCart.filter(
        (value) => value._id !== cartPerPartner._id,
      );
      if (removeCart.length === 0) {
        setHasCart(false);
      }
      setAllCart(removeCart);
      setPaymentResponse('success');
      setOpenPaymentModalMessage(true);
    }
  };

  const oneTimePayment = async () => {
    try {
      const options = {
        managedAccountCurrency: 'usd',
      };
      const token = await stripe.paymentRequestWithCardForm(options);
      const chargeCardData = {
        tokenId: token.tokenId,
        cartId: cartPerPartner._id,
        partner_phone_number: cartPerPartner.partner.phone,
        client_phone_number: user.user.phone,
        subTotal,
        total,
        comfort_fee: comfortFee,
        bookingDate,
        bookingTime,
        stripeId,
        client_name: user.user.name,
        partner_name: cartPerPartner.partner.fName,
        comfortFeeAddress,
      };
      setIsLoading(true);
      const response = await appAction.chargeCardOneTime(chargeCardData);
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setPaymentResponse('error');
        setOpenPaymentModalMessage(true);
      } else {
        //emit newOrder to  partner
        const order = {
          to: cartPerPartner.partner._id,
          from: user.user._id,
        };
        socket.emit('newOrder', order);

        //remove from cart on front end
        const removeCart = allCart.filter(
          (value) => value._id !== cartPerPartner._id,
        );
        if (removeCart.length === 0) {
          setHasCart(false);
        }
        setAllCart(removeCart);
        setPaymentResponse('success');
        setOpenPaymentModalMessage(true);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const applePay = async () => {
    try {
      if (await stripe.deviceSupportsApplePay()) {
        await stripe.canMakeApplePayPayments();
        const items = [
          {
            label: 'health and beauty service',
            amount: total,
          },
          {
            label: 'iBeautyConnect, LLC',
            amount: total,
          },
        ];

        const token = await stripe.paymentRequestWithApplePay(items);
        const chargeCardData = {
          tokenId: token.tokenId,
          cartId: cartPerPartner._id,
          partner_phone_number: cartPerPartner.partner.phone,
          client_phone_number: user.user.phone,
          subTotal,
          total,
          comfort_fee: comfortFee,
          bookingDate,
          bookingTime,
          stripeId,
          client_name: user.user.name,
          partner_name: cartPerPartner.partner.fName,
          comfortFeeAddress,
        };
        setIsLoading(true);
        const response = await appAction.chargeCardOneTime(chargeCardData);
        setIsLoading(false);
        if (!response.status) {
          setPaymentResponse('error');
          setOpenPaymentModalMessage(true);
        } else {
          //emit newOrder to  partner
          const order = {
            to: cartPerPartner.partner._id,
            from: user.user._id,
          };
          socket.emit('newOrder', order);

          //remove from cart on front end
          const removeCart = allCart.filter(
            (value) => value._id !== cartPerPartner._id,
          );
          if (removeCart.length === 0) {
            setHasCart(false);
          }
          setAllCart(removeCart);
          setPaymentResponse('success');
          setOpenPaymentModalMessage(true);
          stripe.completeApplePayRequest();
        }
        stripe.completeApplePayRequest();
      } else {
        console.log('here');
        // stripe.openApplePaySetup();
      }
    } catch (error) {
      console.log(error);
      stripe.cancelApplePayRequest();
      const {code} = error;
      if (code !== 'cancelled') {
        stripe.openApplePaySetup();
      }
    }
  };

  const cards = cardData.map((card) => {
    return (
      <View key={card.id} style={styles.cardContainer}>
        <TouchableWithoutFeedback onPress={chargeCard.bind(this, card.id)}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              marginRight: 10,
              justifyContent: 'space-between',
              padding: 5,
            }}>
            <Text
              style={{
                marginLeft: 10,
                color: '#000',
                fontSize: 20,
                fontFamily: Fonts.poppins_regular,
              }}>
              {`${card.brand} ending in ${card.last4}`}
            </Text>
            <Icon name="ios-arrow-forward" size={25} style={{marginTop: 3}} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  });

  let view_comfort_fee;

  if (comfortFeeView === '') {
    view_comfort_fee = (
      <View>
        <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 20}}>
          Comfort fee
        </Text>
        <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 18}}>
          {cartPerPartner.partner.comfortFee === '0.00'
            ? 'This professional does not offer comfort services at this time'
            : 'This professional has a comfort fee of $' +
              cartPerPartner.partner.comfortFee +
              '. This fee is applied if the professional comes to you'}
        </Text>

        <View
          style={[
            {...styles.comfortCard},
            {
              backgroundColor:
                cartPerPartner.partner.comfortFee === '0.00'
                  ? Colors.light_grey
                  : '#fff',
            },
          ]}>
          <TouchableWithoutFeedback
            disabled={
              cartPerPartner.partner.comfortFee === '0.00' ? true : false
            }
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
              setComfortFee(cartPerPartner.partner.comfortFee);
              updateTotal(cartPerPartner.partner.comfortFee);
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: Fonts.poppins_regular,
                }}>
                Apply fee
              </Text>
              <Icon name="ios-arrow-forward" size={20} style={{marginTop: 3}} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.comfortCard}>
          <TouchableWithoutFeedback
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
              getTotal();
              setComfortFee('0.00');
              setViewToRender('select_card');
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: Fonts.poppins_regular,
                }}>
                Do not apply fee
              </Text>
              <Icon name="ios-arrow-forward" size={20} style={{marginTop: 3}} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  } else {
    view_comfort_fee = (
      <View>
        <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 20}}>
          What address will you want{' '}
          {cartPerPartner.partner.fName + ' ' + cartPerPartner.partner.lName} to
          meet you at?
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: displayNextButton ? '85%' : '100%'}}>
            <TextInputComponent
              placeholder={'Search'}
              onChangeText={handleSearch}
              moreStyles={{width: '100%'}}
              value={search}
              autoFocus
            />
          </View>
          {displayNextButton && (
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.purple_darken,
                  marginTop: 15,
                  padding: 10,
                  borderRadius: 40,
                }}
                onPress={updateLocation}>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View>
          {!activityIndicator ? (
            <TouchableOpacity
              style={{
                paddingHorizontal: 5,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#bdbdbd',
                width: '100%',
                alignSelf: 'center',
                marginTop: 20,
                flexDirection: 'row',
                //display: !displayCheckButton ? 'none' : 'flex',
              }}
              onPress={myLocation}>
              <Icon
                name="md-locate"
                size={20}
                style={{marginRight: 10, marginTop: 3}}
                color={Colors.pink}
              />
              <Text
                style={{
                  fontSize: 20,
                  color: '#000',
                  fontFamily: Fonts.poppins_regular,
                }}>
                Use my current location
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                marginTop: 30,
              }}>
              <MaterialIndicator color={Colors.purple_darken} />
            </View>
          )}
        </View>
        <FlatList
          data={searchData}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listView}
              onPress={() => {
                setSearch(item.formatted_address);
                setDisplayNextButton(true);
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.poppins_regular,
                }}>
                {item.formatted_address}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          style={{height: '100%'}}
        />
      </View>
    );
  }

  let view;

  if (viewToRender === 'appointment_date_time') {
    view = (
      <View>
        <View style={{marginBottom: 20}}>
          <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 20}}>
            Select an appointment date
          </Text>
          <TouchableOpacity
            style={styles.dropDownList}
            onPress={showDatePicker}>
            <Text
              style={{
                fontSize: 18,
                paddingLeft: 13,
                paddingBottom: 10,
                color: bookingDate === 'Select a date' ? textColorDate : '#000',
                marginTop: 10,
                fontFamily: Fonts.poppins_regular,
              }}>
              {bookingDate}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={30}
              style={{marginRight: 10, marginTop: 10}}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 20}}>
            Select an appointment time
          </Text>
          <TouchableOpacity
            style={styles.dropDownList}
            onPress={showTimePicker}>
            <Text
              style={{
                fontSize: 18,
                paddingLeft: 13,
                paddingBottom: 10,
                color: bookingTime === 'Select a time' ? textColorTime : '#000',
                marginTop: 10,
                fontFamily: Fonts.poppins_regular,
              }}>
              {bookingTime}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={30}
              style={{marginRight: 10, marginTop: 10}}
            />
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          locale="en_GB" // Use "en_GB" here
          date={new Date()}
          isDarkModeEnabled={false}
          minimumDate={new Date()}
        />
        {bookingDate === Moment(new Date()).format('MM / DD / YYYY') ? (
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
            isDarkModeEnabled={false}
            headerTextIOS="Pick a time"
            minimumDate={new Date()}
          />
        ) : (
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
            isDarkModeEnabled={false}
            headerTextIOS="Pick a time"
          />
        )}

        <ButtonComponent
          moreStyles={{
            width: '100%',
            marginTop: 20,
            backgroundColor: Colors.purple_darken,
            opacity:
              bookingTime == 'Select a time' || bookingDate == 'Select a date'
                ? 0.5
                : 1,
          }}
          title="Next"
          onButtonPress={() => {
            setViewToRender('comfort_fee');
          }}
          disabled={
            bookingTime == 'Select a time' || bookingDate == 'Select a date'
              ? true
              : false
          }
        />
      </View>
    );
  } else if (viewToRender === 'comfort_fee') {
    view = view_comfort_fee;
  } else if (viewToRender === 'select_card') {
    view = (
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              marginTop: 3,
            }}>
            Select a card below
          </Text>

          <TouchableWithoutFeedback onPress={creditCardHandler}>
            <View style={styles.button}>
              <Icon
                name="ios-card"
                size={30}
                style={{marginRight: 10}}
                color={Colors.purple_darken}
              />
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  color: Colors.purple_darken,
                  marginTop: 5,
                }}>
                Add card
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flex: 1,
              marginTop: 10,
            }}>
            {cardData.length === 0 && (
              <View style={{alignItems: 'center', marginTop: 20}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    marginTop: 3,
                    color: Colors.grey_darken,
                    textAlign: 'center',
                  }}>
                  You have no card(s) on file. You can add a card or continue
                  with the "Pay without saving card" button below
                </Text>
              </View>
            )}

            {cards}
          </View>
        </ScrollView>
        <TouchableOpacity onPress={oneTimePayment}>
          <View
            style={{
              marginBottom: 10,
              backgroundColor: '#000',
              borderRadius: 5,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AntDesign
              name="wallet"
              size={30}
              style={{marginRight: 10, marginTop: 3}}
              color="#fff"
            />
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 20,
                color: '#fff',
              }}>
              Pay without saving card
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{borderTopWidth: 1, padding: 20, borderColor: '#bdbdbd'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
              }}>
              Subtotal
            </Text>

            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
              }}>
              ${subTotal}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
              }}>
              Comfort fee
            </Text>

            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
              }}>
              ${comfortFee}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
              }}>
              Processing fee
            </Text>

            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
              }}>
              $0 (Promotion)
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
              }}>
              Total
            </Text>

            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
              }}>
              ${total}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <View style={{flex: 1}}>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            getTotal();
            props.setViewToRender('display_cart');
          }}>
          <View
            style={{
              marginLeft: 5,
              marginTop: 20,
              paddingRight: 10,
              marginBottom: 20,
            }}>
            <Icon name="md-arrow-back" size={20} />
          </View>
        </TouchableWithoutFeedback>

        {activity ? (
          <View style={{marginTop: '50%', alignItems: 'center'}}>
            <MaterialIndicator color={Colors.purple_darken} />
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.poppins_regular,
                color: Colors.midnight_blue,
              }}>
              {loadingMessage}
            </Text>
          </View>
        ) : (
          view
        )}
      </View>
      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage={paymentMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
  },
  dropDownList: {
    borderColor: '#bdbdbd',
    borderRadius: 5,
    width: '100%',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  listView: {
    flexDirection: 'column',
    padding: 5,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
  },
  comfortCard: {
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    backgroundColor: 'white',
    elevation: 5,
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  cardContainer: {
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    backgroundColor: 'white',
    elevation: 5,
    paddingTop: 20,
    paddingLeft: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 5,
    marginTop: 10,
  },

  button: {
    width: '30%',
    flexDirection: 'row',
  },
});

export default CheckOutFlow;
