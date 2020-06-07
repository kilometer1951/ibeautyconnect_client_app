import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Linking,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Moment from 'moment';
import {MaterialIndicator} from 'react-native-indicators';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import CalendarStrip from 'react-native-calendar-strip';

import * as appAction from '../store/actions/appAction';
import ModalHeader from '../components/ModalHeader';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ButtonComponent from '../components/ButtonComponent';
import CheckIn from '../components/Appoitments/CheckIn';
import ReSchedule from '../components/Appoitments/ReSchedule';
import CancelAppoitment from '../components/Appoitments/CancelAppoitment';
import Icon from 'react-native-vector-icons/Ionicons';

import SupportModal from '../components/SupportModal';

import {URL} from '../socketURL';

import io from 'socket.io-client';
import {YellowBox} from 'react-native';

const AppointmentScreen = props => {
  const socket = io(URL);
  const dispatch = useDispatch();
  const appointments = useSelector(state => state.appReducer.appointments);

  const user = useSelector(state => state.authReducer.user);
  const [today, setToday] = useState(new Date());
  const [checkInData, setCheckInData] = useState({});
  const [reScheduleModalData, setReScheduleModalData] = useState({});
  const [cancelAppoitmentData, setCancelAppoitmentData] = useState({});
  const [openCheckInModal, setOpenCheckInModal] = useState(false);
  const [openReScheduleModal, setOpenReScheduleModal] = useState(false);
  const [openCancelAppoitmentModal, setOpenCancelAppoitmentModal] = useState(
    false,
  );
  const [activity, setActivity] = useState(false);
  const [supportModal, setSupportModal] = useState(false);

  const [isMounted, setIsmounted] = useState(false);

  const {
    openAppointmentModal,
    setOpenAppointmentModal,
    setHasAppointment,
    setOpenModalAppointment,
  } = props;

  //agenda initialization
  let customDatesStyles = [];
  let markedDates = [];
  let startDate = Moment();
  for (let i = 0; i < appointments.length; i++) {
    let _date = appointments[i].booking_date;
    // customDatesStyles.push({
    //   startDate: _date, // Single date since no endDate provided
    //   dateNameStyle: {color: 'blue'},
    //   dateNumberStyle: {color: 'purple'},
    //   // Random color...
    //   dateContainerStyle: {
    //     backgroundColor: `#${`#00000${(
    //       (Math.random() * (1 << 24)) |
    //       0
    //     ).toString(16)}`.slice(-6)}`,
    //   },
    // });
    markedDates.push({
      date: _date,
      dots: [
        {
          key: i,
          color: '#fff',
          selectedDotColor: '#fff',
        },
      ],
    });
  }

  useEffect(() => {
    setIsmounted(true);
    console.log('Mounted');
    return () => {
      console.log('Unmounted');
      setIsmounted(false);
    };
  }, []);

  //get Appoitments
  const getAppointmentOnOpen = async () => {
    await dispatch(appAction.getAppointment(user.user._id));
  };

  useEffect(() => {
    socket.on('noShow', async function(noShowAppoitmentData) {
      if (isMounted) {
        if (noShowAppoitmentData.clientId == user.user._id) {
          getAppointmentOnOpen();
        }
      }
    });
  }, []);

  useEffect(() => {
    socket.on('reSchedule', async function(reScheduleData) {
      if (isMounted) {
        if (
          reScheduleData.reScheduleData.reScheduleData.clientId == user.user._id
        ) {
          getAppointmentOnOpen();
        }
      }
    });
  }, []);

  useEffect(() => {
    const getAppointment = async () => {
      setActivity(true);
      await dispatch(appAction.getAppointment(user.user._id));
      setActivity(false);
    };
    getAppointment();
  }, []);

  const onClose = () => {
    setOpenAppointmentModal(false);
    // if (allCart.length === 0) {
    //   setHasCart(false);
    // }
  };

  const handleCheckInModal = async (
    cartId,
    partner_stripe_id,
    partnerId,
    partnerPhone,
    stripe_charge_id,
    total,
    booking_date,
    booking_time,
  ) => {
    //openModal
    setCheckInData({
      cartId,
      partner_stripe_id,
      partnerId,
      partnerPhone,
      stripe_charge_id,
      today,
      total,
      booking_date,
      booking_time,
      clientId: user.user._id,
    });
    setOpenCheckInModal(true);
  };

  const openReScheduleModalHandler = (
    cartId,
    partnerId,
    partnerPhone,
    booking_date,
    booking_time,
    partner_name,
  ) => {
    setReScheduleModalData({
      cartId,
      partnerId,
      partnerPhone,
      booking_date,
      booking_time,
      client_name: user.user.name,
      client_phone: user.user.phone,
      partner_name,
      clientId: user.user._id,
    });
    setOpenReScheduleModal(true);
  };

  const handleCancelModal = (
    cartId,
    partner_stripe_id,
    partnerId,
    partnerPhone,
    stripe_charge_id,
    total,
    booking_date,
    booking_time,
  ) => {
    setCancelAppoitmentData({
      clientId: user.user._id,
      cartId,
      partner_stripe_id,
      partnerId,
      partnerPhone,
      stripe_charge_id,
      total,
      booking_date,
      booking_time,
    });
    setOpenCancelAppoitmentModal(true);
  };

  const queryAgendaByDate = async date => {
    let newDate = Moment(date).format('YYYY-MM-DD');
    let dateTime = new Date(newDate + '' + 'T05:00:00.000Z');
    setActivity(true);
    await dispatch(appAction.queryAgendaByDate(user.user._id, dateTime));
    setActivity(false);
  };

  const displayName = (str, idx, array) => {
    if (str !== '') {
      if (idx === array.length - 1) {
        return str;
      }

      return str + ',';
    } else {
      return str;
    }
  };

  const services = items => {
    return items.map((result, index, array) => {
      return (
        <Text
          key={index}
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 17,

            marginRight: 5,
            color: '#9e9e9e',
          }}>
          {displayName(result.services.serviceName, index, array)}
        </Text>
      );
    });
  };

  let view;

  if (appointments.length === 0) {
    view = (
      <View
        style={{
          marginTop: '50%',
          alignItems: 'center',
          flex: 1,
        }}>
        <Icon name="ios-calendar" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
          }}>
          You have no appointments
        </Text>
      </View>
    );
  } else {
    view = (
      <FlatList
        data={appointments}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                alignItems: 'center',
                width: '15%',
                marginTop: '10%',
                paddingRight: 10,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                  color: '#9e9e9e',
                }}>
                {Moment(item.booking_date).format('D')}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                  color: '#9e9e9e',
                }}>
                {Moment(item.booking_date).format('MMM')}
              </Text>
            </View>
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentBody}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 17,
                      marginBottom: 7,
                    }}>
                    {item.booking_time}
                  </Text>

                  <View
                    style={{
                      backgroundColor:
                        Moment(today).format('MM/DD/YYYY') ==
                        Moment(item.booking_date).format('MM/DD/YYYY')
                          ? Colors.pink
                          : Colors.blue,
                      width: 40,
                      alignItems: 'center',
                      borderRadius: 50,
                      height: 40,
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_regular,
                        fontSize: 20,
                        color: '#fff',
                        marginTop: 5,
                      }}>
                      {Moment(today).format('MM/DD/YYYY') ==
                      Moment(item.booking_date).format('MM/DD/YYYY')
                        ? 'T'
                        : 'UC'}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 17,
                    marginBottom: 7,
                  }}>
                  {item.partner.fName +
                    ' ' +
                    item.partner.lName +
                    ', ' +
                    item.partner.profession}
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {services(item.items)}
                </ScrollView>
                <TouchableWithoutFeedback
                  onPress={() => {
                    //  console.log(item.partner.locationLng);
                    Linking.openURL(
                      `https://maps.apple.com/?daddr=${
                        item.partner.locationLat
                      },${item.partner.locationLng}`,
                    );
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 15,
                      textDecorationLine: 'underline',
                      color: '#9e9e9e',
                    }}>
                    {item.partner.address +
                      ', ' +
                      item.partner.locationCity +
                      ', ' +
                      item.partner.locationState +
                      ', ' +
                      item.partner.postal_code}
                  </Text>
                </TouchableWithoutFeedback>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableWithoutFeedback
                    onPress={handleCheckInModal.bind(
                      this,
                      item._id,
                      item.partner.stripeAccountId,
                      item.partner._id,
                      item.partner.phone,
                      item.stripe_charge_id,
                      item.total,
                      item.booking_date,
                      item.booking_time,
                    )}>
                    <View style={styles.button}>
                      <Icon
                        name="md-checkmark"
                        size={20}
                        style={{marginRight: 10}}
                        color={Colors.green}
                      />
                      <Text>Check in</Text>
                    </View>
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback
                    onPress={openReScheduleModalHandler.bind(
                      this,
                      item._id,
                      item.partner._id,
                      item.partner.phone,
                      item.booking_date,
                      item.booking_time,
                      item.partner.fName,
                    )}>
                    <View style={styles.button}>
                      <Icon
                        name="md-calendar"
                        size={20}
                        style={{marginRight: 10}}
                        color={Colors.pink}
                      />
                      <Text>Reschedule</Text>
                    </View>
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback
                    onPress={handleCancelModal.bind(
                      this,
                      item._id,
                      item.partner.stripeAccountId,
                      item.partner._id,
                      item.partner.phone,
                      item.stripe_charge_id,
                      item.total,
                      item.booking_date,
                      item.booking_time,
                    )}>
                    <View style={styles.button}>
                      <Icon
                        name="md-close"
                        size={20}
                        style={{marginRight: 10, marginLeft: 20}}
                        color={Colors.purple_darken}
                      />
                      <Text>Cancel</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={item => item._id}
      />
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={openAppointmentModal}>
      <View style={{flex: 1}}>
        <View
          style={{
            backgroundColor: Colors.blue,
            height: 20,
            padding: 20,
            zIndex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
              setOpenAppointmentModal(false);
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                paddingTop: 4,
                marginTop: 30,
              }}>
              <Icon name="md-close" size={20} color="white" />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setSupportModal(true)}>
            <View
              style={{
                height: 30,
                width: 30,
                paddingTop: 4,
                marginTop: 30,
                alignItems: 'center',
              }}>
              <Icon
                name="md-help"
                size={20}
                color="white"
                style={{marginLeft: 10}}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <CalendarStrip
          startingDate={new Date()}
          selectedDate={'2021-11-20'}
          calendarAnimation={{type: 'sequence', duration: 30}}
          daySelectionAnimation={{
            type: 'border',
            duration: 200,
            borderWidth: 1,
            borderHighlightColor: '#fff',
            highlightColor: '#9265DC',
          }}
          calendarHeaderContainerStyle={{marginBottom: 20}}
          style={{height: 130, paddingTop: 10, paddingBottom: 10}}
          calendarHeaderStyle={{color: 'white'}}
          calendarColor={Colors.blue}
          dateNumberStyle={{color: 'white'}}
          dateNameStyle={{color: 'white'}}
          iconContainer={{flex: 0.1}}
          markedDates={markedDates}
          onDateSelected={queryAgendaByDate}
          calendarHeaderStyle={{
            color: 'white',
            fontFamily: Fonts.poppins_regular,
          }}
          highlightDateNameStyle={{
            color: 'white',
          }}
          highlightDateNumberStyle={{
            color: 'white',
          }}
          leftSelector={<Icon name="ios-arrow-back" size={40} color="#fff" />}
          rightSelector={
            <Icon name="ios-arrow-forward" size={40} color="#fff" />
          }
        />

        {activity ? (
          <MaterialIndicator
            color={Colors.purple_darken}
            style={{marginTop: 30}}
          />
        ) : (
          <View
            style={{
              flex: 1,
              width: '100%',
              paddingHorizontal: 10,
            }}>
            {view}
          </View>
        )}

        <CheckIn
          checkInData={checkInData}
          openCheckInModal={openCheckInModal}
          setOpenCheckInModal={setOpenCheckInModal}
          appointments={appointments}
          setHasAppointment={setHasAppointment}
        />

        <ReSchedule
          setOpenReScheduleModal={setOpenReScheduleModal}
          openReScheduleModal={openReScheduleModal}
          reScheduleData={reScheduleModalData}
          setReScheduleData={setReScheduleModalData}
          getAppointmentOnOpen={getAppointmentOnOpen}
        />

        <CancelAppoitment
          cancelAppoitmentData={cancelAppoitmentData}
          setCancelAppoitmentData={setCancelAppoitmentData}
          openCancelAppoitmentModal={openCancelAppoitmentModal}
          setOpenCancelAppoitmentModal={setOpenCancelAppoitmentModal}
          appointments={appointments}
          setHasAppointment={setHasAppointment}
        />
      </View>

      <SupportModal
        supportModal={supportModal}
        setSupportModal={setSupportModal}
      />
    </Modal>
  );
};

//
// <View
//   style={{
//     ...styles.appointmentHeader,
//     backgroundColor:
//       Moment(today).format('MM/DD/YYYY') ==
//       Moment(item.booking_date).format('MM/DD/YYYY')
//         ? 'red'
//         : Colors.salmon,
//   }}>
//   <Text>{Moment(item.booking_date).format('MMM, D YYYY')}</Text>
// </View>

const styles = StyleSheet.create({
  appointmentCard: {
    alignSelf: 'center',
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    marginHorizontal: 10,
    elevation:5
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 10,
  },

  appointmentBody: {
    padding: 10,
  },
  button: {
    width: '30%',
    padding: 5,
    flexDirection: 'row',
    marginTop: 5,
  },
});

export default AppointmentScreen;
