import React, { useState, useContext} from 'react';
import { Image,Button, View, Text, TextInput, StyleSheet, TouchableOpacity,Switch, Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Header from '../GeniusHome/Header';
import { Icon } from 'react-native-elements'
import disco from '../GeniusHome/disco-ball.png'
import discoG from '../GeniusHome/disco-gray.png'

global.defaultIP = '172.23.7.72';

function HomeScreen({ navigation }) {
    const [IPaddress, setIPaddress] = useState(defaultIP);
    const lightDiode = (mes) => {
        fetch("http://" + IPaddress + ":80/", {
            method: "post",
            headers: {
                "led": mes,
            },

        })
            .then(function (response) {
                if (response.status == 200) {
                    let responseText = JSON.stringify(response.text());
                    console.log(responseText);
                }
                else throw new Error('HTTP response status not code 200 as expected.');
            })
            .catch(function (error) {
                Alert.alert(error);   
            });
    }
    const [color13, setColor13] = useState("#696969");
    const [isEnabled13, setIsEnabled13] = useState(false);
    const toggleSwitch13 = () => {
        var mes;
        setIsEnabled13(previousState => !previousState);
        if (isEnabled13) {
            lightDiode("13ON");
              setColor13("#696969");
        }
        else {
            lightDiode("13OFF");
          setColor13("#ffdd00");
        }
        
    }
    const [color12, setColor12] = useState("#696969");
    const [isEnabled12, setIsEnabled12] = useState(false);
    const toggleSwitch12 = () => {
       
        setIsEnabled12(previousState => !previousState);
        if (isEnabled12) {
            lightDiode("12ON");
            setColor12("#696969");
        }
        else {
            lightDiode("12OFF");
            setColor12("#ffdd00");
        }
       
    }
    const [color8, setColor8] = useState("#696969");
    const [isEnabled8, setIsEnabled8] = useState(false);
    const toggleSwitch8 = () => {
        var mes;
        setIsEnabled8(previousState => !previousState);
        if (isEnabled8) {
            lightDiode("8ON");
             setColor8("#696969");
        }
        else {
            lightDiode("8OFF");
           setColor8("#ffdd00");
        }
    }
    

    return (
       
            <View style={styles.mainContainer}>
            <Header customStyles={styles.svgCurve} />
            
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Custom Header</Text>
            </View>
            <Text style={styles.textAddress}>Current ESP8266 IP address</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={text => setIPaddress(text)}
                value={IPaddress}
            />


            <View style={styles.container}>

                <View style={styles.buttonContainer}>

                    <Icon
                        raised
                        name='lightbulb-o'
                        type='font-awesome'
                        color={color13}
                    />

                    <Switch
                        style={styles.switch}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled13 ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch13}
                        value={isEnabled13}
                    />
                </View>

                <View style={styles.buttonContainer}>   
                    <Icon
                        raised
                        name='lightbulb-o'
                        type='font-awesome'
                        color={color12}
                    />
                    <Switch

                        style={styles.switch}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled12 ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch12}
                        value={isEnabled12}
                    />
                </View>
            </View>

            <View style={styles.containerVol2}>
                <View style={styles.buttonContainer}>
                    <Icon
                        raised
                        name='lightbulb-o'
                        type='font-awesome'
                        color={color8}
                    />
                    <Switch
                        style={styles.switch}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled8 ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch8}
                        value={isEnabled8}
                    />
                    </View>
            </View>
            </View>
        );
    
}

function Disco({ navigation }) {

    const [IPaddress, setIPaddress] = useState(defaultIP);

    const Disco = (mes) => {
        fetch("http://" + IPaddress + ":80/", {
            method: "post",
            headers: {
                "dis": mes,
            },

        })
            .then(function (response) {
                if (response.status == 200) {
                    let responseText = JSON.stringify(response.text());
                    console.log(responseText);
                }
                else throw new Error('HTTP response status not code 200 as expected.');
            })
            .catch(function (error) {
                Alert.alert(error);
            });
    }

    const [image, setIsImage] = useState(discoG);
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => {
        var mes;
        setIsEnabled(previousState => !previousState);
        if (isEnabled) {
            Disco("ON");
             setIsImage(discoG);
        }
        else {
            Disco("OFF");
           setIsImage(disco);
        }
    }


    return (
        <View style={styles.mainContainer}>
            <Header customStyles={styles.svgCurve} />

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Custom Header</Text>
            </View>
            <Text style={styles.textAddress}>Current ESP8266 IP address</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={text => setIPaddress(text)}
                value={IPaddress}
            />


            <View style={styles.container}>
                <View style={styles.buttonContainerDisco}>
                    <Image source={image} style={{ top:30, width: 150, height: 150 }} /> 
                <Switch
                    style={styles.switchDisco}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    />
                    
                </View>
            </View>
        </View>
    );
}


