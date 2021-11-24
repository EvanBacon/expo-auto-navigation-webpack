
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
export default function Navigation(props) {
    const root = React.createElement(require('./my-tabs/_nav').default, props);
    return React.createElement(NavigationContainer, null, root);
}
