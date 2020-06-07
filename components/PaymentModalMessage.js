import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ButtonComponent from './ButtonComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const PaymentModalMessage = props => {
  let view;
  if (props.paymentResponse === 'success') {
    view = (
      <View>
        <View style={{alignItems: 'center', marginTop: 40, marginTop: '40%'}}>
          <Icon
            name="md-checkmark-circle"
            size={55}
            color={Colors.purple_darken}
          />
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
              textAlign: 'center',
              marginTop: 20,
              paddingHorizontal: 20,
            }}>
            Success, thanks for your purchase. We just notified the
            professional. We'll send you a notification to remind you of your
            appoitment. Thanks
          </Text>
          <ButtonComponent
            moreStyles={{
              width: '60%',
              marginTop: 30,
              backgroundColor: Colors.purple_darken,
            }}
            buttonTextStyle={{color: '#fff', fontSize: 20}}
            title="Done"
            onButtonPress={() => {
              props.setOpenPaymentModalMessage(false);
              props.setOpenModalOrder(false);
              props.setHasAppointment(true);
            }}
          />
        </View>
      </View>
    );
  } else {
    view = (
      <View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 50,
            marginTop: '40%',
            paddingHorizontal: 20,
          }}>
          <Icon name="md-close-circle" size={55} color={Colors.pink} />
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
              textAlign: 'center',
            }}>
            Snap, card declined. Please contact your bank.
          </Text>
          <ButtonComponent
            moreStyles={{
              width: '60%',
              marginTop: 30,
              backgroundColor: Colors.purple_darken,
            }}
            buttonTextStyle={{color: '#fff', fontSize: 20}}
            title="Close"
            onButtonPress={() => {
              props.setOpenPaymentModalMessage(false);
            }}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <View style={{}}>{view}</View>
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

export default PaymentModalMessage;
