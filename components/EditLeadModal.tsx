import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Save, X } from 'lucide-react-native';
import { BottomSheet } from './BottomSheet';
import { Lead } from '../types';

interface EditLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead | null;
    onSubmit: (lead: Lead) => void;
}

export const EditLeadModal: React.FC<EditLeadModalProps> = ({ isOpen, onClose, lead, onSubmit }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [notes, setNotes] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (lead) {
            setName(lead.name);
            setValue(lead.value.toString());
            setNotes(lead.notes || '');
            setEmail(lead.email || '');
            setPhone(lead.phone || '');
            setBusinessName(lead.businessName || '');
            setAddress(lead.address || '');
        }
    }, [lead]);

    const handleSubmit = () => {
        if (!name || !lead) return;
        onSubmit({
            ...lead,
            name,
            value: parseFloat(value) || 0,
            notes,
            email,
            phone,
            businessName,
            address
        });
        onClose();
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <View className="pt-2 pb-2 px-6 flex-row items-center justify-between">
                    <View>
                        <Text className="text-xl font-bold text-white tracking-tight">Edit Lead</Text>
                        <Text className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">Pipeline Management</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} className="bg-white/5 p-1.5 rounded-full">
                        <X size={18} color="#64748b" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="flex-1 px-6 pt-2"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150 }}
                >
                    <View className="mb-4">
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Name</Text>
                        <TextInput
                            className="bg-[#121212] p-3 rounded-lg text-white border border-white/5"
                            placeholder="Full Name"
                            placeholderTextColor="#4b5563"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View className="flex-row gap-3 mb-4">
                        <View className="flex-1">
                            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Email</Text>
                            <TextInput
                                className="bg-[#121212] p-3 rounded-lg text-white border border-white/5"
                                placeholder="Email"
                                placeholderTextColor="#4b5563"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Phone</Text>
                            <TextInput
                                className="bg-[#121212] p-3 rounded-lg text-white border border-white/5"
                                placeholder="Number"
                                placeholderTextColor="#4b5563"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Business & Value</Text>
                        <View className="flex-row gap-3">
                            <TextInput
                                className="flex-2 bg-[#121212] p-3 rounded-lg text-white border border-white/5"
                                placeholder="Company Name"
                                placeholderTextColor="#4b5563"
                                value={businessName}
                                onChangeText={setBusinessName}
                            />
                            <TextInput
                                className="flex-1 bg-[#121212] p-3 rounded-lg text-white border border-white/5"
                                placeholder="$ 0.00"
                                placeholderTextColor="#4b5563"
                                keyboardType="numeric"
                                value={value}
                                onChangeText={setValue}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Address</Text>
                        <TextInput
                            className="bg-[#121212] p-3 rounded-lg text-white border border-white/5"
                            placeholder="Street, City"
                            placeholderTextColor="#4b5563"
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Notes</Text>
                        <TextInput
                            className="bg-[#121212] p-4 rounded-xl text-white border border-white/5 h-24"
                            placeholder="Update details..."
                            placeholderTextColor="#4b5563"
                            multiline
                            textAlignVertical='top'
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>
                </ScrollView>

                <View className="p-4 bg-brand-black/90">
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-brand-gold py-4 rounded-xl items-center flex-row justify-center active:scale-[0.98]"
                    >
                        <Save size={18} color="black" />
                        <Text className="text-black font-bold text-base ml-2 uppercase tracking-wide">Update Lead</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </BottomSheet>
    );
};
