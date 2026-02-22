import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { MapPin, Calendar, PlusCircle, X } from 'lucide-react-native';
import { BottomSheet } from './BottomSheet';

interface AddLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, value: number, status: string, notes: string, email: string, phone: string, businessName: string, address: string) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [status] = useState('Cold');
    const [notes, setNotes] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = () => {
        if (!name) return;
        onSubmit(
            name,
            parseFloat(value) || 0,
            status,
            notes,
            email,
            phone,
            businessName,
            address
        );
        // Reset
        setName('');
        setValue('');
        setNotes('');
        setEmail('');
        setPhone('');
        setBusinessName('');
        setAddress('');
        onClose();
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                {/* Header with Logo Area */}
                <View className="pt-4 pb-2 px-6 flex-row items-center justify-between">
                    <View>
                        <Text className="text-xl font-bold text-white mb-0.5 tracking-tight">Create Lead</Text>
                        <Text className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">New Pipeline Entry</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} className="bg-white/5 p-2 rounded-full border border-white/5">
                        <X size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="flex-1 px-6 pt-2"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150 }}
                >
                    {/* Name Input */}
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

                    {/* Address Input */}
                    <View className="mb-4">
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Address</Text>
                        <View className="relative">
                            <TextInput
                                className="bg-[#121212] p-3 pr-10 rounded-lg text-white border border-white/5"
                                placeholder="Street Address, City"
                                placeholderTextColor="#4b5563"
                                value={address}
                                onChangeText={setAddress}
                            />
                            <View className="absolute right-3 top-3.5">
                                <MapPin size={16} color="#4b5563" />
                            </View>
                        </View>
                    </View>

                    {/* Email & Phone Grid */}
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
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Business & Potential</Text>
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
                                placeholder="$ Value"
                                placeholderTextColor="#4b5563"
                                keyboardType="numeric"
                                value={value}
                                onChangeText={setValue}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Notes</Text>
                        <TextInput
                            className="bg-[#121212] p-3 rounded-lg text-white border border-white/5 h-20"
                            placeholder="Lead details..."
                            placeholderTextColor="#4b5563"
                            multiline
                            textAlignVertical='top'
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>

                    {/* Follow Up Logic Mock */}
                    <TouchableOpacity className="flex-row items-center justify-between p-4 bg-[#1E1E1E] rounded-xl border border-white/5 mb-5 shadow-sm">
                        <View className="flex-row items-center gap-3">
                            <Calendar size={20} color="#FFC107" />
                            <Text className="text-white font-bold text-xs uppercase tracking-widest leading-none mt-1">Follow up on</Text>
                        </View>
                        <Text className="text-[#FFC107] font-black text-xs">SELECT DATE</Text>
                    </TouchableOpacity>

                    {/* Map Image Placeholder */}
                    <View className="mb-5">
                        <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Pin on Map</Text>
                        <View className="w-full aspect-video rounded-2xl overflow-hidden border border-white/5 bg-[#1E1E1E] relative">
                            <Image
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNudwoT6GVLX8-TlHgqG9XWXY0RqFOKweWfl335qJ3p6cKJOuYG06U2KEaVrdaOTliGKpFK1Pz7i9Y3nhGUKGTRuCPbDnIfjLMvnsPU4n-3S6seDMEoX2sLIJ8UROlB8-YLIXr6v9YVjh08hIe52lzpEhwsS6by03d5NzVNpC1RmzXDB7MRrQ6yrIilXOWI4iJPkq66V2p4Y7BFh2noNH6fVNPSrSID2mbt0FU0scExAPDMOrs4XDZJck35VMM431W2rMmMXWByIs' }}
                                className="w-full h-full opacity-60"
                                resizeMode="cover"
                            />
                            <View className="absolute inset-0 flex items-center justify-center">
                                <View className="bg-brand-black/90 p-3 rounded-full shadow-xl ring-1 ring-white/10">
                                    <MapPin size={24} color="#FFC107" />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View className="p-4 bg-brand-black/90">
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-brand-gold py-4 rounded-xl items-center flex-row justify-center active:scale-[0.98]"
                    >
                        <PlusCircle size={18} color="black" />
                        <Text className="text-black font-bold text-base ml-2 uppercase tracking-wide">Create Lead</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </BottomSheet>
    );
};
