interface Props {
    title: string
    value: string
  }
  
  export default function DashboardCard({ title, value }: Props) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
        <p className="text-zinc-400 text-sm">{title}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </div>
    )
  }