import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import { Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function BusinessDashboard({ business }) {
  const views = business?.views ?? []

  const data = {
    labels: views.length
      ? views.map((view) => format(new Date(view.date), 'MMMM d, yyyy'))
      : ['No data available'],
    datasets: [
      {
        label: 'Views Per Day',
        data: views.length ? views.map((view) => view.count) : [0],
        fill: false,
        backgroundColor: '#F97316',
        borderColor: '#F97316',
        tension: 0.1,
        lineTension: 0.4,
        radius: 6,
      },
    ],
  }

  // Check if ratingsDistribution exists or default to an empty array
  const ratingsDistribution = business?.ratingsDistribution ?? []
  const totalRatings = ratingsDistribution.reduce(
    (acc, current) => acc + current.count,
    0
  )

  const pieData = {
    labels:
      totalRatings > 0
        ? ['5 stars', '4 stars', '3 stars', '2 stars', '1 stars']
        : ['No data available yet'],
    datasets: [
      {
        data: [5, 4, 3, 2, 1].map((rating) => {
          const found = ratingsDistribution.find((d) => d.rating === rating)
          return found ? found.count : 0
        }),
        backgroundColor: ratingsDistribution.length
          ? [
              '#059669', // 5
              '#5BBE80', // 4
              '#FBBF24', // 3
              '#FB923C', // 2
              '#EF4444', // 1
            ]
          : ['#D1D5DB'], // Gray color if no data
        label: ' # of Reviews',
      },
    ],
  }
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: totalRatings === 0,
      },
      title: {
        display: true,
        text: 'Rating Distribution',
      },
    },
  }

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        ticks: {
          // This ensures that only whole numbers are used as ticks.
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Views per day',
      },
    },
  }

  return (
    <motion.section
      layout
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <div className=" mb-5 flex flex-col gap-2 border-b border-gray-300 pb-5 leading-8">
        <h1 className="text-3xl font-bold capitalize  sm:text-6xl">
          Analytics
        </h1>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <div className="flex w-full flex-col justify-between gap-5 md:w-2/3">
            <div className="flex items-center justify-between rounded-md border p-2 shadow-xl sm:p-5">
              <div>
                <p className="text-xl font-bold">24%</p>
                <p className="text-gray-400">Click Through Rate (CTR)</p>
              </div>
              <div className="rounded-sm bg-green-600/70 p-2 text-white sm:p-4">
                +14%
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border p-2 shadow-xl sm:p-5">
              <div>
                <p className="text-xl font-bold">52</p>
                <p className="text-gray-400">Leads Generated</p>
              </div>
              <div className="rounded-sm bg-green-600/70 p-2 text-white sm:p-4">
                +8%
              </div>
            </div>
          </div>
          <div className="w-full rounded-md border p-2 shadow-xl md:w-1/3 md:p-5">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        <div className="rounded-md border p-2 shadow-xl md:p-5">
          <Line options={options} data={data} />
        </div>
      </div>
    </motion.section>
  )
}

export default BusinessDashboard
