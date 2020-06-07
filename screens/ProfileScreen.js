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
  Linking,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import AppFooter from '../components/AppFooter';
import * as appAction from '../store/actions/appAction';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import RefreshNetworkError from '../components/RefreshNetworkError';

import PartnerAccountModal from '../modal/PartnerAccountModal';

import Orders from '../modal/Orders';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Appointment from '../modal/Appointment';
import ProfilePicker from '../components/Profile/ProfilePicker';
import io from 'socket.io-client';
import {URL} from '../socketURL';
import Loader from '../components/Loader';

const ProfileScreen = (props) => {
  const socket = io(URL);

  const user = useSelector((state) => state.authReducer.user);
  const [openModalOrder, setOpenModalOrder] = useState(false);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [hasCart, setHasCart] = useState(false);
  const [messages, setMessages] = useState([]);
  const [partnerProfileData, setPartnerProfileData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [tabToRender, setTabToRender] = useState('');
  const [today, setToday] = useState(new Date());
  const [image, setImage] = useState({});
  const [imagePicker, setImagePicker] = useState({uri: user.user.profilePhoto});
  const [openPickerModal, setOpenPickerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Uploading please wait');
  const clientId = user.user._id;
  const [points, setPoints] = useState();

  useEffect(() => {
    const getCartCount = async () => {
      const response = await appAction.getCartCount(clientId);
      if (response.status) {
        setHasCart(response.status);
      }
    };
    getCartCount();
  }, []);

  useEffect(() => {
    const getAppointmentCount = async () => {
      const response = await appAction.getAppointmentCount(clientId);
      if (response.status) {
        setHasAppointment(response.status);
      }
    };
    getAppointmentCount();
  }, []);

  useEffect(() => {
    const getPoints = async () => {
      const response = await appAction.getPoints(clientId);
      setPoints(response.points);
    };
    getPoints();
  }, []);

  return (
    <View style={styles.screen}>
      <RefreshNetworkError navigation={props.navigation} />
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 30}}>
            Settings
          </Text>
        </View>
      </SafeAreaView>
      <ScrollView>
        <View style={{alignItems: 'center', marginTop: '10%'}}>
          <View style={styles.imageContainer}>
            <Image
              source={imagePicker}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View
            style={{
              position: 'absolute',
              marginTop: '40%',
              backgroundColor: '#fff',
              width: 120,
              height: 5,
              borderRadius: 150,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />

          <View
            style={{
              position: 'absolute',
              marginTop: '38%',
              width: '100%',
              height: 100,
              borderRadius: 150,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableWithoutFeedback onPress={() => setOpenPickerModal(true)}>
              <Icon name="md-create" size={30} style={{marginTop: 10}} />
            </TouchableWithoutFeedback>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 20,
              }}>
              {user.user.name}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: '13%',
            alignItems: 'center',
            marginBottom: 20,
            paddingHorizontal: 5,
            width: '90%',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              textAlign: 'center',
              flexWrap: 'wrap',
              flex: 1,
            }}>
            You are {1000 - points} points away from winning a free trip
          </Text>
        </View>
        <View style={styles.settingsContainer}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate('Payment')}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Payment
              </Text>
              <Icon name="md-card" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.settingsContainer2}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate('OrderHistory')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Order History
              </Text>
              <Icon name="md-cart" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.settingsContainer2}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate('CancelledOrders')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Cancellations
              </Text>
              <Icon name="md-close" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.settingsContainer2}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate('Support')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Support
              </Text>
              <Icon name="md-headset" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.settingsContainer2}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('WebViewScreen', {
                url: 'https://www.ibeautyconnect.com/privacy.html',
                title: 'privacy',
              });
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Data and Privacy
              </Text>
              <Icon name="ios-document" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.settingsContainer2}>
          <TouchableWithoutFeedback
            onPress={() =>
              props.navigation.navigate('WebViewScreen', {
                url: 'https://www.ibeautyconnect.com/terms.html',
                title: 'terms',
              })
            }>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Terms of Use
              </Text>
              <Icon name="md-document" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={[{...styles.settingsContainer2}, {marginBottom: 20}]}>
          <TouchableWithoutFeedback
            onPress={() => {
              AsyncStorage.clear();
              props.navigation.navigate('Auth');
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Sign out
              </Text>
              <Icon name="ios-log-out" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>

      {openModal && (
        <PartnerAccountModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          partnerProfileData={partnerProfileData}
          setPartnerProfileData={setPartnerProfileData}
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

      <ProfilePicker
        openPickerModal={openPickerModal}
        setOpenPickerModal={setOpenPickerModal}
        setImagePicker={setImagePicker}
        setImage={setImage}
        setIsLoading={setIsLoading}
        setLoadingMessage={setLoadingMessage}
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
        setImage={setImage}
      />
      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage={loadingMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: Colors.purple_darken,
  },
  image: {
    width: '100%',
    height: '100%',
    borderWidth: 5,
    borderRadius: 150,
    borderColor: '#fff',
  },
  settingsContainer: {
    marginHorizontal: 20,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: '#e0e0e0',
    flex: 1,
  },
  settingsContainer2: {
    marginHorizontal: 20,
    borderBottomWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: '#e0e0e0',
  },
});

export default ProfileScreen;
