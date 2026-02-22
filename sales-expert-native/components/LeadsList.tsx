import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, TextInput, Linking, Alert, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lead, LeadStatus } from '../types';
import {
    Search,
    Phone,
    Mail,
    MoreHorizontal,
    Clock,
    Calendar,
    ArrowLeft,
    PlusCircle,
    CheckCircle2,
    Download
} from 'lucide-react-native';
import { Header } from './Header';
import { LeadsSkeleton } from './Skeleton';

interface LeadsListProps {
    leads: Lead[];
    onLeadPress: (lead: Lead) => void;
    onAddPress?: () => void;
    onSettingsPress?: () => void;
    onCalendarPress?: () => void;
    onExport?: () => void;
    statistics?: {
        total: number;
        won: number;
        active: number;
        pipelineValue: number;
        conversionRate: number;
    };
    isLoading?: boolean;
}

const statusColors: { [key in LeadStatus]: string } = {
    'Cold': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Warm': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Hot': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Won': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Lost': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const filterOptions: (LeadStatus | 'All')[] = ['All', 'Cold', 'Warm', 'Hot', 'Won', 'Lost'];

const FadingListItem = ({ children, index }: { children: React.ReactNode, index: number }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 50, // Stagger effect
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                delay: index * 50,
                useNativeDriver: true,
            })
        ]).start();
    }, [index]);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {children}
        </Animated.View>
    );
};

export const LeadsList: React.FC<LeadsListProps> = ({ leads, onLeadPress, onAddPress, onSettingsPress, onCalendarPress, onExport, statistics, isLoading }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<LeadStatus | 'All'>('All');

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesFilter = selectedFilter === 'All' || lead.status === selectedFilter;
            const matchesSearch =
                lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (lead.businessName || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [leads, selectedFilter, searchQuery]);

    const getTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 3600) return `Added ${Math.floor(seconds / 60)} mins ago`;
        if (seconds < 86400) return `Added ${Math.floor(seconds / 3600)} hours ago`;
        return `Added ${Math.floor(seconds / 86400)} days ago`;
    };

    const handleCall = (phone?: string) => {
        if (!phone) {
            Alert.alert("No number", "This lead doesn't have a phone number.");
            return;
        }
        Linking.openURL(`tel:${phone}`);
    };

    const handleEmail = (email?: string) => {
        if (!email) {
            Alert.alert("No email", "This lead doesn't have an email address.");
            return;
        }
        Linking.openURL(`mailto:${email}`);
    };

    const renderItem = useCallback(({ item, index }: { item: Lead, index: number }) => (
        <FadingListItem index={index}>
            <TouchableOpacity
                onPress={() => onLeadPress(item)}
                activeOpacity={0.7}
                className="bg-[#121212] mx-4 mb-3 p-4 rounded-xl border border-white/5 flex flex-col gap-3"
            >
                <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                            <Text className="text-lg font-bold text-white tracking-tight">{item.name}</Text>
                            {item.status === 'Won' && <CheckCircle2 size={14} color="#22c55e" />}
                        </View>
                        <Text className="text-[11px] text-slate-500 font-medium">{item.businessName || 'Independent'}</Text>

                        <View className="flex-row items-center gap-2 mt-2">
                            <Text className="text-brand-gold font-bold text-sm">$ {(item.value / 1000).toFixed(1)}k</Text>
                            <View className="w-1 h-1 rounded-full bg-white/20" />
                            <View className="flex-row items-center gap-1">
                                <Clock size={10} color="#64748b" />
                                <Text className="text-[10px] text-slate-500 font-medium">
                                    {getTimeAgo(item.createdAt)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => onLeadPress(item)} // Or open status picker specifically? reusing generic menu for now is safest MVP
                        className={`px-3 h-6 rounded-lg border border-white/5 items-center justify-center ${statusColors[item.status]}`}
                    >
                        <Text
                            className="text-[10px] font-black uppercase tracking-widest text-center"
                            style={{ includeFontPadding: false, textAlignVertical: 'center' }}
                        >{item.status}</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Actions Footer */}
                <View className="flex-row gap-2 mt-2 pt-3 border-t border-white/5">
                    <TouchableOpacity
                        onPress={() => handleCall(item.phone)}
                        className="flex-1 bg-white/5 h-8 rounded-lg items-center flex-row justify-center gap-2 active:bg-white/10"
                    >
                        <Phone size={14} color={item.phone ? "#94a3b8" : "#475569"} />
                        <Text
                            className={`text-[10px] font-bold uppercase ${item.phone ? "text-slate-300" : "text-slate-600"}`}
                            style={{ includeFontPadding: false, textAlignVertical: 'center' }}
                        >Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleEmail(item.email)}
                        className="flex-1 bg-white/5 h-8 rounded-lg items-center flex-row justify-center gap-2 active:bg-white/10"
                    >
                        <Mail size={14} color={item.email ? "#94a3b8" : "#475569"} />
                        <Text
                            className={`text-[10px] font-bold uppercase ${item.email ? "text-slate-300" : "text-slate-600"}`}
                            style={{ includeFontPadding: false, textAlignVertical: 'center' }}
                        >Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => onLeadPress(item)}
                        className="w-10 bg-white/5 h-8 rounded-lg items-center justify-center active:bg-white/10"
                    >
                        <MoreHorizontal size={14} color="#94a3b8" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </FadingListItem>
    ), [onLeadPress]);

    return (
        <SafeAreaView className="flex-1 bg-brand-black" edges={['top']}>
            <Header
                onSettingsPress={onSettingsPress}
                onCalendarPress={onCalendarPress}
                extraActions={
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity onPress={onExport} className="p-1">
                            <Download size={20} color="#94a3b8" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onAddPress} className="p-1">
                            <PlusCircle size={22} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                }
            />

            <View className="px-4 py-3 border-b border-white/5 bg-brand-black/80">
                <Text className="text-2xl font-black text-white mb-4 tracking-tight">My Leads</Text>

                <View className="relative">
                    <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                        <Search size={14} color="#64748b" />
                    </View>
                    <TextInput
                        className="bg-[#121212] rounded-xl py-2.5 pl-10 pr-4 text-white text-xs border border-white/5"
                        placeholder="Search leads..."
                        placeholderTextColor="#4b5563"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-5 -mx-4 px-4">
                    <View className="flex-row gap-2 pb-1">
                        {filterOptions.map((filter) => (
                            <TouchableOpacity
                                key={filter}
                                onPress={() => setSelectedFilter(filter)}
                                className={`px-4 py-1.5 rounded-lg border ${selectedFilter === filter
                                    ? 'bg-brand-gold border-brand-gold'
                                    : 'bg-[#121212] border-white/5'
                                    }`}
                            >
                                <Text
                                    className={`text-[9px] font-black uppercase tracking-widest ${selectedFilter === filter ? 'text-black' : 'text-slate-500'
                                        }`}
                                >
                                    {filter === 'All' ? 'All' : filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {isLoading ? (
                <LeadsSkeleton />
            ) : (
                <FlatList
                    data={filteredLeads}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ paddingVertical: 16, paddingBottom: 100 }}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center py-20 px-10">
                            <View className="bg-[#1A1A1A] p-6 rounded-full mb-4">
                                <Search size={40} color="#4b5563" />
                            </View>
                            <Text className="text-slate-400 text-lg font-bold text-center">
                                {searchQuery ? `No results for "${searchQuery}"` : "Your pipeline is empty"}
                            </Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};
