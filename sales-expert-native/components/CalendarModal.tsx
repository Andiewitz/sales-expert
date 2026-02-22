import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { X, Calendar as CalendarIcon, User } from 'lucide-react-native';
import { BottomSheet } from './BottomSheet';
import { Lead } from '../types';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    leads: Lead[];
    onLeadPress: (lead: Lead) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, leads, onLeadPress }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const markedDates = useMemo(() => {
        const marks: any = {};
        leads.forEach(lead => {
            const date = new Date(lead.createdAt).toISOString().split('T')[0];
            if (!marks[date]) {
                marks[date] = {
                    marked: true,
                    dotColor: '#FFC107',
                    customStyles: {
                        container: {
                            backgroundColor: 'rgba(255, 193, 7, 0.1)',
                            borderRadius: 8
                        },
                        text: {
                            color: '#FFC107',
                            fontWeight: 'bold'
                        }
                    }
                };
            }
        });

        // Highlight selected date
        marks[selectedDate] = {
            ...marks[selectedDate],
            selected: true,
            selectedColor: '#FFC107',
            selectedTextColor: 'black'
        };

        return marks;
    }, [leads, selectedDate]);

    const leadsForSelectedDate = useMemo(() => {
        return leads.filter(lead => {
            return new Date(lead.createdAt).toISOString().split('T')[0] === selectedDate;
        });
    }, [leads, selectedDate]);

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <View className="pt-2 pb-6 px-4">
                <View className="flex-row items-center justify-between mb-4 px-2">
                    <View>
                        <Text className="text-xl font-bold text-white tracking-tight">Sales Calendar</Text>
                        <Text className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">Lead Acquisition Timeline</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} className="bg-white/5 p-1.5 rounded-full">
                        <X size={18} color="#64748b" />
                    </TouchableOpacity>
                </View>

                <View className="bg-[#121212] rounded-2xl overflow-hidden border border-white/5 mb-4">
                    <Calendar
                        theme={{
                            backgroundColor: '#121212',
                            calendarBackground: '#121212',
                            textSectionTitleColor: '#64748b',
                            selectedDayBackgroundColor: '#FFC107',
                            selectedDayTextColor: '#000',
                            todayTextColor: '#FFC107',
                            dayTextColor: '#fff',
                            textDisabledColor: '#334155',
                            dotColor: '#FFC107',
                            selectedDotColor: '#000',
                            arrowColor: '#FFC107',
                            monthTextColor: '#fff',
                            indicatorColor: '#FFC107',
                            textDayFontWeight: '600',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: 'bold',
                            textDayFontSize: 14,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 12
                        }}
                        onDayPress={(day: any) => setSelectedDate(day.dateString)}
                        markedDates={markedDates}
                        markingType={'custom'}
                    />
                </View>

                <View className="px-2">
                    <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">
                        Leads for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>

                    {leadsForSelectedDate.length > 0 ? (
                        <ScrollView className="max-h-48" showsVerticalScrollIndicator={false}>
                            {leadsForSelectedDate.map((lead) => (
                                <TouchableOpacity
                                    key={lead.id}
                                    onPress={() => {
                                        onLeadPress(lead);
                                        onClose();
                                    }}
                                    className="flex-row items-center justify-between bg-white/5 p-3 rounded-xl mb-2 border border-white/5"
                                >
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-8 h-8 rounded-full bg-brand-gold/10 items-center justify-center">
                                            <User size={14} color="#FFC107" />
                                        </View>
                                        <View>
                                            <Text className="text-white font-bold text-sm">{lead.name}</Text>
                                            <Text className="text-slate-500 text-[10px] uppercase font-bold">{lead.businessName || 'Independent'}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <View className="bg-white/5 p-6 rounded-2xl items-center border border-dashed border-white/10">
                            <Text className="text-slate-500 text-xs font-medium">No leads captured on this date.</Text>
                        </View>
                    )}
                </View>
            </View>
        </BottomSheet>
    );
};
