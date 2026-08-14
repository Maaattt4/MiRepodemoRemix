import { View, Text, StyleSheet } from "react-native";

//const mitexto = "Mensaje desde un objeto";
//const num=22;

//const double = n => n*2;

export default function Mensaje( props ) {
    return (
        <View>
            <Text style={styles.color_texto1}> {props.titulo} </Text>
            <Text style={styles.color_texto2}> {props.numero} </Text>
        </View>
    );

}


    const styles = StyleSheet.create({
        color_texto1: {
            color: 'red',
            backgroundColor: 'yellow',
            fontSize: 20,
        },


        color_texto2: {
            color: 'blue',
            backgroundColor: 'lightblue',
            fontSize: 16,
        }

    });

