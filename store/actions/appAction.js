import {URL} from '../../socketURL';

// import io from 'socket.io-client';
// const socket = io(URL);
//https://hidden-lowlands-41526.herokuapp.com
//http://localhost:5002
export const STATES = 'STATES';
export const CITIES = 'CITIES';
export const PROFESSIONS = 'PROFESSIONS';
export const ORDERHISTORYITEMSDATA = 'ORDERHISTORYITEMSDATA';
export const CANCELLEDORDERS = 'CANCELLEDORDERS';
export const FETCH_APPOITMENTS = 'FETCH_APPOITMENTS';
export const QUERY_APPOITMENTS = 'QUERY_APPOITMENTS';
export const CHECK_IN = 'CHECK_IN';
export const CANCEL_APPOITMENT = 'CANCEL_APPOITMENT';
export const LOAD_SUPPORT_MESSAGES = 'LOAD_SUPPORT_MESSAGES';
export const MESSAGES = 'MESSAGES';

export const updateDeviceToken = async (clientId, token) => {
  const response = await fetch(`${URL}/api/update_device_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId,
      token,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const updateEmail = async (stripeId, update_email) => {
  const response = await fetch(`${URL}/api/update_cutomer_stripe_email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      stripeId,
      update_email,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const loadAllPartners = async () => {
  const response = await fetch(`${URL}/api_client/loadAllPartners`);
  const resData = await response.json();
  return resData;
};

export const loadCustomSearch = async clientId => {
  const response = await fetch(
    `${URL}/api_client/loadCustomSearch/${clientId}`,
  );
  const resData = await response.json();
  return resData;
};

export const getImages = async (userId, page) => {
  const response = await fetch(`${URL}/api/images/${userId}?page=${page}`);
  const resData = await response.json();
  return resData;
};

export const getVideos = async (userId, page) => {
  const response = await fetch(`${URL}/api/videos/${userId}?page=${page}`);
  const resData = await response.json();
  return resData;
};

export const getReviews = async (partnerId, clientId) => {
  const response = await fetch(
    `${URL}/api/get_reviews/${clientId}/${partnerId}`,
  );
  const resData = await response.json();
  return resData;
};

export const getCartCount = async clientId => {
  const response = await fetch(`${URL}/api/cart_count/${clientId}`);
  const resData = await response.json();
  return resData;
};

export const getAppointmentCount = async clientId => {
  const response = await fetch(`${URL}/api/appointment_count/${clientId}`);
  const resData = await response.json();
  return resData;
};

export const checkCart = async (clientId, partnerId, serviceId) => {
  const response = await fetch(
    `${URL}/api/check_cart/${clientId}/${partnerId}/${serviceId}`,
  );
  const resData = await response.json();
  return resData;
};

export const getClientCards = async stripeId => {
  const response = await fetch(`${URL}/api/get_client_cards/${stripeId}`);
  const resData = await response.json();
  return resData;
};

export const getCart = async clientId => {
  const response = await fetch(`${URL}/api/cart_regular/${clientId}`);
  const resData = await response.json();
  return resData;
};

export const getOrderAgain = async (clientId, page) => {
  const response = await fetch(
    `${URL}/api/order_again/${clientId}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};

export const getOrderHistory = async (clientId, page) => {
  const response = await fetch(
    `${URL}/api/order_history/${clientId}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};

export const getCancelledOrders = async (clientId, page) => {
  const response = await fetch(
    `${URL}/api/cancelled_orders/${clientId}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};

export const getItemInCartPerClient = async cartId => {
  const response = await fetch(
    `${URL}/api/get_item_in_cart_per_client/${cartId}`,
  );
  const resData = await response.json();
  return resData;
};

export const addToCart = async (services, partnerId, clientId) => {
  const response = await fetch(`${URL}/api/add_to_cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      services,
      partnerId,
      clientId,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const reSchedule = async (reScheduleData, bookingDate, bookingTime) => {
  const response = await fetch(`${URL}/api/reSchedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reScheduleData,
      bookingDate,
      bookingTime,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const deleteCartItem = async (cartId, itemID) => {
  const response = await fetch(`${URL}/api/delete_cart_item`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cartId,
      itemID,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const addCard = async (clientId, tokenId) => {
  const response = await fetch(`${URL}/api/add_card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId,
      tokenId,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const chargeCard = async chargeCardData => {
  const response = await fetch(`${URL}/api/charge_card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chargeCardData,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const chargeCardOneTime = async chargeCardData => {
  const response = await fetch(`${URL}/api/charge_card_one_time_payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chargeCardData,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const checkInLocation = async (location, cartId) => {
  const response = await fetch(`${URL}/api/check_in_location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cartId,
      location,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const updateCartCheckIn = checkInData => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/update_cart_check_in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkInData,
      }),
    });
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({type: CHECK_IN, cartId: checkInData.cartId});
  };
};

export const getMessages = clientId => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/messages/${clientId}`);
    const resData = await response.json();
    dispatch({type: MESSAGES, messages: resData.messages});
  };
};

export const getConversations = async messageId => {
  const response = await fetch(`${URL}/api/conversations/${messageId}`);
  const resData = await response.json();
  return resData;
};

export const getSupportConversations = async supportMessageId => {
  const response = await fetch(
    `${URL}/api/get_supportConvo/${supportMessageId}`,
  );
  const resData = await response.json();
  return resData;
};

export const getAppointment = clientId => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/appointments_client/${clientId}`);
    const resData = await response.json();
    dispatch({type: FETCH_APPOITMENTS, appointments: resData.appointments});
  };
};

export const queryAgendaByDate = (clientId, dateTime) => {
  return async dispatch => {
    const response = await fetch(
      `${URL}/api/query_agenda_by_date/${clientId}/${dateTime}`,
    );
    const resData = await response.json();
    dispatch({type: QUERY_APPOITMENTS, appointments: resData.appointments});
  };
};

export const handleCancelAppoitment = cancelAppoitmentData => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/cancel_appoitment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancelAppoitmentData,
      }),
    });
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({type: CANCEL_APPOITMENT, cartId: cancelAppoitmentData.cartId});
  };
};

export const addRating = async rateData => {
  const response = await fetch(`${URL}/api/add_rating`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rateData,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const getStates = () => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/states`);
    const resData = await response.json();
    dispatch({type: STATES, states: resData.states});
  };
};
export const getCities = searchByState => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/cities/${searchByState}`);
    const resData = await response.json();

    dispatch({type: CITIES, cities: resData.cities});
  };
};

export const getProfessions = () => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/profession`);
    const resData = await response.json();

    dispatch({type: PROFESSIONS, professions: resData.data});
  };
};

export const applyFilter = async (
  searchByCity,
  searchByState,
  searchByProfession,
  clientId,
) => {
  const response = await fetch(`${URL}/api/filter_professionals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      searchByCity,
      searchByState,
      searchByProfession,
      clientId,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const editPhoto = async (photo, clientId) => {
  let formData = new FormData();
  formData.append('photo', photo);
  const response = await fetch(`${URL}/api/edit_client_photo/${clientId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  const resData = await response.json();
  return resData;
};

export const getPoints = async clientId => {
  const response = await fetch(`${URL}/api/get_points/${clientId}`);
  const resData = await response.json();
  return resData;
};

export const newMessage = async messageData => {
  const response = await fetch(`${URL}/api/new_message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messageData,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const newSupportMessage = async messageData => {
  const response = await fetch(`${URL}/api/new_support_message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messageData,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const deleteCard = async deleteData => {
  const response = await fetch(`${URL}/api/delete_card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deleteData,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const setOrderHistoryItemsData = items => {
  return async dispatch => {
    dispatch({type: ORDERHISTORYITEMSDATA, orderHistoryData: items});
  };
};

export const setOrderCancelledItemsData = items => {
  return async dispatch => {
    dispatch({type: CANCELLEDORDERS, cancelledOrders: items});
  };
};

export const loadSupportMessages = clientId => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/get_supportMessages/${clientId}`);
    const resData = await response.json();
    dispatch({
      type: LOAD_SUPPORT_MESSAGES,
      allSupportMessages: resData.supportMessage,
    });
  };
};

export const updateHasViewdIntro = async userId => {
  const response = await fetch(`${URL}/api/update_has_viewed_intro_screen`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
    }),
  });
  const resData = await response.json();
  return resData;
};
