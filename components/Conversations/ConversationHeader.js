import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  Switch,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../contants/Colors';
import Fonts from '../../contants/Fonts';

import * as appAction from '../../store/actions/appAction';

const ConversationHeader = props => {
  const user = useSelector(state => state.authReducer.user);

  const dispatch = useDispatch();

  return (
    <View style={styles.header}>
      <SafeAreaView>
        <View>
          <View style={styles.headerContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                dispatch(appAction.getMessages(user.user._id));
                props.setPartnerProfileData({});
                props.navigation.navigate('Message');
              }}>
              <View style={{width: '20%', alignItems: 'center', marginTop: 9}}>
                <Icon
                  name="ios-arrow-back"
                  size={25}
                  color={Colors.midnight_blue}
                />
              </View>
            </TouchableWithoutFeedback>

            <View
              style={{
                marginTop: 8,
                width: '65%',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                }}>
                {props.partner_name}
              </Text>
            </View>
          </View>
          <View style={styles.bottomHeader}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  borderBottomWidth: 1,
                  width: '20%',
                  alignItems: 'center',
                  paddingBottom: 5,
                  borderColor: Colors.purple_darken,
                }}>
                <Text style={{fontFamily: Fonts.poppins_regular}}>Chats</Text>
              </View>
            </TouchableWithoutFeedback>
            {!props.isLoading && (
              <TouchableWithoutFeedback
                onPress={() => props.setOpenModal(true)}>
                <View
                  style={{
                    width: '20%',
                    alignItems: 'center',
                    paddingBottom: 5,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      color: '#9e9e9e',
                    }}>
                    My services
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '15%',
    top: 0,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  bottomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    borderColor: '#e0e0e0',
    borderBottomWidth: 1,
    marginTop: 30,
    backgroundColor: '#fff',
  },
});

export default ConversationHeader;
