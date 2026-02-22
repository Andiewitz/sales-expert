import React, { useEffect, useRef } from 'react';
import { View, Animated, ScrollView, DimensionValue } from 'react-native';

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius = 8, className }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.sequence([
            Animated.timing(opacity, {
                toValue: 0.7,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0.3,
                duration: 800,
                useNativeDriver: true,
            }),
        ]);

        Animated.loop(pulse).start();
    }, [opacity]);

    return (
        <Animated.View
            className={className}
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: '#262626', // dark slate
                    opacity,
                },
            ]}
        />
    );
};

export const DashboardSkeleton = () => (
    <View className="flex-1 px-4 py-4">
        {/* Shimmering Hero */}
        <Skeleton height={180} className="w-full mb-6" borderRadius={24} />

        {/* Shimmering Grid */}
        <View className="flex-row gap-4 mb-6">
            <Skeleton height={100} className="flex-1" borderRadius={20} />
            <Skeleton height={100} className="flex-1" borderRadius={20} />
        </View>

        {/* Shimmering Status Bar */}
        <Skeleton height={50} className="w-full mb-8" borderRadius={16} />

        {/* Shimmering List */}
        <View className="flex-row justify-between mb-5">
            <Skeleton width={120} height={24} />
            <Skeleton width={80} height={20} />
        </View>

        <View className="gap-3">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} height={70} className="w-full" borderRadius={16} />
            ))}
        </View>
    </View>
);

export const LeadsSkeleton = () => (
    <View className="flex-1 px-4 py-4">
        {/* Filter Tabs Skeleton */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} width={80} height={35} className="mr-3" borderRadius={20} />
            ))}
        </ScrollView>

        <View className="gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={120} className="w-full" borderRadius={20} />
            ))}
        </View>
    </View>
);

export const HistorySkeleton = () => (
    <View className="flex-1 px-4 py-4">
        <Skeleton height={200} className="w-full mb-8" borderRadius={24} />
        <View className="flex-row justify-between mb-5">
            <Skeleton width={150} height={28} />
            <Skeleton width={60} height={24} />
        </View>
        <View className="gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={80} className="w-full" borderRadius={16} />
            ))}
        </View>
    </View>
);
