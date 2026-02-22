import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, ArrowLeft, Hourglass } from 'lucide-react-native';

interface ComingSoonProps {
    title: string;
    onBack: () => void;
}

export function ComingSoon({ title, onBack }: ComingSoonProps) {
    return (
        <SafeAreaView className="flex-1 bg-brand-black" edges={['top']}>
            <View className="flex-row items-center px-4 py-2 border-b border-white/5">
                <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
                    <ArrowLeft color="#FFC107" size={24} />
                </TouchableOpacity>
                <Text className="text-white font-bold text-lg ml-2">{title}</Text>
            </View>

            <View className="flex-1 items-center justify-center p-8">
                <View className="w-24 h-24 bg-brand-gold/10 rounded-full items-center justify-center mb-8 border border-brand-gold/20">
                    <Hourglass size={48} color="#FFC107" />
                </View>

                <View className="items-center mb-8">
                    <View className="flex-row items-center gap-2 mb-2">
                        <Sparkles size={16} color="#FFC107" />
                        <Text className="text-brand-gold font-black uppercase tracking-widest text-xs">Premium Feature</Text>
                        <Sparkles size={16} color="#FFC107" />
                    </View>
                    <Text className="text-white text-3xl font-black text-center tracking-tight mb-4">
                        Coming Soon
                    </Text>
                    <Text className="text-slate-400 text-center leading-relaxed font-medium">
                        Our team is working hard to bring {title} to the Sales Expert app. Stay tuned for updates!
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={onBack}
                    className="bg-brand-gold px-8 py-4 rounded-2xl flex-row items-center gap-2"
                >
                    <Text className="text-black font-black uppercase tracking-widest text-sm">Back to Tools</Text>
                </TouchableOpacity>

                <View className="absolute bottom-12 flex-row gap-8 opacity-20">
                    <View className="bg-white h-1 w-12 rounded-full" />
                    <View className="bg-brand-gold h-1 w-12 rounded-full" />
                    <View className="bg-white h-1 w-12 rounded-full" />
                </View>
            </View>
        </SafeAreaView>
    );
}
