import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {MaterialIndicator} from 'react-native-indicators';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ButtonComponent from './ButtonComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import * as appAction from '../store/actions/appAction';

import TextInputComponent from './TextInputComponent';

const CardAddedMessage = props => {
  const user = useSelector(state => state.authReducer.user);

  const [update_email, setUpdateEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const updateCustomerAccount = async () => {
    if (update_email !== '') {
      await appAction.updateEmail(user.user.stripeId, update_email);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        props.setOpenCardErrorMessage(false);
      }, 2000);
    }
  };

  let view;

  return (
    <View style={styles.screen}>
      <View>
        <SafeAreaView>
          <TouchableWithoutFeedback
            onPress={() => {
              props.setOpenCardErrorMessage(false);
            }}>
            <View style={{paddingHorizontal: 20}}>
              <Icon name="md-close" size={35} />
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
        <View style={{alignItems: 'center', marginTop: 50, marginTop: '5%'}}>
          <Icon name="md-close-circle" size={55} color={Colors.pink} />
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
              textAlign: 'center',
            }}>
            Snap, card declined. Please update your email and try adding your
            card again. If this error persist, use the "Pay without saving card"
            option. .
          </Text>

          <View style={{width: '80%'}}>
            <TextInputComponent
              placeholder={'Update you email address'}
              onChangeText={setUpdateEmail}
              moreStyles={{width: '100%'}}
              keyboardType="email-address"
              autoCapitalize="none"
              value={update_email}
              autoFocus
            />
          </View>

          <ButtonComponent
            moreStyles={{
              width: '60%',
              marginTop: 30,
              backgroundColor: Colors.purple_darken,
            }}
            buttonTextStyle={{color: '#fff', fontSize: 20}}
            title="update"
            onButtonPress={updateCustomerAccount}
          />
          {successMessage && (
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppins_bold,
                textAlign: 'center',
              }}>
              Update Successfull
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});

export default CardAddedMessage;
