import React, { useMemo, useEffect, useRef } from 'react';
import { Dimensions, Animated, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { TrendingUp, Activity, Users, ChevronRight, MessageSquare } from 'lucide-react-native';
import { YStack, XStack, Text, ScrollView, Card, Circle, View as TamaguiView } from 'tamagui';
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
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                strokeWidth: 3
            }]
        };
    }, [leads]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} edges={['top']}>
            <Header onSettingsPress={onSettingsPress} onCalendarPress={onCalendarPress} />

            {isLoading ? (
                <DashboardSkeleton />
            ) : (
                <ScrollView f={1} px="$4" pt="$2" showsVerticalScrollIndicator={false}>
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                        
                        {/* Hero Card */}
                        <Card elevate size="$4" bordered bg="#121212" br="$5" p="$5" mb="$4" borderColor="rgba(255,255,255,0.05)" overflow="hidden">
                            <XStack jc="space-between" ai="flex-start" mb="$4">
                                <Text color="$color10" fontSize="$3" fontWeight="500">Lead Acquisition</Text>
                                <XStack bg="rgba(59, 130, 246, 0.1)" px="$2" py="$1" br="$3" ai="center" gap="$1" borderColor="rgba(59, 130, 246, 0.2)" borderWidth={1}>
                                    <Users size={12} color="#3b82f6" />
                                    <Text color="#3b82f6" fontSize="$2" fontWeight="bold">Trending</Text>
                                </XStack>
                            </XStack>

                            <Text fontSize="$9" fontWeight="900" color="white" mb="$4" letterSpacing={-1}>
                                {leads.length} <Text fontSize="$5" fontWeight="600" color="$color10">Total Leads</Text>
                            </Text>

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
                        </Card>

                        {/* Stats Grid */}
                        <XStack gap="$3" mb="$6">
                            <Card f={1} bg="rgba(255,255,255,0.05)" p="$4" br="$5" bordered borderColor="rgba(255,255,255,0.05)">
                                <Circle size="$4" bg="rgba(255, 193, 7, 0.1)" mb="$3">
                                    <TrendingUp size={16} color="#FFC107" />
                                </Circle>
                                <Text color="$color10" fontSize="$2" fontWeight="bold" textTransform="uppercase" letterSpacing={1} mb="$1">New This Week</Text>
                                <Text fontSize="$7" fontWeight="bold" color="white">{leadsThisWeek}</Text>
                            </Card>
                            <Card f={1} bg="rgba(255,255,255,0.05)" p="$4" br="$5" bordered borderColor="rgba(255,255,255,0.05)">
                                <Circle size="$4" bg="rgba(59, 130, 246, 0.1)" mb="$3">
                                    <Users size={16} color="#3b82f6" />
                                </Circle>
                                <Text color="$color10" fontSize="$2" fontWeight="bold" textTransform="uppercase" letterSpacing={1} mb="$1">New This Month</Text>
                                <Text fontSize="$7" fontWeight="bold" color="white">{leadsThisMonth}</Text>
                            </Card>
                        </XStack>

                        <YStack mb="$6">
                            <XStack ai="center" jc="space-between" mb="$4">
                                <XStack ai="center" gap="$2">
                                    <Activity size={18} color="#FFC107" />
                                    <Text fontSize="$6" fontWeight="bold" color="white" letterSpacing={-0.5}>Recent Deals</Text>
                                </XStack>
                                <TouchableOpacity onPress={onViewAll} style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                                    <Text color="#FFC107" fontSize="$1" fontWeight="900" textTransform="uppercase" letterSpacing={1}>View History</Text>
                                </TouchableOpacity>
                            </XStack>

                            <Card bg="#121212" br="$5" bordered borderColor="rgba(255,255,255,0.05)" overflow="hidden">
                                {leads.slice(0, 3).map((lead, idx) => (
                                    <TouchableOpacity
                                        key={lead.id}
                                        onPress={() => onCustomerPress(lead)}
                                        activeOpacity={0.7}
                                    >
                                        <XStack p="$4" ai="center" jc="space-between" borderBottomWidth={idx !== 2 ? 1 : 0} borderBottomColor="rgba(255,255,255,0.05)">
                                            <XStack ai="center" gap="$3">
                                                <Circle size="$4" bg="#2A2A2A" bordered borderColor="rgba(255,255,255,0.05)">
                                                    <Text color="white" fontWeight="bold">{lead.name.charAt(0)}</Text>
                                                </Circle>
                                                <YStack>
                                                    <Text color="white" fontWeight="600" fontSize="$4">{lead.name}</Text>
                                                    <Text color="$color10" fontSize="$2" fontWeight="500" letterSpacing={0.5}>Status: {lead.status}</Text>
                                                </YStack>
                                            </XStack>
                                            <YStack ai="flex-end">
                                                <Text color="#FFC107" fontWeight="bold" fontSize="$4">{formatCurrency(lead.value)}</Text>
                                                <ChevronRight size={14} color="#475569" />
                                            </YStack>
                                        </XStack>
                                    </TouchableOpacity>
                                ))}
                            </Card>
                        </YStack>

                        {/* Team Chat Preview */}
                        <YStack mb="$10">
                            <XStack ai="center" jc="space-between" mb="$4">
                                <XStack ai="center" gap="$2">
                                    <Users size={18} color="#FFC107" />
                                    <Text fontSize="$6" fontWeight="bold" color="white" letterSpacing={-0.5}>Team Activity</Text>
                                </XStack>
                                <XStack bg="rgba(34, 197, 94, 0.1)" px="$2" py="$1" br="$3" ai="center" gap="$2" borderColor="rgba(34, 197, 94, 0.2)" borderWidth={1}>
                                    <Circle size="$1" bg="#22c55e" />
                                    <Text color="#22c55e" fontSize="$1" fontWeight="900" textTransform="uppercase" letterSpacing={1}>12 Live</Text>
                                </XStack>
                            </XStack>

                            <TouchableOpacity
                                onPress={onOpenChat}
                                activeOpacity={0.9}
                            >
                                <Card bg="#121212" br="$5" bordered borderColor="rgba(255,255,255,0.05)" overflow="hidden">
                                    <YStack p="$4" gap="$3">
                                        <XStack gap="$2.5">
                                            <TamaguiView w={28} h={28} br="$2" bg="#2A2A2A" borderColor="rgba(255,255,255,0.1)" borderWidth={1} overflow="hidden">
                                                <Image source={{ uri: 'https://i.pravatar.cc/150?u=sarah' }} style={{ width: '100%', height: '100%' }} />
                                            </TamaguiView>
                                            <TamaguiView bg="rgba(255,255,255,0.05)" p="$3" br="$3" borderTopLeftRadius={0} borderColor="rgba(255,255,255,0.05)" borderWidth={1} f={1}>
                                                <Text color="#E2E8F0" fontSize="$2" lineHeight="$3">
                                                    <Text fontWeight="bold" color="white">Sarah Jenkins:</Text> Just closed Acme deal! 🚀
                                                </Text>
                                            </TamaguiView>
                                        </XStack>

                                        <XStack gap="$2.5">
                                            <TamaguiView w={28} h={28} br="$2" bg="#FFC107" ai="center" jc="center">
                                                <Text fontSize={9} fontWeight="900" color="black">ME</Text>
                                            </TamaguiView>
                                            <TamaguiView bg="rgba(255, 193, 7, 0.05)" p="$3" br="$3" borderTopLeftRadius={0} borderColor="rgba(255, 193, 7, 0.1)" borderWidth={1} f={1}>
                                                <Text color="#FFC107" fontSize="$2" fontWeight="500" lineHeight="$3">Amazing work Sarah!</Text>
                                            </TamaguiView>
                                        </XStack>
                                    </YStack>

                                    <XStack py="$3" ai="center" jc="center" bg="rgba(255,255,255,0.05)" borderTopWidth={1} borderTopColor="rgba(255,255,255,0.05)" gap="$2">
                                        <MessageSquare size={12} color="#FFC107" />
                                        <Text color="#FFC107" fontSize="$2" fontWeight="900" textTransform="uppercase" letterSpacing={1}>Open Floor</Text>
                                    </XStack>
                                </Card>
                            </TouchableOpacity>
                        </YStack>

                    </Animated.View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
