// native-stack

import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { TabBarIcon } from '../../../../components/TabBarIcon';

// import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../../../components/Themed';
import { RootTabScreenProps } from '../../../../types';


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    return (
        <View style={styles.container}>
            <Text style={styles.title} onPress={() => navigation.push('other')}>Push</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <Ionicons name="add" />
        </View>
    );
}

TabOneScreen.navigationOptions = {
    title: 'Tab Two',
    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
