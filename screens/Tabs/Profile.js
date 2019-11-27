import React from "react";
import { ScrollView } from "react-native";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../../fragments";
import Loader from "../../components/Loader";
import { useQuery } from "@apollo/react-hooks";
import UserProfile from "../../components/UserProfile";

export const ME = gql`
{
    me {
        ...UserParts
    }
}
${USER_FRAGMENT}
`;


const View = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
`;

const Text = styled.Text``;

export default () => {
    const { loading, data } = useQuery(ME);
    return <ScrollView>{loading ? <Loader /> : data && data.me && <UserProfile {...data.me} />}</ScrollView>
};