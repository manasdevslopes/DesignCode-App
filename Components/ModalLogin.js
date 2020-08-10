import React, { Component } from 'react';
import styled from 'styled-components';
import { TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, Animated, Dimensions, AsyncStorage } from "react-native";
import { BlurView } from 'expo-blur';
import Success from './Success';
import Loading from './Loading';

import { connect } from "react-redux";

import firebase from "./Firebase";

import { saveState } from './AsyncStorage.js';

function mapStateToProps(state) {
    return { action: state.action };
}

function mapDispatchToProps(dispatch) {
    return {
        closeLogin: () =>
            dispatch({
                type: "CLOSE_LOGIN"
            }),
        updateName: (name) =>
            dispatch({
                type: "UPDATE_NAME",
                name
            }),
        updateAvatar: (avatar) => dispatch({ type: "UPDATE_AVATAR", avatar })
    };
}

const screenHeight = Dimensions.get('window').height;

class ModalLogin extends Component {
    state = {
        email: "",
        password: "",
        iconEmail: require("../assets/icon-email.png"),
        IconPassword: require("../assets/icon-password.png"),
        isSuccessful: false,
        isLoading: false,
        top: new Animated.Value(screenHeight),
        scale: new Animated.Value(1.3),
        translateY: new Animated.Value(0)
    };

    componentDidMount() {
        this.retrieveName()
    }

    componentDidUpdate() {
        if (this.props.action === "openLogin") {
            Animated.timing(this.state.top, { toValue: 0, duration: 0 }).start()
            Animated.spring(this.state.scale, { toValue: 1 }).start()
            Animated.timing(this.state.translateY, { toValue: 0, duration: 0 }).start()
        }
        if (this.props.action === "closeLogin") {
            setTimeout(() => {
                Animated.timing(this.state.top, { toValue: screenHeight, duration: 0 }).start()
                Animated.spring(this.state.scale, { toValue: 1.3 }).start()
            }, 500)
            Animated.timing(this.state.translateY, { toValue: 1000, duration: 500 }).start()
        }
    }

    storeName = async (name) => {
        try {
            await AsyncStorage.setItem("name", name)
        } catch (error) { }
    }

    retrieveName = async () => {
        try {
            const name = await AsyncStorage.getItem("name");
            if (name !== null) {
                console.log("NAME IS:", name)
                this.props.updateName(name)
            }
        } catch (error) { }
    }

    handleLogin = () => {
        // console.log(this.state.email, this.state.password);

        this.setState({ isLoading: true })

        const email = this.state.email;
        const password = this.state.password;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(function (error) {
                // Error message
                Alert.alert("Error", error.message);
                Keyboard.dismiss();
            })
            .then(response => {
                this.setState({ isLoading: false });
                Keyboard.dismiss();
                if (response) {
                    // Successful
                    this.setState({ isSuccessful: true, email: "", password: "", iconEmail: require("../assets/icon-email.png"), IconPassword: require("../assets/icon-password.png"), });
                    // this.storeName(response.user.email);

                    this.fetchUser();

                    this.props.updateName(response.user.email);
                    setTimeout(() => {
                        Alert.alert("Congrats", "You've logged in successfuly!");

                        this.props.closeLogin();
                        this.setState({ isSuccessful: false });
                    }, 1000);

                    // console.log(response.user);
                }
            });
    };

    fetchUser = () => {
        fetch('https://uinames.com/api/?ext')
            .then(response => response.json())
            .then(response => {
                console.log("RESPONSE", response)
                const name = response.name
                const avatar = response.photo

                saveState({ name, avatar })

                this.props.updateName(name)
                this.props.updateAvatar(avatar)
            })
            .catch(e => console.log(e))
    }

    focusEmail = () => {
        this.setState({
            iconEmail: require("../assets/icon-email-animated.gif"),
            IconPassword: require("../assets/icon-password.png")
        });
    };

    focusPassword = () => {
        this.setState({
            IconPassword: require("../assets/icon-password-animated.gif"),
            iconEmail: require("../assets/icon-email.png"),
        });
    };

    tapBackground = () => {
        Keyboard.dismiss();
        this.props.closeLogin()
        this.setState({
            email: "",
            password: "",
            iconEmail: require("../assets/icon-email.png"),
            IconPassword: require("../assets/icon-password.png"),
        })
    };

    render() {
        return (
            <AnimatedContainer style={{ top: this.state.top }}>
                <TouchableWithoutFeedback onPress={this.tapBackground}>
                    <BlurView
                        tint="default"
                        intensity={100}
                        style={{ position: "absolute", width: "100%", height: "100%" }}
                    />
                </TouchableWithoutFeedback>
                <AnimatedModal style={{ transform: [{ scale: this.state.scale }, { translateY: this.state.translateY }] }}>
                    <Logo source={require('../assets/logo-dc.png')} />
                    <Text>Start Learning. Access Pro Content.</Text>
                    <TextInput
                        autoCapitalize='none'
                        onChangeText={email => this.setState({ email })}
                        placeholder="Email"
                        value={this.state.email}
                        keyboardType="email-address"
                        onFocus={this.focusEmail}
                    />
                    <TextInput
                        autoCapitalize='none'
                        onChangeText={password => this.setState({ password })}
                        placeholder="Password"
                        value={this.state.password}
                        secureTextEntry={true}
                        onFocus={this.focusPassword}
                    />
                    <IconEmail source={this.state.iconEmail} key={this.state.iconEmail} />
                    <IconPassword source={this.state.IconPassword} key={this.state.IconPassword} />
                    <TouchableOpacity onPress={this.handleLogin}>
                        <Button>
                            <ButtonText>Log In</ButtonText>
                        </Button>
                    </TouchableOpacity>
                </AnimatedModal>
                <Success isActive={this.state.isSuccessful} />
                <Loading isActive={this.state.isLoading} />
            </AnimatedContainer>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ModalLogin);

const Container = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    justify-content: center;
    align-items: center;
`;

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const Modal = styled.View`
    width: 335px;
    height: 370px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    align-items: center;
`;

const AnimatedModal = Animated.createAnimatedComponent(Modal);

const Logo = styled.Image`
    width: 44px;
    height: 44px;
    margin-top: 50px;
`;

const Text = styled.Text`
    margin-top: 20px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    width: 160px;
    text-align: center;
    color: #b8bece;
`;

const TextInput = styled.TextInput`
    border: 1px solid #dbdfea;
    width: 295px;
    height: 44px;
    border-radius: 10px;
    font-size: 17px;
    color: #3c4560;
    margin-top: 20px;
    padding-left: 44px;
`;

const Button = styled.View`
    background: #5263ff;
    width: 295px;
    height: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0 10px 20px #c2cbff;
    margin-top: 20px;
`;

const ButtonText = styled.Text`
    color: white;
    font-weight: 600;
    font-size: 20px;
    text-transform: uppercase;
`;

const IconEmail = styled.Image`
    width: 24px;
    height: 16px;
    position: absolute;
    top: 179px;
    left: 31px;
`;

const IconPassword = styled.Image`
    width: 18px;
    height: 24px;
    position: absolute;
    top: 239px;
    left: 35px;
`;