import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Trash2,
    Database,
    BarChart3,
    Cpu,
    Users,
    Share2,
    ShieldCheck,
    Zap,
    ChevronRight,
    Trophy
} from 'lucide-react-native';
import { Header } from './Header';
import { ComingSoon } from './ComingSoon';

interface SettingsProps {
    onSeedData?: () => void;
    onResetData?: () => void;
    onCalendarPress?: () => void;
}

export function Settings({ onSeedData, onResetData, onCalendarPress }: SettingsProps) {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const handleSeedData = () => {
        Alert.alert(
            "Seed Demo Data",
            "This will clear existing data and add sample leads and sales. Continue?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Seed Data",
                    style: "destructive",
                    onPress: () => onSeedData?.()
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
                    onPress: () => onResetData?.()
                }
            ]
        );
    };

    if (activeTool) {
        return <ComingSoon title={activeTool} onBack={() => setActiveTool(null)} />;
    }

    return (
        <SafeAreaView className="flex-1 bg-brand-black" edges={['top']}>
            <Header onCalendarPress={onCalendarPress} />
            <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <Text className="text-3xl font-black text-white tracking-tight mb-2">Tools</Text>
                    <Text className="text-slate-500 text-xs font-medium">Power up your sales workflow</Text>
                </View>

                {/* Main Tools Container */}
                <View className="mb-8">
                    <Text className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest">Analytics & AI</Text>
                    <ToolItem
                        icon={BarChart3}
                        title="Advanced Reports"
                        subtitle="Deep Performance Insights"
                        color="#FFC107"
                        onPress={() => setActiveTool('Advanced Reports')}
                    />
                    <ToolItem
                        icon={Cpu}
                        title="AI Lead Scorer"
                        subtitle="Intelligent prioritization"
                        color="#3b82f6"
                        onPress={() => setActiveTool('AI Lead Scorer')}
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest">Growth</Text>
                    <ToolItem
                        icon={Trophy}
                        title="Sales Leaderboard"
                        subtitle="Team gamification"
                        color="#22c55e"
                        onPress={() => setActiveTool('Sales Leaderboard')}
                    />
                    <ToolItem
                        icon={Zap}
                        title="Automation Flows"
                        subtitle="Workflow optimization"
                        color="#a855f7"
                        onPress={() => setActiveTool('Automation Flows')}
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest">System</Text>
                    <ToolItem
                        icon={Share2}
                        title="Integrations"
                        subtitle="Connect your stack"
                        color="#ec4899"
                        onPress={() => setActiveTool('Integrations')}
                    />
                    <ToolItem
                        icon={ShieldCheck}
                        title="Security Audit"
                        subtitle="Data & Access Logs"
                        color="#64748b"
                        onPress={() => setActiveTool('Security Audit')}
                    />
                </View>

                {/* Developer Tools (Old Settings) */}
                <View className="mb-12">
                    <Text className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest">Developer Tools</Text>
                    <View className="bg-red-500/5 rounded-2xl border border-red-500/10 overflow-hidden">
                        <TouchableOpacity
                            className="flex-row items-center gap-3 p-4 border-b border-red-500/10"
                            onPress={handleSeedData}
                        >
                            <Database size={18} color="#ef4444" />
                            <Text className="font-bold text-red-500/80 text-sm">Seed Demo Data</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center gap-3 p-4"
                            onPress={handleResetData}
                        >
                            <Trash2 size={18} color="#ef4444" />
                            <Text className="font-bold text-red-500/80 text-sm">Reset Database</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* App Info */}
                <View className="items-center pb-8">
                    <Text className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Sales Expert CRM • v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const ToolItem = ({ icon: Icon, title, subtitle, color, onPress }: any) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-row items-center gap-4 p-4 bg-white/5 mb-3 rounded-2xl border border-white/5"
    >
        <View className="w-10 h-10 rounded-xl items-center justify-center border border-white/5" style={{ backgroundColor: `${color}1A` }}>
            <Icon size={20} color={color} />
        </View>
        <View className="flex-1">
            <Text className="text-white font-bold text-sm tracking-tight">{title}</Text>
            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">{subtitle}</Text>
        </View>
        <ChevronRight size={16} color="#475569" />
    </TouchableOpacity>
);
