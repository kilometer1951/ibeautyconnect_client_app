import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import WalkThrough from '../components/auth/WalkThrough';
import Signup from '../components/auth/Signup/SignupComponent';
import RefreshNetworkError from '../components/RefreshNetworkError';

const AuthScreen = (props) => {
  const [showAuthComponent, setShowAuthComponent] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false);

  // const navigate = url => {
  //   console.log(url);
  //   props.navigation.navigate('Intro');
  // };
  //
  // // useEffect(() => {
  // //
  // // }, []);

  const handleOpenURL = (event) => {
    navigate(event.url);
  };

  if (showAuthComponent) {
    return (
      <View style={styles.mainContainer}>
        <RefreshNetworkError navigation={props.navigation} />
        <Signup
          showAuthComponent={showAuthComponent}
          navigationProperties={props}
          activityIndicator={activityIndicator}
          setActivityIndicator={setActivityIndicator}
        />
      </View>
    );
  } else {
    return <WalkThrough setShowAuthComponent={setShowAuthComponent} />;
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AuthScreen;
