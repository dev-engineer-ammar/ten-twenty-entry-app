export const TimesheetTable = ({ data }: { data: any[] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'INCOMPLETE': return 'bg-yellow-100 text-yellow-700';
      case 'MISSING': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b text-sm text-gray-500 uppercase">
          <tr>
            <th className="px-6 py-4 font-semibold">Week #</th>
            <th className="px-6 py-4 font-semibold">Date</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{row.week}</td>
              <td className="px-6 py-4 text-gray-600">{row.dateRange}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-blue-600 font-medium hover:underline">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};