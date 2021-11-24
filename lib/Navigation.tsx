import * as React from 'react';

import { useNavigator } from './useNavigator';

export function getDefaultOptions() {
    return { type: 'stack', initialRouteName: 'index', screenOptions: { headerShown: false } }
}


export function getIndexNavigationOptions(context) {
    const indexKey = context.keys().filter((key: string) => key.replace(/(^.\/)|(\.(t|j)sx?$)/g, '') === 'index')[0]
    if (!indexKey) return {}
    const component = context(indexKey).default;
    return component.navigationOptions ?? {}
}


function useIndex(context, func) {
    return React.useMemo(() => {
        const index = context.keys().filter(func).map(key => {
            let name = key.replace(/(^.\/)|(\.[tj]sx?$)/g, '');
            if (name.endsWith('/_nav')) {
                name = name.substring(0, name.length - 5);
            }
            const component = context(key).default;
            return { name, component };
        });
        return index;

    }, [])
}

export function Navigation({ navigator = 'bottom-tabs', deepContext, context, ...props }) {
    const Navigator = useNavigator(navigator)
    function toChildren(index: { name: string, component: React.ComponentType<any> }[]): React.ReactNode[] {
        return index.map(({ name, component }) => {
            const extraProps = component.navigationOptions || {};
            return React.createElement(Navigator.Screen, { key: name, name, component, options: extraProps });
        });
    }
    const index = useIndex(context, () => true);
    const deepIndex = useIndex(deepContext, key => key.split('/').length === 3);

    const combined = [...index, ...deepIndex];
    const children = React.useMemo(() => toChildren(combined), [navigator, Navigator])
    return (
        <Navigator.Navigator
            {...props}
            children={children}
        />
    );
}
