import * as React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { TabBarIcon } from '../../../../components/TabBarIcon';
import FontAwesome from '@expo/vector-icons/FontAwesome'

// import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../../../components/Themed';
import { RootTabScreenProps } from '../../../../types';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tab One</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>
    );
}

TabOneScreen.navigationOptions = ({ navigation }) => ({
    title: 'Tab One',
    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
    headerRight: () => (
        <Pressable
            onPress={() => navigation.navigate('Modal')}
            style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
            })}>
            <FontAwesome
                name="info-circle"
                size={25}
                color={'dodgerblue'}
                style={{ marginRight: 15 }}
            />
        </Pressable>
    ),
})

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
