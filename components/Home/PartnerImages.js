import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import ImageView from 'react-native-image-view';
import Icon from 'react-native-vector-icons/Ionicons';
import * as appAction from '../../store/actions/appAction';
import {MaterialIndicator} from 'react-native-indicators';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const ImageGallery = props => {
  const {imagesData, setImagesData, partnerProfileData, userId} = props;
  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  //  console.log(imagesData);

  const handleLoadMorePhotos = async () => {
    if (!endOfFile) {
      if (!isLoadingMoreData) {
        setIsLoadingMoreData(true);
        const response = await appAction.getImages(userId, page);
        setIsLoadingMoreData(false);
        //  console.log(response.images.length);
        if (!response.status) {
          console.log('error parsing server');
          return;
        }
        if (response.endOfFile) {
          setEndOfFile(true);
          return;
        }
        //  console.log(page);
        setPage(prev => (prev = prev + 1));
        await setImagesData(prev => [...prev, ...response.images]);
      }
    }
  };

  const handleRefreshPhoto = async () => {
    setIsRefreshing(true);
    setEndOfFile(false);
    setPage(2);
    const response = await appAction.getImages(userId, 1);
    if (!response.status) {
      //console.log('error parsing server');
      return;
    }
    //  console.log(response);
    setImagesData(response.images);
    setIsRefreshing(false);
  };

  const handleImagePreivew = path => {
    const img = [
      {
        source: {
          uri: path,
        },
      },
    ];
    setPreviewData(prev => [...img]);
    setPreviewModal(true);
  };

  const renderItem = ({item}) => (
    <View style={styles.imageGrid}>
      <TouchableWithoutFeedback
        onPress={handleImagePreivew.bind(this, item.path)}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: `${item.path}`}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  let images;
  if (imagesData.length === 0) {
    return (images = (
      <View
        style={{
          marginTop: '50%',
          flex: 1,
          width: '70%',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Icon name="md-images" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
            textAlign: 'center',
          }}>
          {partnerProfileData.fName} has not added any photos of their work
        </Text>
      </View>
    ));
  }
  images = (
    <FlatList
      refreshControl={
        <RefreshControl
          onRefresh={handleRefreshPhoto}
          refreshing={isRefreshing}
          title="Pull to refresh"
          tintColor={Colors.pink}
          titleColor={Colors.pink}
        />
      }
      data={imagesData}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      numColumns={3}
      extraData={imagesData}
      onEndReachedThreshold={0.5}
      initialNumToRender={20}
      style={{marginTop: 2}}
      onMomentumScrollBegin={() => {
        handleLoadMorePhotos();
      }}
      ListFooterComponent={
        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            alignSelf: 'center',
          }}>
          {isLoadingMoreData && (
            <MaterialIndicator color={Colors.purple_darken} size={30} />
          )}
          {endOfFile &&
            (imagesData.length > 16 && (
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  color: Colors.grey_darken,
                }}>
                No more images to load
              </Text>
            ))}
        </View>
      }
    />
  );
  return (
    <View style={{flex: 1}}>
      {images}
      <ImageView
        images={previewData}
        imageIndex={0}
        isVisible={previewModal}
        onClose={() => setPreviewModal(false)}
        glideAlways
        animationType="fade"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageGrid: {
    marginHorizontal: 1,
  },

  imageContainer: {
    width: 136,
    height: 136,
    marginBottom: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

//
// maxToRenderPerBatch={10}
// style={{flex: 1}}
// scrollEventThrottle={50}
// updateCellsBatchingPeriod={50}
// windowSize={21}

export default ImageGallery;
