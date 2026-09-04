import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

function SplashScreen() {
    return(
        <View style={styles.splash}>
            <Text style={styles.logo}>
                🚀
            </Text>
            <Text style={styles.title}>
                Mi aplicacion
            </Text>
            <Text>
                Cargando...
            </Text>
        </View>
    );
}

function HomeScreen() {
    return (
        <View style={styles.home}>
            <Text style={styles.homeText}>
                Bienvenido a la pantalla de inicio
            </Text>
        </View>
    );
}   

export default function App2() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 5000);
    }, []);
    if (loading) {
        return <SplashScreen />;
    }
    return <HomeScreen />
}

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

    },
    logo: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        marginBottom: 8,
    },
    home: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    homeText: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
});
    