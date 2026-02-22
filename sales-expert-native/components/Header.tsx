import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { User, Bell, Building2, Users, UserCircle, Settings, Calendar } from 'lucide-react-native';

interface HeaderProps {
    onProfilePress?: () => void;
    onSettingsPress?: () => void;
    onCalendarPress?: () => void;
    extraActions?: React.ReactNode;
    hideSubNav?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onProfilePress, onSettingsPress, onCalendarPress, extraActions, hideSubNav = false }) => {
    return (
        <View className="bg-brand-black/90 pt-4 pb-2 border-b border-white/10 px-4">
            <View className="flex-row items-center justify-between mb-6">
                {/* Logo/Brand - Explicit Left Align */}
                <View className="-ml-2">
                    <Image
                        source={require('../assets/476482802_1030999202195582_7347365316891957894_n.png')}
                        style={{ width: 140, height: 40 }}
                        resizeMode="contain"
                    />
                </View>

                {/* Right Side Icons */}
                <View className="flex-row items-center gap-4">
                    {extraActions}
                    <TouchableOpacity onPress={onCalendarPress}>
                        <Calendar size={22} color="#94a3b8" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Bell size={22} color="#94a3b8" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSettingsPress}>
                        <Settings size={22} color="#94a3b8" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onProfilePress}
                        className="bg-brand-gold w-9 h-9 rounded-full items-center justify-center ring-2 ring-brand-gold/20"
                    >
                        <Text className="text-black font-extrabold text-xs">JD</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sub-navigation */}
            {!hideSubNav && (
                <View className="flex-row justify-between items-center px-2 pb-2">
                    <TouchableOpacity className="items-center gap-1">
                        <Building2 size={18} color="#FFC107" />
                        <Text className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Company</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center gap-1">
                        <Users size={18} color="#94a3b8" />
                        <Text className="text-[10px] font-black uppercase tracking-widest text-slate-500">Team</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center gap-1">
                        <UserCircle size={18} color="#94a3b8" />
                        <Text className="text-[10px] font-black uppercase tracking-widest text-slate-500">Account</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};
