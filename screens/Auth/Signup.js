import React, { useState } from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { useMutation } from "@apollo/react-hooks"
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { CREATE_ACCOUNT } from "./AuthQueries";

const View = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
`;

const FBContainer = styled.View`
    margin-top: 25px;
    padding-top: 25px;
    border-top-width: 1px ;
    border-color: ${props => props.theme.lightGreyColor};
    border-style: solid;
`;

export default ({ navigation }) => {
    const firstNameInput = useInput("");
    const lastNameInput = useInput("");
    const emailInput = useInput(navigation.getParam("email", ""));
    const userNameInput = useInput("");
    const [loading, setLoading] = useState(false);
    const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
        variables: {
            userName: userNameInput.value,
            email: emailInput.value,
            firstName: firstNameInput.value,
            lastName: lastNameInput.value
        }
    });
    const handleSignup = async () => {
        const { value: firstName } = firstNameInput;
        const { value: lastName } = lastNameInput;
        const { value: email } = emailInput;
        const { value: userName } = userNameInput;
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) {
            return Alert.alert("That email is invalid");
        }
        if (firstName === "") {
            return Alert.alert("I need your name");
        }
        if (userName === "") {
            return Alert.alert("Invalid user name");
        }
        try {
            setLoading(true);
            const { data: { createAccount } } = await createAccountMutation();
            if (createAccount) {
                Alert.alert("Account created", "Log in now!");
                navigation.navigate("Login", { email });
            }
        } catch (e) {
            Alert.alert("Username taken.")
            navigation.navigate("Login", { email })
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <AuthInput
                    {...firstNameInput}
                    placeholder="First name"
                    returnKeyType="send"
                    autoCorrect={false}
                    autoCapitalize="words"
                />
                <AuthInput
                    {...lastNameInput}
                    placeholder="Last name"
                    returnKeyType="send"
                    autoCorrect={false}
                    autoCapitalize="words"
                />
                <AuthInput
                    {...emailInput}
                    placeholder="Email"
                    keyboardType="email-address"
                    returnKeyType="send"
                    autoCorrect={false}
                />
                <AuthInput
                    {...userNameInput}
                    placeholder="User name"
                    returnKeyType="send"
                    autoCorrect={false}
                />

                <AuthButton text="Sign Up" onPress={handleSignup} loading={loading} />
                <FBContainer>
                    <AuthButton bgColor={"#2D4DA7"} loading={false} onPress={() => null} text="Connect Facebook" />
                </FBContainer>
            </View>
        </TouchableWithoutFeedback>

    );
};