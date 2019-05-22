import { Linking, Alert} from 'react-native';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import InAppBrowser from 'react-native-inappbrowser-reborn';
const linkInApp = link => { InAppBrowser.open(link, {
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: 'gray',
        preferredControlTintColor: 'white',
        readerMode: false,
        showTitle: true,
        toolbarColor: '#6200EE',
        secondaryToolbarColor: 'black',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_right',
          endExit: 'slide_out_left',
        },
        headers: {
          'my-custom-header': 'my custom header value'
        },
      });}

export const ListenToNotifications = async (props) => {
    const { appToken, dev } = props;
    const notificationListenesr = firebase.notifications().onNotification((notification) => {
        const { title, body, type, url, notId } = notification.data;
        Linking.canOpenURL(url ? url : "null").then(supported => {
            if (supported) {
                showAlertLink(title, body, `${DeviceInfo.getApplicationName()}`, `Can we redirect to ${url} ?`)
                    .then(response => {
                        response ?
                            fetch(dev ? 'https://apid.inngage.com.br/v1/notification/' : 'https://api.inngage.com.br/v1/notification/',
                                {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    method: 'POST',
                                    body: JSON.stringify({
                                        notificationRequest:{    
                                            id: notId,
                                            app_token: appToken
                                        }
                                    })
                                })
                                .then(() => {  
                                   type == "deep" ? Linking.openURL(url) : linkInApp(url)}).catch(err => console.log(err)) : null;

                    })
                                
            } else {
                fetch(dev ? 'https://apid.inngage.com.br/v1/notification/' : 'https://api.inngage.com.br/v1/notification/',
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            notificationRequest:{    
                                id: notId,
                                app_token: appToken
                            }
                        })
                    })
                    .then(() => { showAlert(title, body) })
                    .catch(err => console.log(err))

            }
        });
        
    });
    const notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { notificationId } = notificationOpen.notification;
        const { title, body, type, url, notId } = notificationOpen.notification.data;
        Linking.canOpenURL(url ?  url : "null").then(supported => {
            if (supported) {
                showAlertLink(title, body, `${DeviceInfo.getApplicationName()}`, `Can we redirect to ${url} ?`)
                    .then(response => {
                        response ?
                            fetch(dev ? 'https://apid.inngage.com.br/v1/notification/' : 'https://api.inngage.com.br/v1/notification/',
                                {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    method: 'POST',
                                    body: JSON.stringify({
                                        notificationRequest:{    
                                        id: notId,
                                        app_token: appToken
                                    }
                                    })
                                })
                                .then(() => {  
                                   type == "deep" ? Linking.openURL(url) : linkInApp(url)}).catch(err => console.log(err)) : null;

                    })
            } else {
                fetch(dev ? 'https://apid.inngage.com.br/v1/notification/' : 'https://api.inngage.com.br/v1/notification/',
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            notificationRequest:{    
                                id: notId,
                                app_token: appToken
                            }
                        })
                    })
                    .then((r) => { 

                        showAlert(title, body) }).catch(err => console.log(err))

            }
        })
    });
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { notificationId } = notificationOpen.notification;
        const { title, body, type, url, notId } = notificationOpen.notification.data;
        Linking.canOpenURL(url  ?  url : "null").then(supported => {
            if (supported) {
                showAlertLink(title, body, `${DeviceInfo.getApplicationName()}`, `Can we redirect to ${url} ?`)
                    .then(response => {
                        response ?
                            fetch(dev ? 'https://apid.inngage.com.br/v1/notification/' : 'https://api.inngage.com.br/v1/notification/',
                                {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    method: 'POST',
                                    body: JSON.stringify({
                                        notificationRequest:{    
                                            id: notId,
                                            app_token: appToken
                                        }
                                    })
                                })
                                .then(() => {  
                                   type == "deep" ? Linking.openURL(url) : linkInApp(url)}).catch(err => console.log(err)) : null;

                    })
            } else {
                fetch(dev ? 'https://apid.inngage.com.br/v1/notification/' : 'https://api.inngage.com.br/v1/notification/',
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            notificationRequest:{    
                                id: notId,
                                app_token: appToken
                            }
                        })
                    })
                    .then((r) => {
                        showAlert(title, body) }).catch(err => console.log(err))

            }
        });
    }
    const messageListener = firebase.messaging().onMessage((message) => {
        showAlert(JSON.stringify(message));
    });
}

