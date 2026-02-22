import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { DollarSign, Save, X } from 'lucide-react-native';
import { BottomSheet } from './BottomSheet';

interface AddSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (description: string, amount: number, date: string) => void;
}

export const AddSaleModal: React.FC<AddSaleModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = () => {
        if (!description || !amount) return;
        onSubmit(description, parseFloat(amount), new Date().toISOString());
        setDescription('');
        setAmount('');
        onClose();
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <View className="pt-4 pb-2 px-6 flex-row items-center justify-between">
                    <View>
                        <Text className="text-xl font-bold text-white mb-0.5 tracking-tight">Record Sale</Text>
                        <Text className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">New Transaction</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} className="bg-white/5 p-2 rounded-full border border-white/5">
                        <X size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="flex-1 px-6 pt-4"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150 }}
                >
                    <View className="mb-4">
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Description</Text>
                        <TextInput
                            className="bg-[#121212] p-3 rounded-lg text-white border border-white/5"
                            placeholder="Deal description..."
                            placeholderTextColor="#4b5563"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Amount ($)</Text>
                        <TextInput
                            className="bg-[#121212] p-3 rounded-lg text-white border border-white/5"
                            placeholder="0.00"
                            placeholderTextColor="#4b5563"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>
                </ScrollView>

                <View className="p-4 bg-brand-black/90">
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-brand-gold py-4 rounded-xl items-center flex-row justify-center active:scale-[0.98]"
                    >
                        <Save size={18} color="black" />
                        <Text className="text-black font-bold text-base ml-2 uppercase tracking-wide">Confirm Sale</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </BottomSheet>
    );
};