function Alarm({ navigation }) {

    const [IPaddress, setIPaddress] = useState(defaultIP);

    const Alarm = (mes) => {
        fetch("http://" + IPaddress + ":80/", {
            method: "post",
            headers: {
                "alm": mes,
            },

        })
            .then(function (response) {
                if (response.status == 200) {
                    let responseText = JSON.stringify(response.text());
                    console.log(responseText);
                }
                else throw new Error('HTTP response status not code 200 as expected.');
            })
            .catch(function (error) {
                Alert.alert(error);
            });
    }


    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [name, setName] = useState('bell-slash');
    function handleClickON(e) {
        e.preventDefault();
        Alarm("ON");
        setIsButtonDisabled(true);
        setTimeout(() => setIsButtonDisabled(false), 5000);
        setName("bell");
    }

    function handleClickOFF(e) {
        e.preventDefault();
        Alarm("OFF");
        setIsButtonDisabled(true);
        setTimeout(() => setIsButtonDisabled(false), 5000);
        setName("bell-slash");
    }

    return (
        <View style={styles.mainContainer}>
            <Header customStyles={styles.svgCurve} />

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Custom Header</Text>
            </View>
            <Text style={styles.textAddress}>Current ESP8266 IP address</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={text => setIPaddress(text)}
                value={IPaddress}
            />
  
            <View style={styles.containerColumn}>
                <Icon
                    adjustsFontSizeToFit
                    name={name}
                    type='font-awesome'
                    color='black'
                />
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={isButtonDisabled ? styles.disabled : styles.enabled}
                            disabled={isButtonDisabled}
                        onPress={handleClickON}>
                        <Text style={{ color: 'white', textAlign: 'center' }}> Alarm On </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>

                        <TouchableOpacity
                            style={isButtonDisabled ? styles.disabled : styles.enabled}
                            disabled={isButtonDisabled}
                            onPress={handleClickOFF}>
                            <Text style={{ color: 'white', textAlign: 'center' }}> Alarm Off </Text>
                        </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


function Garage({ navigation }) {

    const [IPaddress, setIPaddress] = useState(defaultIP);
    const Garage = (mes) => {
        fetch("http://" + IPaddress + ":80/", {
            method: "post",
            headers: {
                "gar": mes,
            },

        })
            .then(function (response) {
                if (response.status == 200) {
                    let responseText = JSON.stringify(response.text());
                    console.log(responseText);
                }
                else throw new Error('HTTP response status not code 200 as expected.');
            })
            .catch(function (error) {
                Alert.alert(error);
            });
    }

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    function handleClickON(e) {
        e.preventDefault();
        Garage("ON");
        setIsButtonDisabled(true);
        setTimeout(() => setIsButtonDisabled(false), 5000);
        
    }

    function handleClickOFF(e) {
        e.preventDefault();
        Garage("OFF");
        setIsButtonDisabled(true);
        setTimeout(() => setIsButtonDisabled(false), 5000);
    }



    return (
        <View style={styles.mainContainer}>
            <Header customStyles={styles.svgCurve} />
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Garage</Text>
            </View>
            <Text style={styles.textAddress}>Current ESP8266 IP address</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={text => setIPaddress(text)}
                value={IPaddress}
            />


            <View style={styles.containerColumn}>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={isButtonDisabled ? styles.disabled : styles.enabled}
                        disabled={isButtonDisabled}
                        onPress={handleClickON}>
                        <Text style={{ color: 'white', textAlign: 'center' }}> Open Garage </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>

                    <TouchableOpacity
                        style={isButtonDisabled ? styles.disabled : styles.enabled}
                        disabled={isButtonDisabled}
                        onPress={handleClickOFF}>
                        <Text style={{ color: 'white', textAlign: 'center' }}> Close Garage </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    );
}
const Drawer = createDrawerNavigator();

export default function App() {
  
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Alarm" component={Alarm} />
                <Drawer.Screen name="Garage" component={Garage} />
                <Drawer.Screen name="Disco" component={Disco} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },

    textInput: {
        top: 90,
        alignSelf: 'center',
        height: 40,
        width: 100,
        textAlign: 'center',
        borderColor: 'gray',
        borderWidth: 1
    },
    disabled: {
        backgroundColor: '#b7e5ed', width: 150, height: 100, justifyContent: 'center'
    },
    enabled: {
        backgroundColor: '#2CC6E1', width: 150, height: 100, justifyContent: 'center'
    },
    switch: {
        transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
        top: 20,
    },
    switchDisco: {
        transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
        top: 50,
    },
    textAddress: {
        top: 80,
        alignSelf: 'center',
    },
    container: {
        top: 180,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerColumn: {
        top: 120,

        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    containerVol2: {
        top: 200,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    buttonContainer: {
        flex: 0.5,
        margin: 10,
        width: 200,
        height: 130,
        alignItems: 'center',
        backgroundColor: "rgba(74, 228, 255,0.3)",
        elevation: 2,
    },

    buttonContainerDisco: {
        margin: 10,
        width: 250,
        height: 250,
        alignItems: 'center',
        backgroundColor: "rgba(74, 228, 255,0.3)",
        elevation: 2,
    },

    headerContainer: {
        marginTop: 40,
        marginHorizontal: 10
    },

    button: {
        margin: 30,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
       
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 35
    },
    svgCurve: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        color:'red'
    }

});