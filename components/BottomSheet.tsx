import React, { useEffect, useRef } from 'react';
import {
    View,
    Modal,
    Animated,
    PanResponder,
    Dimensions,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
    const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    const resetPositionAnim = Animated.parallel([
        Animated.timing(panY, {
            toValue: 0,
            duration: 500, // Slower for premium feel
            useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }),
    ]);

    const closeAnim = Animated.parallel([
        Animated.timing(panY, {
            toValue: SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }),
    ]);

    useEffect(() => {
        if (isOpen) {
            resetPositionAnim.start();
        }
    }, [isOpen]);

    const handleDismiss = () => {
        closeAnim.start(() => onClose());
    };

    if (!isOpen) return null;

    return (
        <Modal
            transparent
            visible={isOpen}
            animationType="none"
            onRequestClose={handleDismiss}
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={handleDismiss}>
                    <Animated.View
                        style={[
                            styles.backdrop,
                            {
                                opacity: backdropOpacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 0.6],
                                }),
                            },
                        ]}
                    />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[
                        styles.sheet,
                        {
                            transform: [{ translateY: panY }],
                        },
                    ]}
                >
                    {children}
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
    },
    sheet: {
        backgroundColor: '#0C0C0C',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: SCREEN_HEIGHT * 0.9,
        width: '100%',
        maxHeight: SCREEN_HEIGHT * 0.9,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
    },
    // Handles removed
});
