import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

export const ScoreRadarChart = ({ scores, maxScore }) => {
  const data = [
    { axis: '安全性', value: Math.round((scores.safety / maxScore) * 100) },
    { axis: 'スピード', value: Math.round((scores.speed / maxScore) * 100) },
    { axis: 'ストレス管理', value: Math.round((scores.stress / maxScore) * 100) },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="#d1fae5" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: '#374151', fontSize: 13, fontWeight: 600 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          tickCount={4}
        />
        <Radar
          dataKey="value"
          stroke="#059669"
          fill="#059669"
          fillOpacity={0.35}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
