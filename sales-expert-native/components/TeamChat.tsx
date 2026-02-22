import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Image,
    Modal,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, X, Users, Smile, Paperclip, MoreVertical, ShieldCheck } from 'lucide-react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Message {
    id: string;
    sender: string;
    text: string;
    time: string;
    isAdmin?: boolean;
    avatar?: string;
}

interface TeamChatProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TeamChat: React.FC<TeamChatProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'Sarah Jenkins',
            text: 'Just closed the Acme Corp deal! 🚀',
            time: '09:41 AM',
            avatar: 'https://i.pravatar.cc/150?u=sarah'
        },
        {
            id: '2',
            sender: 'You',
            text: 'Amazing work Sarah!',
            time: '09:42 AM'
        },
        {
            id: '3',
            sender: 'David Chen',
            text: 'Who is handling the new lead from the Tech Solutions inbound?',
            time: '10:05 AM',
            avatar: 'https://i.pravatar.cc/150?u=david',
            isAdmin: true
        },
        {
            id: '4',
            sender: 'Emma Wilson',
            text: 'I can take that one. Just finishing up a proposal.',
            time: '10:10 AM',
            avatar: 'https://i.pravatar.cc/150?u=emma'
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 65,
                    friction: 11,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isOpen]);

    const handleDismiss = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 350,
                useNativeDriver: true,
            })
        ]).start(() => {
            setIsVisible(false);
            onClose();
        });
    };

    const handleSend = () => {
        if (!inputText.trim()) return;
        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'You',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, newMessage]);
        setInputText('');
    };

    if (!isVisible && !isOpen) return null;

    return (
        <Modal transparent visible={isVisible} animationType="none" onRequestClose={handleDismiss}>
            <Animated.View style={{ flex: 1, opacity: opacityAnim, backgroundColor: 'black' }}>
                <Animated.View
                    style={{ transform: [{ translateY: slideAnim }] }}
                    className="flex-1 bg-brand-black"
                >
                    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-5 py-3 border-b border-white/5">
                            <View className="flex-row items-center gap-3">
                                <TouchableOpacity onPress={handleDismiss} className="p-1 -ml-1">
                                    <X size={20} color="#FFC107" />
                                </TouchableOpacity>
                                <View>
                                    <View className="flex-row items-center gap-1.5">
                                        <Text className="text-white font-bold text-base tracking-tight">Sales Floor</Text>
                                        <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    </View>
                                    <Text className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-none">12 Active</Text>
                                </View>
                            </View>
                            <TouchableOpacity className="p-1">
                                <MoreVertical size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {/* Messages Area */}
                        <ScrollView
                            className="flex-1 px-4 pt-4"
                            contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {messages.map((msg) => {
                                const isMe = msg.sender === 'You';
                                return (
                                    <View key={msg.id} className={`flex-row gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        {!isMe && (
                                            <View className="w-7 h-7 rounded-lg border border-brand-gold/10 overflow-hidden bg-[#1A1A1A]">
                                                {msg.avatar ? (
                                                    <Image source={{ uri: msg.avatar }} className="w-full h-full" />
                                                ) : (
                                                    <View className="w-full h-full items-center justify-center">
                                                        <Users size={12} color="#FFC107" />
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                        <View className={`max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                                            {!isMe && (
                                                <View className="flex-row items-center gap-1.5 mb-1 ml-0.5">
                                                    <Text className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{msg.sender}</Text>
                                                    {msg.isAdmin && <ShieldCheck size={10} color="#FFC107" />}
                                                </View>
                                            )}
                                            <View className={`px-4 py-3 rounded-xl ${isMe
                                                ? 'bg-brand-gold'
                                                : 'bg-[#121212] border border-white/5'
                                                }`}>
                                                <Text className={`text-[13px] leading-relaxed ${isMe ? 'text-black font-semibold' : 'text-slate-200'}`}>
                                                    {msg.text}
                                                </Text>
                                            </View>
                                            <Text className="text-[8px] text-slate-600 font-bold mt-1 px-1">{msg.time}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </ScrollView>

                        {/* Input Area */}
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                        >
                            <View className="px-4 py-3 bg-black border-t border-white/5">
                                <View className="flex-row items-center gap-2">
                                    <TouchableOpacity className="p-1">
                                        <Paperclip size={18} color="#64748b" />
                                    </TouchableOpacity>
                                    <View className="flex-1 bg-[#121212] rounded-xl border border-white/5 px-3 py-1 flex-row items-center">
                                        <TextInput
                                            className="flex-1 text-white text-[13px] py-1"
                                            placeholder="Message..."
                                            placeholderTextColor="#4b5563"
                                            value={inputText}
                                            onChangeText={setInputText}
                                        />
                                        <TouchableOpacity className="ml-1">
                                            <Smile size={18} color="#64748b" />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleSend}
                                        className="w-10 h-10 bg-brand-gold rounded-xl items-center justify-center"
                                    >
                                        <Send size={16} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};
