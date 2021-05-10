import React from 'react';
import Color from './Color.js';
import { faHome, faEnvelope, faUsers, faPalette, faShieldAlt, faHandshake, faShare, faCopy, faShareAltSquare, faCog } from '@fortawesome/free-solid-svg-icons';
import { faComment, faShareSquare } from '@fortawesome/free-regular-svg-icons';

export default {
  company: 'Increment Technologies',
  APP_NAME: '@SIML_',
  APP_NAME_BASIC: 'SYNQT',
  APP_EMAIL: 'support@wearesynqt.com',
  APP_WEBSITE: 'support@wearesynqt.com',
  APP_HOST: 'com.siml',
  pusher: {
    broadcast_type: 'pusher',
    channel: 'runway',
    notifications: 'App\\Events\\Notifications',
    orders: 'App\\Events\\Orders',
    typing: 'typing',
    messages: 'App\\Events\\Message',
    messageGroup: 'App\\Events\\MessageGroup',
    rider: 'App\\Events\\Rider',
  },
  DrawerMenu: [
    {
      title: 'Homepage',
      route: 'Homepage',
      icon: faHome,
      borderBottom: false
    },
    {
      title: 'Messages',
      route: 'Messenger',
      icon: faEnvelope,
      borderBottom: false
    },
    {
      title: 'Connections',
      route: 'Connections',
      icon: faUsers,
      borderBottom: false
    },
    {
      title: 'Theme Settings',
      route: 'Settings',
      icon: faCog,
      borderBottom: false
    },
    {
      title: 'Share Profile',
      route: 'share',
      icon: faShareSquare,
      borderBottom: true
    }
  ],
  DrawerMenu1: [{
    title: 'Terms & Conditions',
    route: 'TermsAndConditions',
    icon: faCopy,
    borderBottom: false
  },
  {
    title: 'Privacy Policy',
    route: 'Privacy',
    icon: faShieldAlt,
    borderBottom: false
  }],
  tutorials: [
    // {
    //   key: 1,
    //   title: 'Welcome to Agicord!',
    //   text: 'Delivering food and more to your doorstep!',
    //   icon: null,
    //   // image: require('assets/logo.png'),
    //   colors: [Color.primary, Color.lightGray],
    // },
  ],
  referral: {
    message:
      `Share the benefits of <<popular products>> with your friends and family. ` +
      `Give them ₱100 towards their first purchase when they confirm your invite. ` +
      `You’ll get ₱100 when they do!`,
    emailMessage: "I'd like to invite you on RunwayExpress!",
  },
  categories: [
    {
      type: 'Asian',
    },
    {
      type: 'American',
    },
    {
      type: 'Beverages',
    },
  ],
  retrieveDataFlag: 1,
  validateEmail(email) {
    let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9]*$/;
    if (reg.test(email) === false) {
      return false;
    } else {
      return true;
    }
  },
  cuisines:
  {
    1:'Filipino',
    2: 'Chinese',
    3: 'Japanese',
    4: 'Indian',
    5: 'Italian',
    6: 'Thai',
    7: 'Spanish',
    8: 'French',
    9: 'Korean',
    10: 'Turkish'
  }
};
