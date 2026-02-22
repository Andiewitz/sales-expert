import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { TrendingUp, Activity, DollarSign, Users, ChevronRight, MessageSquare, Send, Sparkles } from 'lucide-react-native';
import { Sale, Lead, DashboardStats } from '../types';
import { Header } from './Header';
import { DashboardSkeleton } from './Skeleton';

const screenWidth = Dimensions.get('window').width;

interface DashboardProps {
    stats: DashboardStats;
    leads: Lead[];
    onViewAll: () => void;
    onCustomerPress: (lead: Lead) => void;
    onOpenChat: () => void;
    onSettingsPress?: () => void;
    onCalendarPress?: () => void;
    isLoading?: boolean;
}

export function Dashboard({ stats, leads, onViewAll, onCustomerPress, onOpenChat, onSettingsPress, onCalendarPress, isLoading }: DashboardProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const activeLeadsCount = useMemo(() =>
        leads.filter(l => l.status === 'Cold' || l.status === 'Warm' || l.status === 'Hot').length
        , [leads]);

    const wonLeadsCount = useMemo(() =>
        leads.filter(l => l.status === 'Won').length
        , [leads]);

    const leadsThisWeek = useMemo(() => {
        const now = new Date();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return leads.filter(l => l.createdAt >= startOfWeek.getTime()).length;
    }, [leads]);

    const leadsThisMonth = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);
        return leads.filter(l => l.createdAt >= startOfMonth.getTime()).length;
    }, [leads]);

    useEffect(() => {
        if (!isLoading) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isLoading]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Lead Trend Data Preparation
    const leadChartData = useMemo(() => {
        if (!leads || leads.length === 0) {
            return {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{ data: [0, 0, 0, 0, 0, 0] }]
            };
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const last6Months: { label: string, year: number, month: number, count: number }[] = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push({
                label: months[d.getMonth()],
                year: d.getFullYear(),
                month: d.getMonth(),
                count: 0
            });
        }

        leads.forEach(lead => {
            const leadDate = new Date(lead.createdAt);
            const monthIdx = last6Months.findIndex(m => m.month === leadDate.getMonth() && m.year === leadDate.getFullYear());
            if (monthIdx !== -1) {
                last6Months[monthIdx].count += 1;
            }
        });

        return {
            labels: last6Months.map(m => m.label),
            datasets: [{
                data: last6Months.map(m => m.count),
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Professional Blue
                strokeWidth: 3
            }]
        };
    }, [leads]);

    return (
        <SafeAreaView className="flex-1 bg-brand-black" edges={['top']}>
            <Header onSettingsPress={onSettingsPress} onCalendarPress={onCalendarPress} />

            {isLoading ? (
                <DashboardSkeleton />
            ) : (
                <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                        {/* Hero Card */}
                        <View className="bg-[#121212] rounded-2xl p-5 mb-4 border border-white/5 relative overflow-hidden">
                            <View className="flex-row justify-between items-start mb-4">
                                <Text className="text-slate-400 text-sm font-medium">Lead Acquisition</Text>
                                <View className="px-2 py-1 bg-blue-500/10 rounded-lg flex-row items-center gap-1 border border-blue-500/20">
                                    <Users size={12} color="#3b82f6" />
                                    <Text className="text-blue-500 text-[10px] font-bold">Trending</Text>
                                </View>
                            </View>

                            <Text className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                                {leads.length} <Text className="text-base font-semibold text-slate-500">Total Leads</Text>
                            </Text>

                            {/* Miniature Chart */}
                            <LineChart
                                data={leadChartData}
                                width={screenWidth - 80}
                                height={100}
                                chartConfig={{
                                    backgroundColor: '#121212',
                                    backgroundGradientFrom: '#121212',
                                    backgroundGradientTo: '#121212',
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                                    style: { borderRadius: 16 },
                                    propsForDots: { r: "4", strokeWidth: "2", stroke: "#3b82f6" },
                                    propsForBackgroundLines: { stroke: 'rgba(255,255,255,0.05)' }
                                }}
                                bezier
                                withInnerLines={false}
                                withOuterLines={false}
                                withVerticalLabels={true}
                                withHorizontalLabels={false}
                                style={{ marginLeft: -20, paddingRight: 0 }}
                            />
                        </View>

                        {/* Stats Grid */}
                        <View className="flex-row gap-3 mb-8">
                            <View className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <View className="w-8 h-8 rounded-xl bg-brand-gold/10 items-center justify-center mb-3">
                                    <TrendingUp size={16} color="#FFC107" />
                                </View>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">New This Week</Text>
                                <Text className="text-xl font-bold text-white">{leadsThisWeek}</Text>
                            </View>
                            <View className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <View className="w-8 h-8 rounded-xl bg-blue-500/10 items-center justify-center mb-3">
                                    <Users size={16} color="#3b82f6" />
                                </View>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">New This Month</Text>
                                <Text className="text-xl font-bold text-white">{leadsThisMonth}</Text>
                            </View>
                        </View>

                        <View className="mb-6">
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center gap-2">
                                    <Activity size={18} color="#FFC107" />
                                    <Text className="text-lg font-bold text-white tracking-tight">Recent Deals</Text>
                                </View>
                                <TouchableOpacity onPress={onViewAll} className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                                    <Text className="text-brand-gold text-[10px] font-black uppercase tracking-widest">View History</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
                                {leads.slice(0, 3).map((lead, idx) => (
                                    <TouchableOpacity
                                        key={lead.id}
                                        onPress={() => onCustomerPress(lead)}
                                        className={`p-4 flex-row items-center justify-between ${idx !== 2 ? 'border-b border-white/5' : ''}`}
                                        activeOpacity={0.7}
                                    >
                                        <View className="flex-row items-center gap-3">
                                            <View className="w-10 h-10 rounded-xl bg-brand-gray items-center justify-center border border-white/5">
                                                <Text className="text-white font-bold">{lead.name.charAt(0)}</Text>
                                            </View>
                                            <View>
                                                <Text className="text-white font-semibold text-sm">{lead.name}</Text>
                                                <Text className="text-slate-500 text-[10px] font-medium tracking-wide">Status: {lead.status}</Text>
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            <Text className="text-brand-gold font-bold text-sm">{formatCurrency(lead.value)}</Text>
                                            <ChevronRight size={14} color="#475569" />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Team Chat Preview */}
                        <View className="mb-12">
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center gap-2">
                                    <Users size={18} color="#FFC107" />
                                    <Text className="text-lg font-bold text-white tracking-tight">Team Activity</Text>
                                </View>
                                <View className="bg-green-500/10 px-2 py-1 rounded-lg flex-row items-center gap-1.5 border border-green-500/20">
                                    <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <Text className="text-green-500 text-[9px] font-black uppercase tracking-widest">12 Live</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={onOpenChat}
                                activeOpacity={0.9}
                                className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden"
                            >
                                <View className="p-4 gap-3">
                                    {/* Mock Recent Messages Preview */}
                                    <View className="flex-row gap-2.5">
                                        <View className="w-7 h-7 rounded-lg bg-brand-gray border border-white/10 items-center justify-center overflow-hidden">
                                            <Image source={{ uri: 'https://i.pravatar.cc/150?u=sarah' }} className="w-full h-full" />
                                        </View>
                                        <View className="bg-white/5 p-3 rounded-xl rounded-tl-none border border-white/5 flex-1">
                                            <Text className="text-slate-200 text-[11px] leading-relaxed">
                                                <Text className="font-bold text-white">Sarah Jenkins:</Text> Just closed Acme deal! 🚀
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row gap-2.5">
                                        <View className="w-7 h-7 rounded-lg bg-brand-gold items-center justify-center">
                                            <Text className="text-[9px] font-black">ME</Text>
                                        </View>
                                        <View className="bg-brand-gold/5 p-3 rounded-xl rounded-tl-none border border-brand-gold/10 flex-1">
                                            <Text className="text-brand-gold text-[11px] font-medium leading-relaxed">Amazing work Sarah!</Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="py-3 items-center bg-white/5 border-t border-white/5 flex-row justify-center gap-2">
                                    <MessageSquare size={12} color="#FFC107" />
                                    <Text className="text-brand-gold text-[10px] font-black uppercase tracking-widest">Open Floor</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
