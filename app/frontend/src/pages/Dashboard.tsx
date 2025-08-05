// /src/pages/Dashboard.tsx

import Card from "../components/Card"

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card title="My Credit Card">
        <div className="text-blue-600 font-mono text-sm">**** 4242</div>
        <p className="text-xs text-gray-500">Active</p>
      </Card>

      <Card title="Statistics">
        <img src="https://dummyimage.com/200x100/ccc/000&text=Chart" alt="chart" />
      </Card>

      <Card title="Earning in Month">
        <p className="text-xl font-bold">75%</p>
        <p className="text-sm text-gray-500">Up from last month</p>
      </Card>

      <Card title="Monthly Sale">
        <p className="text-xl font-bold">20,541</p>
      </Card>

      <Card title="Calendar">
        <p className="text-sm text-gray-500">March 2025</p>
      </Card>

      <Card title="Yearly Sale">
        <p className="text-xl font-bold">20,541,125</p>
      </Card>
    </div>
  )
}