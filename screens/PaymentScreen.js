import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import stripe from 'tipsi-stripe';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ButtonComponent from '../components/ButtonComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import * as appAction from '../store/actions/appAction';
import {MaterialIndicator} from 'react-native-indicators';
import DeleteCard from '../components/Payment/DeleteCard';
import CardAddedMessage from '../components/CardAddedMessage';
import RefreshNetworkError from '../components/RefreshNetworkError';

const PaymentScreen = (props) => {
  const user = useSelector((state) => state.authReducer.user);
  const [openCardErrorMessage, setOpenCardErrorMessage] = useState(false);

  const [cardData, setCardData] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [activity, setActivity] = useState(false);
  const [loadCardActivity, setLoadCardActivity] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [deleteData, setDeleteData] = useState({});

  stripe.setOptions({
    publishableKey: 'pk_live_QWsiQoGX6Jrxu9x2kjUrL8Pu',
    merchantId: 'MERCHANT_ID', // Optional
    androidPayMode: 'test', // Android only
  });

  const getClientCards = async () => {
    setLoadCardActivity(true);
    const response = await appAction.getClientCards(user.user.stripeId);
    const data = response.cards.data.reverse();
    console.log(data);
    setCardData(data);
    setLoadCardActivity(false);
  };

  useEffect(() => {
    getClientCards();
  }, []);

  const creditCardHandler = async () => {
    try {
      setActivity(true);
      setLoadingMessage('Creating card please wait ...');
      const options = {
        managedAccountCurrency: 'usd',
      };
      const token = await stripe.paymentRequestWithCardForm(options);
      const response = await appAction.addCard(user.user._id, token.tokenId);
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

  const handleOpenDeleteModal = (cardId) => {
    setDeleteData({stripeId: user.user.stripeId, cardId});
    setOpenDeleteModal(true);
  };

  const handleDeleteCard = async () => {
    try {
      await appAction.deleteCard(deleteData);
      setOpenDeleteModal(false);
      getClientCards();
    } catch (e) {
      console.log('Network error');
    }
  };

  const cards = cardData.map((card) => {
    return (
      <View key={card.id} style={styles.cardContainer}>
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
              color: '#fff',
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
            }}>
            {`${card.brand} ending in ${card.last4}`}
          </Text>
          <TouchableWithoutFeedback
            onPress={handleOpenDeleteModal.bind(this, card.id)}>
            <Icon
              name="ios-trash"
              size={25}
              color="#fff"
              style={{marginTop: 3}}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  });

  let view;

  if (cardData.length === 0) {
    view = (
      <View
        style={{
          alignItems: 'center',
          marginTop: '50%',
          flex: 1,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.poppins_regular,
          }}>
          You have no card on file
        </Text>
        <ButtonComponent
          moreStyles={{
            width: '40%',
            marginTop: 30,
            backgroundColor: Colors.purple_darken,
          }}
          buttonTextStyle={{color: '#fff', fontSize: 16}}
          title="Add card"
          icon={
            <Icon
              name="ios-card"
              size={20}
              color="#fff"
              style={{marginRight: 10}}
            />
          }
          onButtonPress={creditCardHandler}
        />
      </View>
    );
  } else {
    view = (
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <TouchableWithoutFeedback onPress={creditCardHandler}>
            <View style={styles.button}>
              <Icon
                name="ios-card"
                size={30}
                style={{marginRight: 10}}
                color={Colors.green}
              />
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
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
              marginTop: 20,
            }}>
            {cards}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <RefreshNetworkError navigation={props.navigation} />
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('Profile');
              }}>
              <View
                style={{
                  marginHorizontal: 20,
                  height: 30,
                  width: 30,
                  paddingTop: 4,
                  alignItems: 'center',
                }}>
                <Icon name="md-arrow-back" size={20} />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                width: '60%',
                marginLeft: 20,
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 19}}>
                Payment
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        {loadCardActivity ? (
          <MaterialIndicator
            color={Colors.purple_darken}
            style={{marginTop: 20}}
          />
        ) : (
          view
        )}
      </View>
      {openCardErrorMessage && (
        <CardAddedMessage
          openCardErrorMessage={openCardErrorMessage}
          setOpenCardErrorMessage={setOpenCardErrorMessage}
        />
      )}
      <DeleteCard
        openDeleteModal={openDeleteModal}
        handleDeleteCard={handleDeleteCard}
        setOpenDeleteModal={setOpenDeleteModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
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
    borderRadius: 5,
    backgroundColor: Colors.purple_darken,
    marginBottom: 20,
  },
  button: {
    width: '30%',
    flexDirection: 'row',
    marginTop: 20,
  },
  header: {
    width: '100%',
    height: '11%',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
});

export default PaymentScreen;
