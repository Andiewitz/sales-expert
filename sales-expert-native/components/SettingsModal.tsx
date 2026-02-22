import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Moon, Sun, Trash2, Database, X } from 'lucide-react-native';
import { BottomSheet } from './BottomSheet';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSeedData?: () => void;
    onResetData?: () => void;
}

export function SettingsModal({ isOpen, onClose, onSeedData, onResetData }: SettingsModalProps) {
    const handleSeedData = () => {
        Alert.alert(
            "Seed Demo Data",
            "This will clear existing data and add sample leads and sales. Continue?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Seed Data",
                    style: "destructive",
                    onPress: () => {
                        onSeedData?.();
                        onClose();
                    }
                }
            ]
        );
    };

    const handleResetData = () => {
        Alert.alert(
            "Reset Database",
            "Are you sure? This will permanently delete all leads and sales data.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete All",
                    style: "destructive",
                    onPress: () => {
                        onResetData?.();
                        onClose();
                    }
                }
            ]
        );
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <View className="p-6">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-white text-2xl font-black tracking-tight">Settings</Text>
                        <Text className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">Configuration</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} className="bg-white/5 p-2 rounded-full border border-white/5">
                        <X size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                {/* Settings Options */}
                <View className="gap-3">
                    {/* Database Section */}
                    <View className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                        <View className="px-4 py-3 border-b border-white/5">
                            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">Database</Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleSeedData}
                            className="px-4 py-4 flex-row items-center justify-between border-b border-white/5 active:bg-white/5"
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-blue-500/10 rounded-xl items-center justify-center border border-blue-500/20">
                                    <Database size={18} color="#3b82f6" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-sm">Seed Demo Data</Text>
                                    <Text className="text-slate-500 text-xs mt-0.5">Add sample leads and sales</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleResetData}
                            className="px-4 py-4 flex-row items-center justify-between active:bg-white/5"
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-red-500/10 rounded-xl items-center justify-center border border-red-500/20">
                                    <Trash2 size={18} color="#ef4444" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-sm">Reset Database</Text>
                                    <Text className="text-slate-500 text-xs mt-0.5">Delete all data</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* App Info */}
                    <View className="bg-white/5 rounded-xl border border-white/5 px-4 py-3">
                        <Text className="text-slate-500 text-xs text-center">Sales Expert MVP v1.0</Text>
                        <Text className="text-slate-600 text-[10px] text-center mt-1">Built with React Native & Expo</Text>
                    </View>
                </View>
            </View>
        </BottomSheet>
    );
}
