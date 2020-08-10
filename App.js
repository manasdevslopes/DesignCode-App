import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import AppNavigator from './navigator/AppNavigator';

const initialState = {
  action: "",
  name: "Stranger",
  avatar: "http://user.marks222.com/uploads/editors/default-avatar.png"
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "OPEN_MENU": return { ...state, action: "openMenu" }
    case "CLOSE_MENU": return { ...state, action: "closeMenu" }
    case "UPDATE_NAME": return { ...state, name: action.name }
    case "UPDATE_AVATAR": return { ...state, avatar: action.avatar }
    case "OPEN_CARD": return { ...state, action: "openCard" }
    case "CLOSE_CARD": return { ...state, action: "closeCard" }
    case "OPEN_LOGIN": return { ...state, action: "openLogin" };
    case "CLOSE_LOGIN": return { ...state, action: "closeLogin" };
    case "OPEN_NOTIF": return { ...state, action: "openNotif" };
    case "CLOSE_NOTIF": return { ...state, action: "closeNotif" };

    default: return state;
  }

  // if (action.type == 'CLOSE_MENU') {
  //   return { action: "closeMenu" }
  // } else if (action.type == 'OPEN_MENU') {
  //   return { action: "openMenu" }
  // }
  // return state;
}

const store = createStore(reducer);

const App = () => (
  <Provider store={store}>
    <AppNavigator />
  </Provider>
)
export default App;