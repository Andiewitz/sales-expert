import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {
    CheckCircle2,
    XCircle,
    X,
    Trash2,
    Edit3,
    Phone,
    Mail,
    ChevronRight,
    Share2
} from 'lucide-react-native';
import { Lead } from '../types';
import { BottomSheet } from './BottomSheet';

interface LeadContextMenuProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead | null;
    onMarkWon: (lead: Lead) => void;
    onMarkLost: (lead: Lead) => void;
    onDelete: (lead: Lead) => void;
    onEdit: (lead: Lead) => void;
    onCall?: (phone: string) => void;
    onEmail?: (email: string) => void;
}

export const LeadContextMenu: React.FC<LeadContextMenuProps> = ({
    isOpen,
    onClose,
    lead,
    onMarkWon,
    onMarkLost,
    onDelete,
    onEdit,
    onCall,
    onEmail
}) => {
    if (!lead) return null;

    const MenuButton = ({
        icon: Icon,
        label,
        onPress,
        color = "white",
        bgColor = "bg-white/5",
        textColor = "text-white",
        subtitle = ""
    }: any) => (
        <TouchableOpacity
            onPress={() => {
                onPress();
                onClose();
            }}
            className={`flex-row items-center justify-between p-4 mb-2 rounded-2xl ${bgColor} border border-white/5`}
        >
            <View className="flex-row items-center gap-4">
                <View className="p-2 rounded-xl bg-black/20">
                    <Icon size={20} color={color} />
                </View>
                <View>
                    <Text className={`font-bold text-sm ${textColor}`}>{label}</Text>
                    {subtitle ? <Text className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{subtitle}</Text> : null}
                </View>
            </View>
            <ChevronRight size={16} color="#475569" />
        </TouchableOpacity>
    );

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <View className="px-6 pb-12 pt-6">
                {/* Header with Close */}
                <View className="flex-row items-start justify-between mb-6">
                    <View>
                        <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Lead Options</Text>
                        <Text className="text-white text-2xl font-black">{lead.name}</Text>
                        <Text className="text-brand-gold text-xs font-bold">{lead.businessName || 'Independent Lead'}</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} className="bg-white/5 p-2 rounded-full border border-white/5">
                        <X size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <View className="flex-row gap-2 mb-6">
                    <TouchableOpacity
                        onPress={() => lead.phone && onCall?.(lead.phone)}
                        className="flex-1 bg-white/5 p-4 rounded-2xl items-center border border-white/5"
                    >
                        <Phone size={20} color="#FFC107" />
                        <Text className="text-white text-[10px] font-black mt-2 uppercase">Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => lead.email && onEmail?.(lead.email)}
                        className="flex-1 bg-white/5 p-4 rounded-2xl items-center border border-white/5"
                    >
                        <Mail size={20} color="#FFC107" />
                        <Text className="text-white text-[10px] font-black mt-2 uppercase">Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-white/5 p-4 rounded-2xl items-center border border-white/5">
                        <Share2 size={20} color="#FFC107" />
                        <Text className="text-white text-[10px] font-black mt-2 uppercase">Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Menu */}
                <MenuButton
                    icon={CheckCircle2}
                    label="Mark as Won"
                    subtitle="Convert to Active Sale"
                    color="#22c55e"
                    bgColor="bg-green-500/10"
                    onPress={() => onMarkWon(lead)}
                />
                <MenuButton
                    icon={XCircle}
                    label="Mark as Lost"
                    subtitle="Archive from Pipeline"
                    color="#ef4444"
                    bgColor="bg-red-500/10"
                    onPress={() => onMarkLost(lead)}
                />
                <MenuButton
                    icon={Edit3}
                    label="Edit Details"
                    onPress={() => onEdit(lead)}
                />
                <MenuButton
                    icon={Trash2}
                    label="Delete Lead"
                    subtitle="Permanent Removal"
                    color="#ef4444"
                    textColor="text-red-500"
                    onPress={() => onDelete(lead)}
                />

                <TouchableOpacity
                    onPress={onClose}
                    className="mt-4 p-4 items-center"
                >
                    <Text className="text-slate-500 font-black uppercase tracking-widest text-xs">Cancel</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
};
