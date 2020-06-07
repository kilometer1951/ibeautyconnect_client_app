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
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {MaterialIndicator} from 'react-native-indicators';
import SupportModal from '../components/SupportModal';

import * as appAction from '../store/actions/appAction';
import {URL} from '../socketURL';

import io from 'socket.io-client';
import {YellowBox} from 'react-native';

const SupportScreen = (props) => {
  const socket = io(URL);

  const user = useSelector((state) => state.authReducer.user);
  const supportMessages = useSelector(
    (state) => state.appReducer.supportMessages,
  );

  const dispatch = useDispatch();

  const [activity, setActivity] = useState(false);
  const [supportModal, setSupportModal] = useState(false);

  useEffect(() => {
    const loadSupportMessages = async () => {
      setActivity(true);
      await dispatch(appAction.loadSupportMessages(user.user._id));
      setActivity(false);
    };
    loadSupportMessages();
  }, []);

  useEffect(() => {
    socket.on('newSupportMessage', async function (messageData) {
      if (messageData.from_ == user.user._id) {
        const loadSupportMessages = async () => {
          await dispatch(appAction.loadSupportMessages(user.user._id));
        };
        loadSupportMessages();
      }
    });
  }, []);

  const openConversation = (supportMessageId, clientId, category) => {
    props.navigation.navigate('SupportConversation', {
      supportMessageId,
      clientId,
      category,
    });
  };

  const supportView = supportMessages.map((supportMessage) => {
    return (
      <TouchableWithoutFeedback
        key={supportMessage._id}
        onPress={openConversation.bind(
          this,
          supportMessage._id,
          supportMessage.client,
          supportMessage.category,
        )}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}
          key={supportMessage._id}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '80%',
            }}>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 17}}>
              {supportMessage.category}
            </Text>
            <View
              style={{
                backgroundColor: Colors.green,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 17,
                }}>
                {supportMessage.ticketStatus}
              </Text>
            </View>
          </View>

          <Icon name="ios-arrow-forward" size={30} color="#9e9e9e" />
        </View>
      </TouchableWithoutFeedback>
    );
  });

  let view;
  if (supportMessages.length === 0) {
    view = (
      <View
        style={{
          marginTop: '50%',
          alignItems: 'center',
          flex: 1,
        }}>
        <Icon name="ios-headset" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
          }}>
          No support messages yet
        </Text>
      </View>
    );
  } else {
    view = <ScrollView>{supportView}</ScrollView>;
  }

  return (
    <View style={styles.screen}>
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
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 19}}>
                Support Center
              </Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                setSupportModal(true);
              }}>
              <View
                style={{
                  marginHorizontal: 20,
                  height: 30,
                  width: 30,
                  paddingTop: 4,
                  alignItems: 'center',
                }}>
                <Icon name="md-add" size={20} color={Colors.pink} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.container}>
        {activity ? (
          <MaterialIndicator
            color={Colors.purple_darken}
            style={{marginTop: 30}}
          />
        ) : (
          view
        )}
      </View>
      <SupportModal
        supportModal={supportModal}
        setSupportModal={setSupportModal}
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
    width: '100%',
    height: '11%',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  container: {
    paddingHorizontal: 10,
    marginTop: 20,
    flex: 1,
  },
});

export default SupportScreen;
