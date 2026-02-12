export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <Card title="Destinations" value="--" />
        <Card title="Packages" value="--" />
        <Card title="Agents" value="--" />
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white border rounded p-6">
      <div className="text-sm text-muted-foreground">
        {title}
      </div>
      <div className="text-2xl font-semibold">
        {value}
      </div>
    </div>
  );
}
