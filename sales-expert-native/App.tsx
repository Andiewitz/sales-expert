import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, Alert, StatusBar, Dimensions, Animated, LayoutAnimation, Platform, UIManager, Linking, Image } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { dbService } from './services/db';
import { ExportService } from './services/export';
import { Logger } from './services/logger';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { AddSaleModal } from './components/AddSaleModal';
import { AddLeadModal } from './components/AddLeadModal';
import { LeadsList } from './components/LeadsList';
import { TeamChat } from './components/TeamChat';
import { LeadContextMenu } from './components/LeadContextMenu';
import { EditLeadModal } from './components/EditLeadModal';
import { SettingsModal } from './components/SettingsModal';
import { CalendarModal } from './components/CalendarModal';
import { Sale, Lead, DashboardStats } from './types';
import { Home, Plus, Users, DollarSign, Settings as SettingsIcon, Wrench } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default function App() {
    const [isDbReady, setIsDbReady] = useState(false);
    const [isAppReady, setIsAppReady] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const splashFade = useRef(new Animated.Value(1)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const contentScale = useRef(new Animated.Value(0.98)).current;
    const translateY = useRef(new Animated.Value(10)).current;

    useEffect(() => {
        if (isAppReady && isDbReady) {
            Animated.parallel([
                Animated.timing(splashFade, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    delay: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(contentScale, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    delay: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 800,
                    delay: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isAppReady, isDbReady]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [leadStats, setLeadStats] = useState({ total: 0, won: 0, lost: 0, active: 0, pipelineValue: 0, conversionRate: 0 });

    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isLeadMenuOpen, setIsLeadMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                // DB Init
                await dbService.init();
                await refreshData();
                setIsDbReady(true);
            } catch (e) {
                Logger.error("DB Init failed", e);
                setIsDbReady(true);
            }
        };
        init();

        // Premium Logo Animation Loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(logoScale, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(logoScale, {
                    toValue: 0.8,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Artificial delay for splash feel
        const timer = setTimeout(() => {
            setIsAppReady(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const refreshData = async () => {
        setIsLoadingData(true);
        try {
            const [salesData, leadsData, stats] = await Promise.all([
                dbService.getSales(),
                dbService.getLeads(),
                dbService.getLeadStatistics()
            ]);
            setSales(salesData);
            setLeads(leadsData);
            setLeadStats(stats);
        } finally {
            // Small delay for smooth transition even if DB is instant
            setTimeout(() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setIsLoadingData(false);
            }, 800);
        }
    };

    const handleAddSale = async (description: string, amount: number, date: string) => {
        try {
            await dbService.addSale(description, amount, date);
            await refreshData();
            setIsSaleModalOpen(false);
            Toast.show({ type: 'success', text1: 'Sale Recorded!', text2: 'Great job closing that deal.' });
        } catch (e) {
            Logger.error('Failed to add sale', e);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Could not save sale.' });
        }
    };

    const handleAddLead = async (
        name: string,
        value: number,
        status: string,
        notes: string,
        email?: string,
        phone?: string,
        businessName?: string,
        address?: string
    ) => {
        try {
            await dbService.addLead(name, value, status, notes, email, phone, businessName, address);
            await refreshData();
            setIsLeadModalOpen(false);
            Toast.show({ type: 'success', text1: 'Lead Added', text2: `${name} is in the pipeline.` });
        } catch (e) {
            Logger.error('Failed to add lead', e);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Could not save lead.' });
        }
    };

    const handleAddButtonPress = () => {
        setIsLeadModalOpen(true);
    };

    const handleSeedData = async () => {
        try {
            await dbService.seedDummyData();
            await refreshData();
            Toast.show({ type: 'success', text1: 'Demo Data Loaded', text2: '60+ records generated across 6 months!' });
        } catch (e) {
            Logger.error('Failed to seed data', e);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Could not seed data.' });
        }
    };

    const handleResetDatabase = async () => {
        try {
            await dbService.resetDatabase();
            await refreshData();
            Toast.show({ type: 'success', text1: 'Database Reset', text2: 'All records have been cleared.' });
        } catch (e) {
            Logger.error('Failed to reset db', e);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Could not reset database.' });
        }
    };

    const handleLeadPress = useCallback((lead: Lead) => {
        setSelectedLead(lead);
        setIsLeadMenuOpen(true);
    }, []);

    const handleMarkWon = useCallback(async (lead: Lead) => {
        await dbService.updateLeadStatus(lead.id, 'Won');
        await dbService.addSale(`Converted Lead: ${lead.name}`, lead.value, new Date().toISOString());
        await refreshData();
        Toast.show({ type: 'success', text1: 'Lead Won!', text2: 'Sale created automatically.' });
    }, []);

    const handleMarkLost = useCallback(async (lead: Lead) => {
        await dbService.updateLeadStatus(lead.id, 'Lost');
        await refreshData();
        Toast.show({ type: 'info', text1: 'Lead Marked Lost', text2: 'Better luck next time.' });
    }, []);

    const handleUpdateLead = useCallback(async (updatedLead: Lead) => {
        try {
            await dbService.updateLead(updatedLead);
            await refreshData();
            setIsEditModalOpen(false);
            Toast.show({ type: 'success', text1: 'Lead Updated', text2: 'Information saved successfully.' });
        } catch (e) {
            Logger.error('Failed to update lead', e);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Could not update lead.' });
        }
    }, []);

    const handleDeleteLead = (lead: Lead) => {
        Alert.alert(
            "Delete Lead",
            `Are you sure you want to delete ${lead.name}? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await dbService.deleteLead(lead.id);
                        await refreshData();
                        Toast.show({ type: 'success', text1: 'Lead Deleted', text2: 'Lead removed from pipeline.' });
                    }
                }
            ]
        );
    };

    const handleExportLeads = async () => {
        try {
            if (leads.length === 0) {
                Toast.show({ type: 'info', text1: 'No Data', text2: 'Add some leads first to export.' });
                return;
            }
            await ExportService.exportLeadsToExcel(leads);
            Toast.show({ type: 'success', text1: 'Export Complete', text2: 'Lead pipeline exported successfully.' });
        } catch (e) {
            Logger.error('Export Failed', e);
            Toast.show({ type: 'error', text1: 'Export Failed', text2: 'Could not generate Excel file.' });
        }
    };

    const handleExportSales = async () => {
        try {
            if (sales.length === 0) {
                Toast.show({ type: 'info', text1: 'No Data', text2: 'No sales history to export yet.' });
                return;
            }
            await ExportService.exportSalesToExcel(sales);
            Toast.show({ type: 'success', text1: 'Export Complete', text2: 'Sales history exported successfully.' });
        } catch (e) {
            Logger.error('Export Failed', e);
            Toast.show({ type: 'error', text1: 'Export Failed', text2: 'Could not generate Excel file.' });
        }
    };

    const stats: DashboardStats = useMemo(() => {
        const revenue = sales.reduce((acc, curr) => acc + curr.amount, 0);
        return {
            totalRevenue: revenue,
            totalTransactions: sales.length,
            monthlyGrowth: 12.5,
            recentSales: sales
        };
    }, [sales]);

    if (!isDbReady || !isAppReady) {
        return (
            <View className="flex-1 bg-black items-center justify-center">
                <StatusBar hidden />
                <Animated.View style={{ opacity: splashFade, transform: [{ scale: logoScale }] }}>
                    <Image
                        source={require('./assets/476482802_1030999202195582_7347365316891957894_n.png')}
                        style={{ width: 220, height: 100 }}
                        resizeMode="contain"
                    />
                </Animated.View>
                {!isDbReady && (
                    <View className="absolute bottom-20">
                        <ActivityIndicator size="small" color="#FFC107" />
                        <Text className="text-brand-gold text-[8px] font-black uppercase tracking-widest mt-2 text-center">Initializing Vault</Text>
                    </View>
                )}
            </View>
        );
    }

    const handleSaleDelete = (sale: Sale) => {
        Alert.alert(
            "Delete Transaction",
            `Are you sure you want to delete this $${sale.amount.toLocaleString()} transaction?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await dbService.deleteSale(sale.id);
                        await refreshData();
                        Toast.show({ type: 'success', text1: 'Transaction Deleted', text2: 'History updated.' });
                    }
                }
            ]
        );
    };

    const iconColor = '#94a3b8';
    const activeIconColor = '#FFC107';

    return (
        <SafeAreaProvider style={{ backgroundColor: '#000000' }}>
            <Animated.View
                className="flex-1 bg-black"
                style={{
                    opacity: fadeAnim,
                    transform: [
                        { scale: contentScale },
                        { translateY: translateY }
                    ]
                }}
            >
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                <NavigationContainer theme={DarkTheme}>
                    <Tab.Navigator
                        screenOptions={{
                            headerShown: false,
                            animation: 'fade', // Smooth transition between tabs
                            tabBarStyle: {
                                backgroundColor: '#121212', // Pure black for deep contrast
                                borderTopWidth: 1,
                                borderTopColor: 'rgba(255,255,255,0.05)',
                                height: 70,
                                paddingBottom: 12,
                                paddingTop: 12,
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                            tabBarActiveTintColor: activeIconColor,
                            tabBarInactiveTintColor: iconColor,
                            tabBarLabelStyle: {
                                fontSize: 10,
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: 1.2,
                            }
                        }}
                    >
                        <Tab.Screen
                            name="Dashboard"
                            options={{
                                tabBarIcon: ({ color }) => <Home color={color} size={20} />,
                                tabBarLabel: "Home"
                            }}
                        >
                            {(props) => (
                                <Dashboard
                                    stats={stats}
                                    leads={leads}
                                    onViewAll={() => props.navigation.navigate('Sales')}
                                    onCustomerPress={handleLeadPress}
                                    onOpenChat={() => setIsChatOpen(true)}
                                    onSettingsPress={() => setIsSettingsOpen(true)}
                                    onCalendarPress={() => setIsCalendarOpen(true)}
                                    isLoading={isLoadingData}
                                />
                            )}
                        </Tab.Screen>

                        <Tab.Screen
                            name="Leads"
                            options={{
                                tabBarIcon: ({ color }) => <Users color={color} size={20} />,
                                tabBarLabel: "Leads"
                            }}
                        >
                            {(props) => (
                                <LeadsList
                                    leads={leads}
                                    onLeadPress={handleLeadPress}
                                    onAddPress={() => setIsLeadModalOpen(true)}
                                    onSettingsPress={() => setIsSettingsOpen(true)}
                                    onCalendarPress={() => setIsCalendarOpen(true)}
                                    onExport={handleExportLeads}
                                    statistics={leadStats}
                                    isLoading={isLoadingData}
                                />
                            )}
                        </Tab.Screen>

                        <Tab.Screen
                            name="Add"
                            component={View}
                            listeners={{
                                tabPress: (e) => {
                                    e.preventDefault();
                                    handleAddButtonPress();
                                },
                            }}
                            options={{
                                tabBarIcon: () => (
                                    <View className="bg-brand-gold h-12 w-12 rounded-full -mt-6 items-center justify-center shadow-lg border-2 border-brand-black">
                                        <Plus color="black" size={24} />
                                    </View>
                                ),
                                tabBarLabel: () => null,
                            }}
                        />

                        <Tab.Screen
                            name="Sales"
                            options={{
                                tabBarIcon: ({ color }) => <DollarSign color={color} size={20} />,
                                tabBarLabel: "Sales"
                            }}
                        >
                            {(props) => (
                                <History
                                    sales={sales}
                                    onBack={() => props.navigation.navigate('Dashboard')}
                                    onSettingsPress={() => setIsSettingsOpen(true)}
                                    onCalendarPress={() => setIsCalendarOpen(true)}
                                    onExport={handleExportSales}
                                    onDeleteSale={handleSaleDelete}
                                    isLoading={isLoadingData}
                                />
                            )}
                        </Tab.Screen>

                        <Tab.Screen
                            name="Tools"
                            options={{
                                tabBarIcon: ({ color }) => <Wrench color={color} size={20} />,
                                tabBarLabel: "Tools"
                            }}
                        >
                            {() => <Settings onSeedData={handleSeedData} onResetData={handleResetDatabase} onCalendarPress={() => setIsCalendarOpen(true)} />}
                        </Tab.Screen>
                    </Tab.Navigator>
                </NavigationContainer>

                <AddSaleModal
                    isOpen={isSaleModalOpen}
                    onClose={() => setIsSaleModalOpen(false)}
                    onSubmit={handleAddSale}
                />

                <AddLeadModal
                    isOpen={isLeadModalOpen}
                    onClose={() => setIsLeadModalOpen(false)}
                    onSubmit={handleAddLead}
                />

                <TeamChat
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                />

                <LeadContextMenu
                    isOpen={isLeadMenuOpen}
                    onClose={() => setIsLeadMenuOpen(false)}
                    lead={selectedLead}
                    onMarkWon={handleMarkWon}
                    onMarkLost={handleMarkLost}
                    onDelete={handleDeleteLead}
                    onEdit={(lead) => {
                        setIsLeadMenuOpen(false);
                        setTimeout(() => {
                            setSelectedLead(lead);
                            setIsEditModalOpen(true);
                        }, 300);
                    }}
                    onCall={(phone) => Linking.openURL(`tel:${phone}`)}
                    onEmail={(email) => Linking.openURL(`mailto:${email}`)}
                />

                <EditLeadModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    lead={selectedLead}
                    onSubmit={handleUpdateLead}
                />

                <CalendarModal
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                    leads={leads}
                    onLeadPress={handleLeadPress}
                />

                <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    onSeedData={handleSeedData}
                    onResetData={handleResetDatabase}
                />

                <Toast />
            </Animated.View>
        </SafeAreaProvider>
    );
}
