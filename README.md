# Auto Navigation Webpack

> This is a Webpack version of my original [Metro experiment](https://github.com/EvanBacon/expo-auto-navigation).

This project demonstrates automatic navigation built on top of `react-navigation` for the Expo ecosystem. The style is based on PHP/Next.js/Gatsby navigation.

Creating files in the `screens/` folder creates new screens for a navigator. Each folder has a `_nav.json` file which defines static properties for the navigator.

## Usage

```sh
yarn ios
```

Reload the app manually with `r` in the console, or shaking the device.

> Expo Webpack is in Beta (especially for native platforms) and subject to breaking changes.

## Idea

The goal of this project is to enable users to go from a single page app to an app with truly native navigation in a seamless flow.

The React Navigation API can often be tedious to write, maintain, and update. Auto navigation would aim to move tedious coding into automated bundler functionality.

Examples of some tedious React Navigation DX:

- Creating navigators and importing all the screens can often be tedious in large apps.
- It's often unclear the best way to structure your navigation files.
- Routing must be manually written and maintained, keeping this in-line with the component tree is often hard to do.
- Types are difficult to maintain.
- Not all screens need to be loaded upfront.
- Coming from web, users expect some form of file system type navigation (this project does **not** currently aim to be a quick fix for universal navigation).

The plan is to have a system that is always React Navigation at its core. This means you can always peal back layers until you're simply writing custom navigation code again. Any folder should be able to opt out of auto navigation, meaning more basic sections of the app like a settings screen can be automatic and more complex sections can be written manually.

This feature should be easy to enable in projects that are using Expo bundler tooling. You should be able to just install a package, and export a component like `<AutoNavigation />` to setup the auto navigation.

In the future, users should have fully qualified routing created automatically. This would improve how users configure authentication, deep linking (including notifications), attribution, etc.

There is potential for improving bundle sizes automatically, and server rendering portions of the UI.

## How It Works

> (How it works currently...)

Generally speaking, you'll have a folder like `screens` or `pages` and inside of that folder you'll have a navigator file `_nav.js` which imports all of the screens in the folder and wraps them in a navigator:

```js
const { load } = require("@expo/auto-nav");

export default load({
  // for pages
  context: require.context("./", false, /^((?!_nav).)*\\.[jt]sx?$/, "sync"),
  // for folders
  deep: require.context("./", true, /\/*.\/_nav\.[jt]sx?$/, "sync"),
  config: () => require("./_nav.json"),
});
```

When the `_nav.js` file isn't present, a Webpack plugin will automatically generate one with template contents using utilities from a "auto navigation" library (`@expo/auto-nav`).

This structure means you could effectively overwrite all automation at every layer.

To accommodate tab and drawer style navigators which define UI elements, everything screen is loaded in synchronously. In the future we can add a config option to load navigators lazily, which could be useful for stack and modal type navigation.

Tab bar and Drawer elements can be configured using the static `navigationOptions` on the exported screen component, consider this basic example:

```js
// Imports...

function Screen() {
  return <View />;
}

Screen.navigationOptions = ({ navigation }) => ({
  title: "Tab One",
  // Define the tab bar icon.
  tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
});

export default Screen;
```

Because this is the only logical place to keep the icon, it means we need to load all of the pages synchronously, otherwise icons in the tab bar wouldn't render.

This can easily be mitigated by using React Suspense to offload the expensive inner contents until the screen is properly loaded (available only in Webpack):

```js
import React from "react";
import { ActivityIndicator } from "react-native";

// Lazy-loaded
const ComplexScreen = React.lazy(() => import("../components/ComplexScreen"));

function Screen() {
  return (
    // Show a spinner while the profile is loading
    <React.Suspense fallback={<ActivityIndicator />}>
      <ComplexScreen />
    </React.Suspense>
  );
}

Screen.navigationOptions = {
  // Define the tab bar icon.
};

export default Screen;
```

In the future this could be automated further using the bundler to wrap the exported screen component and hoist the `navigationOptions` static up so it can be loaded ahead of time.

### Considerations

On web we use a concept called "routing", and on native we use "navigation", these are two very different concepts.
Web and native cannot have seamless parity without some major compromises which is why universal platform support is a non-goal of this project.

For example, on web, every page is run in a fresh JS context, whereas on native the entire app shares a single JS context. This means async bundle splitting is much tricky and has less benefits than web.

In React Navigation v5, we moved to a component based API which enabled much better Fast Refresh support, this is no longer the case with auto navigation since properties are often defined in a static value.

### Webpack

I've chosen to continue building this feature in Webpack as it offers a robust plugin system that simply isn't available in Metro (and is not planned to be added in the coming years).
The drawback is that Webpack is not as refined for React Native development as Metro is.

By using Webpack I was able to replace the [custom Metro middleware](https://github.com/EvanBacon/expo-auto-navigation/blob/main/middleware/navigationRoutesMiddleware.js) with runtime features like `request.context`. I was also able to replace the absurd [async code splitting](https://github.com/EvanBacon/expo-auto-navigation#code-loading) with React Suspense. Finally, with Webpack creating virtual modules, we can pick and choose how much automation we want inside of the navigation stack (not possible before).

Ultimately this means we've traded having to build async bundle splitting, plugin ecosystem, React Suspense, and many other complex features into Metro in favor of having to build custom Metro/React Native features into Webpack (more achievable).

We also get the added benefits of dropping internal Facebook features that are unused by the community, such as Haste module mapping, [x_facebook_sources](https://github.com/expo/expo-cli/tree/master/packages/metro-config#source-maps), and aggressive caching.
Along with getting many of the [speed improvements that Exotic users are already enjoying](https://blog.expo.dev/drastically-faster-bundling-in-react-native-a54f268e0ed1).

Overall, moving to Webpack is net positive for the community and opens us up to many new features like auto navigation, ESBuild, SWC, asset generation plugins, etc...

## Known Issues

This project is still **very** early in development, there are many bugs to work out.

### Expo Webpack

- Expo Webpack doesn't currently support HMR or Fast Refresh.
- Expo Webpack doesn't currently support multi-platform development servers.

### Auto Navigation

- Virtual modules are not being removed after the respective folder is deleted.
- Virtual modules appear to cause an infinite file watching refresh loop.
