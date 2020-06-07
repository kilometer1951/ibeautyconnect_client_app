import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modalbox';
import TextInputComponent from './TextInputComponent';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ButtonComponent from './ButtonComponent';
import StarRating from 'react-native-star-rating';
//import Toast from 'react-native-root-toast';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Icon from 'react-native-vector-icons/Ionicons';

import * as appAction from '../store/actions/appAction';

import {URL} from '../socketURL';
import io from 'socket.io-client';
import {YellowBox} from 'react-native';

const RatingControl = props => {
  const user = useSelector(state => state.authReducer.user);
  const socket = io(URL);

  const {
    openRatingControl,
    setOpenRatingControl,
    ratingControlData,
    setRatingControlData,
  } = props;
  const [commentInput, setCommentInput] = useState('');
  const [rateNumber, setRateNumber] = useState(5);
  const [messageSent, setMessageSent] = useState(false);

  const onCloseRatingModal = () => {
    Keyboard.dismiss();
    setOpenRatingControl(false);
  };

  const handleRating = async () => {
    if (commentInput !== '') {
      const {clientId, partnerId, cartId} = ratingControlData;
      const rateData = {
        clientId,
        partnerId,
        rateNumber,
        comment: commentInput,
        cartId,
      };

      await appAction.addRating(rateData);

      setRateNumber(5);
      setCommentInput('');
      setMessageSent(true);
      setTimeout(() => {
        setMessageSent(false);
      }, 1000);
      // onCloseRatingModal();
    }
  };

  const onStarRatingPress = rating => {
    setRateNumber(rating);
  };

  return (
    <Modal
      style={styles.modal}
      position={'bottom'}
      isOpen={openRatingControl}
      onClosed={onCloseRatingModal}>
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            onCloseRatingModal();
          }}>
          <View>
            <Icon
              name="ios-close-circle-outline"
              size={30}
              style={{alignSelf: 'flex-end'}}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={{marginTop: 20, marginBottom: 20}}>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={rateNumber}
            selectedStar={rating => onStarRatingPress(rating)}
            fullStarColor={Colors.purple_darken}
          />
        </View>
        <TextInputComponent
          placeholder={'Anything cool about the professional'}
          onChangeText={value => setCommentInput(value)}
          value={commentInput}
          moreStyles={{width: '100%', height: 130, marginBottom: 10}}
          label="How was your service"
          multiline={true}
          numberOfLines={4}
        />
        <Text
          style={{
            display: messageSent ? 'flex' : 'none',
            fontFamily: Fonts.poppins_regular,
            marginBottom: 5,
          }}>
          Thanks for your review. At iBeautyConnect we take reviews seriously.
        </Text>
        <ButtonComponent
          moreStyles={{
            width: '100%',
          }}
          buttonTextStyle={{fontSize: 20}}
          title="Rate"
          onButtonPress={handleRating}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    borderRadius: 10,
    padding: 20,
    height: '50%',
  },
});

export default RatingControl;
