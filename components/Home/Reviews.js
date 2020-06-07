import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const Reviews = props => {
  const {
    partnerReview,
    partnerProfileData,
    activityReviews,
    totalRating,
  } = props;

  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: '#e0e0e0',
        paddingTop: 15,
      }}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: item.client[0].profilePhoto}}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View
        style={{
          marginLeft: 5,
          width: '100%',
        }}>
        <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
          {item.client[0].name}
        </Text>

        <View style={{width: 100}}>
          <StarRating
            key={item._id}
            disabled={false}
            maxStars={5}
            rating={item.rateNumber}
            disabled={true}
            starSize={18}
            fullStarColor={Colors.purple_darken}
          />
        </View>
        <View style={{width: '100%'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              width: '80%',
            }}>
            {item.comment}
          </Text>
        </View>
      </View>
    </View>
  );

  let view;
  if (partnerReview.length === 0) {
    view = (
      <View style={{flex: 1, alignItems: 'center', marginTop: '50%'}}>
        <Icon name="md-star" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
          }}>
          {partnerProfileData.fName} has no reviews yet.
        </Text>
      </View>
    );
  } else {
    view = (
      <View style={{flex: 1}}>
        <View style={{padding: 10, flexDirection: 'row', display: 'none'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 20,
              marginRight: 5,
            }}>
            {totalRating}
          </Text>
          <Icon name="md-star" size={25} color={Colors.purple_darken} />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={partnerReview}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          extraData={partnerReview}
        />
      </View>
    );
  }

  return <View style={styles.screen}>{view}</View>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Reviews;
