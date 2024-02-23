type PropsType = {
  rows: string[][];
};

const Table: React.FC<PropsType> = ({ rows }) => {
  const [headersRow, ...tableRows] = rows;

  if (!headersRow) throw new Error('Should at least have headers row');

  return (
    <div className="relative max-h-96 overflow-y-auto">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right">
        <thead className="sticky top-0 bg-gray-50 text-xs uppercase text-gray-700">
          <tr>
            {headersRow.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-2 py-2"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, idx) => (
            <tr
              key={idx}
              className="border-b bg-white"
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-2 py-2"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
