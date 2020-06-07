import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Button,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {MaterialIndicator} from 'react-native-indicators';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import Icons from 'react-native-vector-icons/Ionicons';
import ModalWebView from '../../ModalWebView';

import Loader from '../../Loader';
import * as authActions from '../../../store/actions/authAction';

import Fonts from '../../../contants/Fonts';
import Colors from '../../../contants/Colors';
import TextInputComponent from '../../TextInputComponent';
import TextComponent from '../../TextComponent';
import Error from '../../Error';
import ButtonComponent from '../../ButtonComponent';

const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const Signup = props => {
  const {activityIndicator, setActivityIndicator} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [resendActivityIndicator, setResendActivityIndicator] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorPhone, setErrorPhoneNumber] = useState('');
  const [errorVerification, setErrorVerification] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [view, setView] = useState('phoneNumber');
  const [code, setCode] = useState('');
  const [user_exist, setUserExist] = useState(false);
  const [responseApi, setResponseApi] = useState({});
  const [modalWebView, setModalWebView] = useState(false);
  const dispatch = useDispatch();

  const handlePosition = async viewToShow => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);
    if (view === 'phoneNumber') {
      if (phoneNumber === '') {
        setErrorVerification('Please enter your phone number');
        return;
      } else {
        setIsLoading(true);
        setLoadingMessage('Verifying your number please wait');
        setTimeout(function() {
          setLoadingMessage('We are almost there');
        }, 4000);
        const response = await authActions.verifiyPhoneNumber(phoneNumber);
        setLoadingMessage('Verifying your number please wait');
        setIsLoading(false);

        if (!response.status) {
          setErrorPhoneNumber('Error handling phone number');
          return;
        }
        setUserExist(response.user_exist);
        setResponseApi(response);
        setErrorPhoneNumber('');
        setCode(response.code);
        setView(viewToShow);
      }
    }
    if (view === 'verification') {
      if (verificationCode === '') {
        setErrorVerification(`Please enter the code sent to:${phoneNumber}`);
        return;
      } else if (verificationCode != code) {
        setErrorVerification(`Code is not valid`);
        return;
      } else if (!user_exist) {
        setErrorVerification('');
        setView(viewToShow);
      } else if (user_exist) {
        // navigate to home screen
        await AsyncStorage.setItem(
          '@userData',
          JSON.stringify({
            user: responseApi.user,
          }),
        );
        const userData = await AsyncStorage.getItem('@userData');
        await dispatch(authActions.getUser(userData));
        props.navigationProperties.navigation.navigate('App');
      }
    }
  };

  const handleSignup = async () => {
    if (name === '') {
      setErrorName('Please enter your name');
      return;
    } else {
      setErrorName('');
    }
    if (email === '') {
      setErrorEmail('Please enter your email');
      return;
    } else if (!validateEmail(email)) {
      setErrorEmail('Email not valid');
      return;
    } else {
      setErrorEmail('');
    }

    setLoadingMessage('Creating account');
    setIsLoading(true);
    const respond = await authActions.createAcctount(name, phoneNumber, email);
    setIsLoading(false);
    const userData = await AsyncStorage.getItem('@userData');
    await dispatch(authActions.getUser(userData));
    props.navigationProperties.navigation.navigate('App');
  };

  const handlePhoneNumber = value => {
    const formatted = value
      .replace(/[^\d]+/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    setPhoneNumber(formatted);
  };

  const resendCode = async () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);
    setResendActivityIndicator(true);
    const response = await authActions.verifiyPhoneNumber(phoneNumber);
    setResendActivityIndicator(false);
    setErrorVerification(`Code sent to: ${phoneNumber}`);

    //if resData.status is true continue else return error
    if (!response.status) {
      setErrorVerification(`Error handling phone number`);
      return;
    }
    setCode(response.code);
  };

  const handleBack = () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);
    if (view === 'verification') {
      setView('phoneNumber');
    }
    if (view === 'profileDetails') {
      setView('verification');
    }
  };

  let displayedView;

  if (view === 'phoneNumber') {
    displayedView = (
      <View>
        <View
          style={{
            paddingHorizontal: 10,
            height: '90%',
          }}>
          <TextInputComponent
            placeholder={'(312) 708-0122*'}
            onChangeText={handlePhoneNumber}
            value={phoneNumber}
            keyboardType="phone-pad"
            maxLength={14}
            moreStyles={{width: '100%'}}
            label="What's your phone number*"
            autoFocus
          />
          {errorPhone !== '' && <Error error={errorPhone} />}

          <Text
            style={{
              fontFamily: Fonts.poppins_bold,
              fontSize: 18,
            }}>
            We will send you a code to verify your phone number
          </Text>
        </View>

        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={{paddingRight: 20}}>
            <TouchableWithoutFeedback
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
                handlePosition('verification', 1);
              }}
              disabled={phoneNumber === '' ? true : false}>
              <View style={styles.button}>
                <Icons name="md-arrow-round-forward" size={40} color="white" />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  } else if (view === 'verification') {
    displayedView = (
      <View>
        <View
          style={{
            paddingHorizontal: 10,
            height: '90%',
          }}>
          <TextInputComponent
            placeholder={'Enter Verification Code'}
            onChangeText={value => setVerificationCode(value)}
            value={verificationCode}
            keyboardType="phone-pad"
            maxLength={5}
            moreStyles={{width: '100%'}}
            label="Verification Code*"
            autoFocus
          />
          {errorVerification !== '' && <Error error={errorVerification} />}
          {resendActivityIndicator ? (
            <View style={{marginTop: 50}}>
              <MaterialIndicator
                color={Colors.purple_darken}
                style={{
                  alignSelf: 'flex-start',
                  paddingHorizontal: 10,
                }}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={resendCode}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_bold,
                  fontSize: 18,
                }}>
                Resend Code
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={130}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={{paddingRight: 20}}>
            <TouchableWithoutFeedback
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
                handlePosition('profileDetails');
              }}
              disabled={verificationCode === '' ? true : false}>
              <View style={styles.button}>
                <Icons name="md-arrow-round-forward" size={40} color="white" />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  } else {
    displayedView = (
      <View>
        <View
          style={{
            paddingHorizontal: 10,
            height: '90%',
          }}>
          <View>
            <TextInputComponent
              placeholder={'Your name*'}
              onChangeText={value => {
                setErrorName('');
                setName(value);
              }}
              value={name}
              moreStyles={{width: '100%'}}
              label="What's your name"
              autoFocus
            />
            {errorName !== '' && <Error error={errorName} />}
          </View>
          <View style={{marginTop: 20}}>
            <TextInputComponent
              placeholder={'your email*'}
              onChangeText={value => {
                setErrorEmail('');
                setEmail(value);
              }}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              moreStyles={{width: '100%'}}
              label="What's your email"
              autoFocus
            />
            {errorEmail !== '' && <Error error={errorEmail} />}
            <TouchableOpacity
              style={{paddingHorizontal: 3, marginTop: 10}}
              onPress={() => {
                setModalWebView(true);
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_bold,
                  fontSize: 18,
                }}>
                By Signing up, you agree to our terms and condition
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={130}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={{paddingRight: 20}}>
            <TouchableWithoutFeedback
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
                handleSignup();
              }}
              disabled={email === '' || name === '' ? true : false}>
              <View style={styles.button}>
                <Icons name="md-arrow-round-forward" size={40} color="white" />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <SafeAreaView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View>
            {view !== 'phoneNumber' && (
              <TouchableOpacity
                onPress={handleBack}
                style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons name="chevron-left" size={30} />
                <Text
                  style={{
                    fontFamily: Fonts.poppins_bold,
                    fontSize: 18,
                    marginTop: 2,
                  }}>
                  back
                </Text>
              </TouchableOpacity>
            )}
            <View style={styles.authContainer}>{displayedView}</View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>

      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage={loadingMessage}
      />
      <ModalWebView
        setModalWebView={setModalWebView}
        modalWebView={modalWebView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flexDirection: 'column',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
  },
});

export default Signup;
