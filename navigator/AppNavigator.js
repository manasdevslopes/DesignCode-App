import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/HomeScreen.js';
import SectionsScreen from '../screens/SectionsScreen.js';
import TabNavigator from './TabNavigator.js';

const AppNavigator = createStackNavigator({
    Home: HomeScreen,
    Section: SectionsScreen
}, {
    mode: 'modal'
})

export default createAppContainer(TabNavigator)