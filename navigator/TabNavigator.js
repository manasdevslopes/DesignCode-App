import React, { Component } from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/HomeScreen';
import SectionsScreen from '../screens/SectionsScreen';
import CoursesScreen from '../screens/CoursesScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import VideoScreen from "../screens/VideoScreen";

import { Ionicons } from "@expo/vector-icons";

const activeColor = "#4775f2"
const inactiveColor = "#b8bece"

const HomeStack = createStackNavigator({
    Home: HomeScreen,
    Section: SectionsScreen,
    Video: VideoScreen
}, {
    mode: 'modal'
})
HomeStack.navigationOptions = ({ navigation }) => {
    var tabBarVisible = true

    const routeName = navigation.state.routes[navigation.state.index].routeName;

    if (routeName == 'Section' || routeName == "Video") {
        tabBarVisible = false
    }

    return {
        tabBarVisible,
        tabBarLabel: "Home",
        tabBarIcon: ({ focused }) => <Ionicons name="ios-home" size={26} color={focused ? activeColor : inactiveColor} />
    }
}

const CoursesStack = createStackNavigator({
    Courses: CoursesScreen
})
CoursesStack.navigationOptions = {
    tabBarLabel: "Courses",
    tabBarIcon: ({ focused }) => <Ionicons name="ios-albums" size={26} color={focused ? activeColor : inactiveColor} />
}

const ProjectsStack = createStackNavigator({
    Projects: ProjectsScreen
})
ProjectsStack.navigationOptions = {
    tabBarLabel: "Projects",
    tabBarIcon: ({ focused }) => <Ionicons name="ios-folder" size={26} color={focused ? activeColor : inactiveColor} />
}

const TabNavigator = createBottomTabNavigator({
    HomeStack, CoursesStack, ProjectsStack
})
export default TabNavigator;