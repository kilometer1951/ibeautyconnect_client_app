import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  Animated,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ImageView from 'react-native-image-view';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import PushNotification from 'react-native-push-notification';
import RefreshNetworkError from '../components/RefreshNetworkError';

import * as appAction from '../store/actions/appAction';
import AppFooter from '../components/AppFooter';
import Partners from '../components/Home/Partners';
import PartnerAccountModal from '../modal/PartnerAccountModal';
import Filter from '../modal/Filter';
import Orders from '../modal/Orders';
import Appointment from '../modal/Appointment';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {URL} from '../socketURL';
import ButtonComponent from '../components/ButtonComponent';
import {Overlay} from 'react-native-elements';

import VideoPreview from '../components/Home/VideoPreview';

const HomeScreen = (props) => {
  const user = useSelector((state) => state.authReducer.user);
  const [activeTab, setActiveTab] = useState('home');
  const [partnerData, setPartnerData] = useState([]);
  const [changeFilterVisibility, setChangeFilterVisibility] = useState(true);
  const [hasCart, setHasCart] = useState(false);
  const [openModalOrder, setOpenModalOrder] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [tabToRender, setTabToRender] = useState('');
  const [partnerProfileData, setPartnerProfileData] = useState({});
  const [onePartnerAtATime, setOnePartnerAtATime] = useState({});
  const [moveNextView, setMoveNextView] = useState(false);

  const [homeActivity, setHomeActivity] = useState(false);

  const [indexToRender, setIndexToRender] = useState(0);
  const [partnerToRender, setPartnerToRender] = useState(0);

  const [isMounted, setIsmounted] = useState(false);

  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [videoPreviewData, setVideoPreviewData] = useState({});

  const clientId = user.user._id;
  const socket = io(URL);

  const [introModal, setIntroModal] = useState(false);
  const [token1, setToken] = useState();
  //
  // const configure = () => {
  //   PushNotification.configure({
  //     // user accepted notification permission - register token
  //     onRegister: function(tokenData) {
  //       const {token} = tokenData;
  //       // handle device token
  //       // send token to server...
  //       appAction.updateDeviceToken(user.user._id, token);
  //     },
  //     // notification received / opened in-app event
  //     onNotification: function(notification) {
  //       notification.finish(PushNotificationIOS.FetchResult.NoData);
  //     },
  //     // outlining what permissions to accept
  //     permissions: {
  //       alert: true,
  //       badge: true,
  //       sound: true,
  //     },
  //     popInitialNotification: true,
  //     requestPermissions: true,
  //   });
  // };
  //
  // useEffect(() => {
  //   configure();
  // }, []);

  useEffect(() => {
    const validateIntroModal = async () => {
      const userData = await AsyncStorage.getItem('@userData');
      const data = await JSON.parse(userData);
      if (!data.user.hasViewedIntroModal) {
        setIntroModal(true);
      } else {
        setIntroModal(false);
      }
    };
    validateIntroModal();
  }, []);

  useEffect(() => {
    const getCartCount = async () => {
      const response = await appAction.getCartCount(clientId);
      if (response.status) {
        setHasCart(response.status);
      }
    };
    getCartCount();
  });

  useEffect(() => {
    const getAppointmentCount = async () => {
      const response = await appAction.getAppointmentCount(clientId);
      if (response.status) {
        setHasAppointment(response.status);
      }
    };
    getAppointmentCount();
  });

  const loadPartner = async () => {
    const userData = await AsyncStorage.getItem('@userData');
    const parseUserData = userData !== null && (await JSON.parse(userData));
    //  console.log(parseUserData.user.search);
    if (parseUserData.user.search === 'all') {
      //get all profesionals
      setHomeActivity(true);
      const response = await appAction.loadAllPartners();
      //  console.log(response.partners[0]);
      setOnePartnerAtATime(response.partners[0]);
      setPartnerData(response.partners);
      setHomeActivity(false);
    } else {
      //ger professionals pased on search craterial
      setHomeActivity(true);
      const response = await appAction.loadCustomSearch(user.user._id);
      setOnePartnerAtATime(response.partners[0]);
      setPartnerData(response.partners);
      setHomeActivity(false);
    }

    //  console.log();
  };
  useEffect(() => {
    loadPartner();
  }, []);

  //componentDidUnmount
  useEffect(() => {
    setIsmounted(true);
  }, [isMounted]);

  useEffect(() => {
    return () => {
      setIsmounted(false);
      console.log('unmounted');
    };
  }, []);

  useEffect(() => {
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          //console.log('Initial url is: ' + url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
    Linking.addEventListener('url', _handleOpenURL);

    return () => {
      Linking.removeEventListener('url', _handleOpenURL);
    };
  }, []);

  function _handleOpenURL(event) {
    const route = event.url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^\/]+)\/?$/);
    const routeName = route.split('/');
    if (routeName.length !== 0) {
      if (routeName[0] === 'appointment_checkin') {
        setOpenAppointmentModal(true);
      }
    }
  }

  return (
    <View style={styles.screen}>
      <RefreshNetworkError navigation={props.navigation} />

      <Overlay
        isVisible={introModal}
        windowBackgroundColor="rgba(255, 255, 255, .5)"
        height="90%"
        width="95%">
        <ScrollView>
          <View style={{padding: 10, flex: 1}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                marginTop: 10,
                fontSize: 22,
              }}>
              Welcome, {user.user.name}
            </Text>
            <View
              style={{
                borderBottomWidth: 1,
                marginTop: 10,
                marginBottom: 5,
                borderColor: '#e0e0e0',
              }}
            />
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 15}}>
              Thanks for signing up to iBeautyConnect. iBeautyConnect is the one
              stop marketplace for{' '}
              <Text style={{fontFamily: Fonts.poppins_bold}}>Licensed</Text>{' '}
              Health and Beauty servcies. All professionals on the platform have
              been{' '}
              <Text style={{fontFamily: Fonts.poppins_bold}}>thoroughly </Text>
              reviewed and are{' '}
              <Text style={{fontFamily: Fonts.poppins_bold}}>Licensed. </Text>
            </Text>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                marginTop: 10,
                fontSize: 16,
              }}>
              Basic Usage
            </Text>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
              }}>
              - Use the{' '}
              <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 15}}>
                X
              </Text>{' '}
              button located at the bottom left corner of your screen to move
              from one beauty professional to the next.
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
              }}>
              - You can use the{' '}
              <Text style={{fontFamily: Fonts.poppins_bold}}>filter icon</Text>{' '}
              located at the bottom right corner of your screen to filter by
              location and profession.
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
              }}>
              -{' '}
              <Text style={{fontFamily: Fonts.poppins_bold}}>
                Availability:{' '}
              </Text>{' '}
              iBeautyConnect believes in real time avalibility and not an
              avalibility based on an automated work time interval. We
              understand our profesionals have other clients outside of
              iBeautyConnect. To solve this problem, iBeautyConnect offers a
              real-time messaging functionality that allows you to ask for a
              profesionals avalibility in real time. This message is sent to
              them as an in-app message and as an SMS.
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
              }}>
              - For any complaints, you can reach us through support located in
              settings.
            </Text>
          </View>
          <ButtonComponent
            moreStyles={{
              width: '100%',
              height: 70,
              padding: 20,
              marginBottom: 50,
              backgroundColor: Colors.purple_darken,
            }}
            buttonTextStyle={{color: '#fff'}}
            title="Done"
            onButtonPress={async () => {
              appAction.updateHasViewdIntro(user.user._id);
              const userData = await AsyncStorage.getItem('@userData');
              const parseUserData =
                userData !== null && (await JSON.parse(userData));
              parseUserData.user.hasViewedIntroModal = true;
              console.log(parseUserData.user.hasViewedIntroModal);
              await AsyncStorage.setItem(
                '@userData',
                JSON.stringify(parseUserData),
              );
              setIntroModal(false);
            }}
          />
        </ScrollView>
      </Overlay>
      <Partners
        partnerData={partnerData}
        setOpenModal={setOpenModal}
        setPartnerProfileData={setPartnerProfileData}
        onePartnerAtATime={onePartnerAtATime}
        setOnePartnerAtATime={setOnePartnerAtATime}
        homeActivity={homeActivity}
        setHomeActivity={setHomeActivity}
        loadPartner={loadPartner}
        setOpenFilterModal={setOpenFilterModal}
        indexToRender={indexToRender}
        setIndexToRender={setIndexToRender}
        partnerToRender={partnerToRender}
        setPartnerToRender={setPartnerToRender}
        setPreviewData={setPreviewData}
        setPreviewModal={setPreviewModal}
        setMoveNextView={setMoveNextView}
        openPreviewModal={openPreviewModal}
        setOpenPreviewModal={setOpenPreviewModal}
        videoPreviewData={videoPreviewData}
        setVideoPreviewData={setVideoPreviewData}
      />

      {openModal && (
        <PartnerAccountModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          partnerProfileData={partnerProfileData}
          setPartnerProfileData={setPartnerProfileData}
          setOpenModal={setOpenModal}
          openModal={openModal}
          setPartnerProfileData={setPartnerProfileData}
          partnerProfileData={partnerProfileData}
          navigation={props.navigation}
          setHasCart={setHasCart}
          setOpenModalOrder={setOpenModalOrder}
          tabToRender={tabToRender}
        />
      )}

      {openModalOrder && (
        <Orders
          setOpenModalOrder={setOpenModalOrder}
          openModalOrder={openModalOrder}
          clientId={user.user._id}
          setHasCart={setHasCart}
          stripeId={user.user.stripeId}
          setHasAppointment={setHasAppointment}
          setPartnerProfileData_services={setPartnerProfileData}
          setOpenModal={setOpenModal}
          setTabToRender={setTabToRender}
        />
      )}

      {openAppointmentModal && (
        <Appointment
          setOpenAppointmentModal={setOpenAppointmentModal}
          openAppointmentModal={openAppointmentModal}
          setHasAppointment={setHasAppointment}
        />
      )}
      <Filter
        setPartnerData={setPartnerData}
        setOpenFilterModal={setOpenFilterModal}
        openFilterModal={openFilterModal}
        setOnePartnerAtATime={setOnePartnerAtATime}
        setIndexToRender={setIndexToRender}
        setPartnerToRender={setPartnerToRender}
      />

      <AppFooter
        navigation={props.navigation}
        activeTab={activeTab}
        hasCart={hasCart}
        setOpenModalOrder={setOpenModalOrder}
        setOpenAppointmentModal={setOpenAppointmentModal}
        hasAppointment={hasAppointment}
        setHasAppointment={setHasAppointment}
        setHasCart={setHasCart}
      />
      <ImageView
        images={previewData}
        imageIndex={0}
        isVisible={previewModal}
        onClose={() => setPreviewModal(false)}
        glideAlways
        animationType="fade"
      />
      {moveNextView && (
        <Animated.View
          style={{
            backgroundColor: '#fff',
            position: 'absolute',
            zIndex: 1,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            opacity: 0.5,
          }}>
          <Image
            source={require('../assets/loading.gif')}
            resizeMode="contain"
            style={{height: 300, width: 300}}
          />
        </Animated.View>
      )}
      <VideoPreview
        openPreviewModal={openPreviewModal}
        setOpenPreviewModal={setOpenPreviewModal}
        videoPreviewData={videoPreviewData}
      />
    </View>
  );
};

//
//
// <View
//   style={{
//     position: 'absolute',
//     width: '100%',
//     zIndex: 1,
//     alignItems: 'flex-end',
//     paddingHorizontal: 20,
//   }}>
//   <SafeAreaView>
//     <TouchableWithoutFeedback
//       onPress={() => {
//         ReactNativeHapticFeedback.trigger('impactLight', {
//           enableVibrateFallback: true,
//           ignoreAndroidSystemSettings: false,
//         });
//         setOpenFilterModal(true);
//       }}>
//       <Text
//         style={{
//           color: Colors.grey_darken,
//           alignSelf: 'center',
//           fontFamily: Fonts.poppins_regular,
//           fontSize: 15,
//           display: changeFilterVisibility ? 'flex' : 'none',
//           marginTop: 10,
//         }}>
//         Change filter
//       </Text>
//     </TouchableWithoutFeedback>
//   </SafeAreaView>
// </View>

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
