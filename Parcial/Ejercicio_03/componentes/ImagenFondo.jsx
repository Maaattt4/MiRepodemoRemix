import {View, Image, ImageBackground, StyleSheet, Dimensions, Text } from 'react-native';
export default function ImagenFondo() {
    return (
        <View style={styles.fondo}>

            <ImageBackground
                    style={styles.fondo}
                    source={require('../assets/guille-pozzi.jpg')}

            >

            <View>
                <Text style={styles.texto}>¡Bienvenido!</Text>
            </View>        


            <View style={styles.conteiner}>
                <Image 
                    style={styles.foto}
                    source={{uri: 'https://images4.alphacoders.com/928/9286.jpg'}}
                />
            </View>
                
            </ImageBackground>
            


        </View>
    );
}

const styles = StyleSheet.create({
    fondo: {
        
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        
    },
    foto: {
        opacity: 0.8,
        margin: 20,
        alignContent: 'center',
        width: 200,    
        height: 200,
        borderRadius: 16,
        borderWidth: 10,
        borderColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    conteiner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    texto: {
        position: 'absolute',
        top: Dimensions.get('window').height * 0.05,
        left: Dimensions.get('window').width * 0.00,
        right: Dimensions.get('window').width * 0.00,
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
        backgroundColor: 'rgba(181, 10, 10, 0.5)',
        textAlign: 'center',
        

    },

});