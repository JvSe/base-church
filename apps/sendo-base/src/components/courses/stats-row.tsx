type StatCardProps = {
  value: number | string;
  label: string;
};

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="dark-bg-secondary rounded-lg p-4 text-center">
      <div className="dark-text-primary mb-1 text-2xl font-bold">{value}</div>
      <div className="dark-text-tertiary text-sm">{label}</div>
    </div>
  );
}

type StatsRowProps = {
  stats: StatCardProps[];
};

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
}