const showAlert = (title, body) => {
    Alert.alert(
        title, body,
        [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
    );
};
const showAlertLink = (title, body, appName, link) => {
    return new Promise((resolve, reject) => {
        Alert.alert(
            title, `${body}\n\n${link}`,
            [
                { text: 'NO', onPress: () => resolve(false) },
                { text: 'OK', onPress: () => resolve(true) }

            ],
            { cancelable: false },
        );
    })
};

const getFirebaseAccess = () => {
    return new Promise((resolve, reject) => {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    firebase.messaging().getToken().then(token => {
                        resolve(token);
                    })
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            firebase.messaging().getToken().then(token => {
                                resolve(token);
                            })
                        })
                        .catch(error => {
                            reject(error)
                        });
                }
            });
    });
};


const geoFance = (appToken, dev) => {

    return new Promise((resolve, reject) => {

        navigator.geolocation.getCurrentPosition(() => {

            navigator.geolocation.watchPosition((position) => {

                fetch(dev ? 'https://apid.inngage.com.br/v1/geolocation/' : 'https://api.inngage.com.br/v1/geolocation/',

                    {

                        headers: {

                            'Accept': 'application/json',

                            'Content-Type': 'application/json'

                        },

                        method: 'POST',

                        body: JSON.stringify({

                            registerGeolocationRequest: {

                                uuid: DeviceInfo.getUniqueID(),

                                lat: position.coords.latitude,

                                lon: position.coords.longitude,

                                app_token: appToken

                            }

                        })

                    }).then(() => {

                        resolve(position)

                    }).catch(err => console.log(err))

            })

        });

    })

}

export const GetPermission = props => {

    ListenToNotifications(props);

    const { appToken, dev, friendlyIdentifier, customFields, customData } = props;

    geoFance(appToken, dev).then(location => {

        const { latitude, longitude } = location.coords;

        getFirebaseAccess()

            .then(respToken => {

                if (customData) {

                    var request = {

                        registerSubscriberRequest: {

                            app_token: appToken,

                            identifier: friendlyIdentifier,

                            registration: respToken,

                            platform: DeviceInfo.getSystemName(),

                            sdk: DeviceInfo.getBuildNumber(),

                            device_model: DeviceInfo.getModel(),

                            device_manufacturer: DeviceInfo.getManufacturer(),

                            os_locale: DeviceInfo.getDeviceCountry(),

                            os_language: DeviceInfo.getDeviceLocale(),

                            os_version: DeviceInfo.getReadableVersion(),

                            app_version: DeviceInfo.getBuildNumber(),

                            app_installed_in: DeviceInfo.getFirstInstallTime(),

                            app_updated_in: DeviceInfo.getLastUpdateTime(),

                            uuid: DeviceInfo.getUniqueID(),

                            lat: latitude,

                            long: longitude,

                            custom_field: {

                                customFields

                            }

                        }
                    }

                } else {

                    var request = {

                        registerSubscriberRequest: {

                            app_token: appToken,

                            identifier: friendlyIdentifier,

                            registration: respToken,

                            platform: DeviceInfo.getSystemName(),

                            sdk: DeviceInfo.getBuildNumber(),

                            device_model: DeviceInfo.getModel(),

                            device_manufacturer: DeviceInfo.getManufacturer(),

                            os_locale: DeviceInfo.getDeviceCountry(),

                            os_language: DeviceInfo.getDeviceLocale(),

                            os_version: DeviceInfo.getReadableVersion(),

                            app_version: DeviceInfo.getBuildNumber(),

                            app_installed_in: DeviceInfo.getFirstInstallTime(),

                            app_updated_in: DeviceInfo.getLastUpdateTime(),

                            uuid: DeviceInfo.getUniqueID(),

                            lat: location.coords.latitude,

                            long: location.coords.longitude,

                        }
                    }

                }

                fetch(props.dev ? 'https://apid.inngage.com.br/v1/subscription/' : 'https://api.inngage.com.br/v1/subscription/',

                    {

                        headers: {

                            'Accept': 'application/json',

                            'Content-Type': 'application/json'

                        },

                        method: 'POST',

                        body: JSON.stringify(request)

                    })

            }).then(() => 'InngageSDK : Connected to Inngage!')

            .catch(err => `InngageSDK : Error during Firebase connection -> + ${err}`);

    })



};