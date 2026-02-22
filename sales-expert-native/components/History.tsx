import React, { useMemo } from 'react';
import { View, Text, FlatList, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sale } from '../types';
import {
    DollarSign,
    TrendingUp,
    Activity,
    Calendar,
    ArrowLeft,
    Download
} from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { Header } from './Header';
import { HistorySkeleton } from './Skeleton';

const screenWidth = Dimensions.get("window").width;

interface HistoryProps {
    sales: Sale[];
    onBack?: () => void;
    onSettingsPress?: () => void;
    onCalendarPress?: () => void;
    onExport?: () => void;
    onDeleteSale: (sale: Sale) => void;
    isLoading?: boolean;
}

export function History({ sales, onBack, onSettingsPress, onCalendarPress, onExport, onDeleteSale, isLoading }: HistoryProps) {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const averageSale = sales.length > 0 ? totalRevenue / sales.length : 0;
    const transactionCount = sales.length;

    // Chart Data Preparation (borrowed from Dashboard for consistency)
    const { chartData, chartLabels } = useMemo(() => {
        const monthlyData: { [key: string]: number } = {};
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        const now = new Date();
        const labels: string[] = [];
        // Show last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = months[d.getMonth()];
            labels.push(label);
            monthlyData[label] = 0;
        }

        sales.forEach(sale => {
            const saleDate = new Date(sale.date);
            const label = months[saleDate.getMonth()];
            if (monthlyData[label] !== undefined) {
                monthlyData[label] += sale.amount;
            }
        });

        const dataPoints = labels.map(l => (monthlyData[l] || 0) / 1000);

        return {
            chartData: dataPoints,
            chartLabels: labels
        };
    }, [sales]);

    const renderItem = ({ item }: { item: Sale }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onLongPress={() => onDeleteSale(item)}
            className="bg-[#121212] p-4 rounded-xl border border-white/5 flex-row items-center justify-between mb-3 mx-4"
        >
            <View className="flex-row items-center gap-3 flex-1">
                <View className="bg-green-500/10 p-2 rounded-lg">
                    <DollarSign size={16} color="#22c55e" />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-bold text-sm mb-0.5 tracking-tight">{item.description}</Text>
                    <Text className="text-slate-500 text-[10px] font-medium">
                        {new Date(item.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </Text>
                </View>
            </View>
            <View className="items-end">
                <Text className="text-brand-gold font-extrabold text-base">+${item.amount.toLocaleString()}</Text>
                <Text className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">Cleared</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-brand-black" edges={['top']}>
            <Header
                onSettingsPress={onSettingsPress}
                onCalendarPress={onCalendarPress}
                extraActions={
                    <TouchableOpacity onPress={onExport} className="p-1">
                        <Download size={22} color="#94a3b8" />
                    </TouchableOpacity>
                }
            />

            {/* Header Area */}
            <View className="px-4 py-3 border-b border-white/5 bg-brand-black/80">
                <Text className="text-2xl font-black text-white mb-1 tracking-tight">Sales History</Text>
                <Text className="text-slate-600 text-xs font-medium">Performance tracking & analytics</Text>
            </View>

            {isLoading ? (
                <HistorySkeleton />
            ) : (
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Main Revenue Chart */}
                    <View className="mt-6 mb-8 bg-brand-black p-4">
                        <View className="flex-row items-center justify-between mb-4 px-2">
                            <View>
                                <Text className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Growth Curve</Text>
                                <Text className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</Text>
                            </View>
                            <View className="bg-[#1A1A1A] px-3 py-1.5 rounded-full border border-white/10 flex-row items-center gap-1.5">
                                <Activity size={12} color="#FFC107" />
                                <Text className="text-[10px] font-black text-white uppercase tracking-widest">6 Month View</Text>
                            </View>
                        </View>

                        <LineChart
                            data={{
                                labels: chartLabels,
                                datasets: [{ data: chartData }]
                            }}
                            width={screenWidth - 32}
                            height={200}
                            withDots={true}
                            withInnerLines={false}
                            withOuterLines={false}
                            withVerticalLines={false}
                            withHorizontalLines={false}
                            withShadow={true}
                            bezier
                            chartConfig={{
                                backgroundColor: "transparent",
                                backgroundGradientFrom: "#000000",
                                backgroundGradientTo: "#000000",
                                backgroundGradientFromOpacity: 0,
                                backgroundGradientToOpacity: 0,
                                decimalPlaces: 1,
                                color: (opacity = 1) => `rgba(249, 208, 6, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.4})`,
                                propsForDots: {
                                    r: "4",
                                    strokeWidth: "2",
                                    stroke: "#1a1a1a"
                                },
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                marginLeft: -10
                            }}
                        />
                    </View>

                    {/* Performance Grid */}
                    <View className="flex-row gap-3 px-4 mb-6">
                        <View className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5">
                            <Text className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Closed</Text>
                            <Text className="text-xl font-bold text-white">{transactionCount}</Text>
                        </View>
                        <View className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5">
                            <Text className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Avg Deal</Text>
                            <Text className="text-xl font-bold text-white">${(averageSale / 1000).toFixed(1)}k</Text>
                        </View>
                    </View>

                    {/* Section Header */}
                    <View className="flex-row items-center gap-2 px-5 mb-4">
                        <View className="h-4 w-1 bg-brand-gold rounded-full" />
                        <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Transactions</Text>
                    </View>

                    {/* Transactions List */}
                    {sales.length > 0 ? (
                        sales.slice().reverse().map(sale => (
                            <View key={sale.id}>
                                {renderItem({ item: sale })}
                            </View>
                        ))
                    ) : (
                        <View className="items-center justify-center py-10">
                            <Text className="text-slate-600 text-sm">No sales records yet.</Text>
                        </View>
                    )}

                    {/* Bottom Padding for Tabs */}
                    <View className="h-24" />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
