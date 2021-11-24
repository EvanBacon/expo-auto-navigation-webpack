import * as React from 'react';

import { getDefaultOptions, getIndexNavigationOptions, Navigation } from './Navigation';


const defaultOptions = getDefaultOptions();

export function load({ context, deep: deepContext, config }: { config: () => object; deep: any; context: any }) {

    const resolved = (() => {
        try {
            return config();
        } catch {
            // Default is switch nav
            return defaultOptions
        }
    })()

    function fromJSON({ type = defaultOptions.type, initialRouteName = defaultOptions.initialRouteName, screenOptions = defaultOptions.screenOptions, ...extraProps } = defaultOptions) {
        function NavigationWrapper(props: any) {
            return (
                <Navigation {...props} {...extraProps} initialRouteName={initialRouteName} screenOptions={screenOptions} deepContext={deepContext} context={context} navigator={type} />
            );
        }
        // Push options from index screen
        NavigationWrapper.navigationOptions = getIndexNavigationOptions(context);
        return NavigationWrapper
    }

    return fromJSON(resolved)
}