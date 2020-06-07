import React from 'react';

import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import AuthScreen from '../screens/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';
import MessageScreen from '../screens/MessageScreen';
import ConversationScreen from '../screens/ConversationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PaymentScreen from '../screens/PaymentScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import CancelledOrdersScreen from '../screens/CancelledOrdersScreen';
import SupportScreen from '../screens/SupportScreen';
import SupportConversationScreen from '../screens/SupportConversationScreen';
import WebViewScreen from '../screens/WebViewScreen';

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {headerMode: 'none'},
);

const TabScreens = createBottomTabNavigator({
  Home: {screen: HomeScreen, navigationOptions: {tabBarVisible: false}},
  Message: {screen: MessageScreen, navigationOptions: {tabBarVisible: false}},
  Profile: {screen: ProfileScreen, navigationOptions: {tabBarVisible: false}},
});

const AppNavigator = createStackNavigator(
  {
    Tabs: TabScreens,
    Conversations: ConversationScreen,
    WebViewScreen: WebViewScreen,
    Payment: PaymentScreen,
    OrderHistory: OrderHistoryScreen,
    CancelledOrders: CancelledOrdersScreen,
    Support: SupportScreen,
    SupportConversation: SupportConversationScreen,
  },
  {headerMode: 'none'},
);

const MainNavigator = createSwitchNavigator({
  StartUpScreen: StartUpScreen,
  Auth: AuthNavigator,
  App: AppNavigator,
});

export default createAppContainer(MainNavigator);
