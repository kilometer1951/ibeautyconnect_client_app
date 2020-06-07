import {
  STATES,
  CITIES,
  PROFESSIONS,
  ORDERHISTORYITEMSDATA,
  CANCELLEDORDERS,
  FETCH_APPOITMENTS,
  QUERY_APPOITMENTS,
  CHECK_IN,
  CANCEL_APPOITMENT,
  LOAD_SUPPORT_MESSAGES,
  MESSAGES,
} from '../actions/appAction';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  states: [],
  cities: [],
  professions: [],
  orderHistoryData: [],
  cancelledOrders: [],
  appointments: [],
  supportMessages: [],
  messages: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case STATES:
      return {
        ...state,
        states: action.states,
      };
    case CITIES:
      return {
        ...state,
        cities: action.cities,
      };
    case PROFESSIONS:
      return {
        ...state,
        professions: action.professions,
      };
    case ORDERHISTORYITEMSDATA:
      return {
        ...state,
        orderHistoryData: action.orderHistoryData,
      };
    case CANCELLEDORDERS:
      return {
        ...state,
        cancelledOrders: action.cancelledOrders,
      };
    case FETCH_APPOITMENTS:
      return {
        ...state,
        appointments: action.appointments,
      };
    case QUERY_APPOITMENTS:
      return {
        ...state,
        appointments: action.appointments,
      };
    case CHECK_IN:
      const removeAppointment = state.appointments.filter(
        value => value._id !== action.cartId,
      );
      return {
        ...state,
        appointments: removeAppointment,
      };
    case CANCEL_APPOITMENT:
      const newAppoitment = state.appointments.filter(
        value => value._id !== action.cartId,
      );
      return {
        ...state,
        appointments: newAppoitment,
      };
    case LOAD_SUPPORT_MESSAGES:
      return {
        ...state,
        supportMessages: action.allSupportMessages,
      };
    case MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    default:
      return state;
  }
  return state;
};
