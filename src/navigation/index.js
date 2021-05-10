import {createStackNavigator} from 'react-navigation-stack';
import Login from 'src/modules/account/Login';
import ForgotPassword from 'src/modules/account/ForgotPassword';
import Register from 'src/modules/account/Register';
import NotificationStack from 'src/modules/notification/Drawer';
import RestaurantStack from 'src/modules/restaurants/Drawer';
import ConnectionStack from 'src/modules/connection/Drawer';
import MenuStack from 'src/modules/menu/index';
import EventsStack from 'src/modules/events/Drawer';
import RetailsStack from 'src/modules/retails/Drawer';
import CartStack from 'src/modules/cart/Drawer'
import CheckoutStack from 'src/modules/checkout/Drawer'
import HistoryStack from 'src/modules/history/Drawer'
import TopChoiceStack from 'src/modules/topChoice/Drawer'
import ProfileStack from 'src/modules/profile/Drawer'
import LocationStack from 'components/Location/LocationWithMap'
import AddLocationStack from 'modules/addLocation/AddLocationDrawer.js';
import ViewProfileStack from 'src/modules/viewProfile/Drawer'
import RetailNameStack from 'src/modules/retailName/Drawer'
import PeopleListStack from 'src/modules/people/Drawer'
import EventNameStack from 'src/modules/eventName/Drawer'
import MessagesStack from 'modules/messenger/MessagesDrawer.js';
import MainMessageStack from 'modules/messenger/Drawer.js';
import Welcome from 'src/modules/account/Landing'
import RateStack from 'src/modules/rate/Drawer';
import Drawer from './Drawer';

const WelcomeStack = createStackNavigator(
  {
    loginScreen: {screen: Welcome},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);


// login stack
const LoginStack = createStackNavigator(
  {
    loginScreen: {screen: Login},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// Forgot Password stack
const ForgotPasswordStack = createStackNavigator(
  {
    forgotPasswordScreen: {screen: ForgotPassword},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// Forgot Password stack
const RegisterStack = createStackNavigator(
  {
    registerScreen: {screen: Register},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

const LocationWithMapStack = createStackNavigator(
  {
    LocationWithMapScreen: {screen: LocationStack},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    landingStack: {screen: WelcomeStack},
    loginStack: {screen: LoginStack},
    forgotPasswordStack: {screen: ForgotPasswordStack},
    registerStack: {screen: RegisterStack},
    drawerStack: {screen: Drawer},
    notificationStack: {screen: NotificationStack},
    restaurantStack: {screen: RestaurantStack},
    eventsStack: {screen: EventsStack},
    retailsStack: {screen: RetailsStack},
    cartStack: {screen: CartStack},
    historyStack: {screen: HistoryStack},
    menuStack: {screen: MenuStack},
    profileStack: {screen: ProfileStack},
    topChoiceStack: {screen: TopChoiceStack},
    viewProfileStack: {screen: ViewProfileStack},
    locationStack: {screen: LocationWithMapStack},
    addLocationStack: {screen: AddLocationStack},
    checkoutStack: {screen: CheckoutStack},
    connectionStack: {screen: ConnectionStack},
    retailNameStack: {screen: RetailNameStack},
    eventNameStack: {screen: EventNameStack},
    messagesStack: {screen: MessagesStack},
    peopleListStack: {screen: PeopleListStack},
    mainMessageStack: {screen: MainMessageStack},
    rateStack: {screen: RateStack}
  },
  {
    // Default config for all screens
    headerMode: 'none',
    title: 'Main',
    initialRouteName: 'landingStack',
  },
);

export default PrimaryNav;
