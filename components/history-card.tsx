interface Props {
    title: string
    desc: string
  }
  
  export default function HistoryCard({
    title,
    desc,
  }: Props) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
  
          <p className="text-sm text-zinc-400">
            {desc}
          </p>
        </div>
  
        <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs">
          Aman
        </span>
      </div>
    )
  }