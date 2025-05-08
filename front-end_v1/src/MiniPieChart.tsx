import React from 'react';

interface MiniPieChartProps {
    percentage: number;
    color: string;
    size?: number;
}

const MiniPieChart: React.FC<MiniPieChartProps> = ({ percentage, color, size = 24 }) => {
    const radius = size / 2;
    const angle = (percentage / 100) * 360;
    const x = radius * Math.cos((angle - 90) * Math.PI / 180);
    const y = radius * Math.sin((angle - 90) * Math.PI / 180);
    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = `M ${radius} ${radius} L ${radius} 0 A ${radius} ${radius} 0 ${largeArcFlag} 1 ${radius + x} ${radius + y} Z`;

    return (
        <svg width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="#607588" /> {/* Base circle */}
            <path d={pathData} fill={color} /> {/* Filled portion */}
        </svg>
    );
};

export default MiniPieChart;