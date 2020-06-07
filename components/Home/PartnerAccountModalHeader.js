import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import * as appAction from '../../store/actions/appAction';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';

const PartnerAccountModalHeader = props => {
  const {partnerProfileData} = props;
  const user = useSelector(state => state.authReducer.user);
  const [displayCard, setDidplayCard] = useState(
    partnerProfileData.liveRequest,
  );

  if (!displayCard) {
    setTimeout(() => {
      setDidplayCard(true);
    }, 10000);
  }

  return (
    <View>
      {!displayCard && (
        <View style={styles.card}>
          <Text style={{fontFamily: Fonts.poppins_bold, color: '#fff'}}>
            {partnerProfileData.fName} is available for future booking only. You
            can still send {partnerProfileData.fName} a message to confirm if
            your appointment can be scheduled.
          </Text>
        </View>
      )}

      <View style={styles.topHeader}>
        <View style={styles.leftHeader}>
          <View>
            <View
              style={{
                backgroundColor: partnerProfileData.liveRequest
                  ? '#00C851'
                  : '#9e9e9e',
                borderRadius: 55,
                width: 18,
                borderWidth: 1,
                borderColor: '#fff',
                position: 'absolute',
                height: 18,
                marginLeft: 79,
                marginTop: 10,
                zIndex: 1,
              }}
            />
            <View style={styles.imageContainer}>
              <Image
                source={{uri: partnerProfileData.profilePhoto}}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View style={styles.rightHeader}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.poppins_semibold,
              fontSize: 20,
            }}>
            @{partnerProfileData.fName + ' ' + partnerProfileData.lName}
          </Text>
          <Text style={styles.professionTagText}>
            Verified {'License ' + partnerProfileData.profession},{' '}
            {partnerProfileData.locationCity +
              ', ' +
              partnerProfileData.locationState}
          </Text>

          <ButtonComponent
            moreStyles={{
              width: '90%',
              marginTop: 5,
              padding: 12,
              borderRadius: 50,
            }}
            buttonTextStyle={{color: '#fff', fontSize: 14}}
            title="Message"
            onButtonPress={() => {
              props.setOpenMessageModal(true);
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  professionTagText: {
    fontFamily: Fonts.poppins_regular,
    paddingRight: 10,
    marginLeft: 5,
    fontSize: 15,
  },

  topHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: '100%',
  },

  leftHeader: {
    width: '30%',
    flexDirection: 'row',
  },
  rightHeader: {
    width: '70%',
  },
  card: {
    zIndex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.pink,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    backgroundColor: Colors.pink,
    elevation: 5,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default PartnerAccountModalHeader;
