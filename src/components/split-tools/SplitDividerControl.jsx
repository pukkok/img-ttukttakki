const SplitDividerControl = ({ rows, cols, onRowsChange, onColsChange }) => {
  const totalPages = rows * cols

  return (
      <div className='flex gap-4 items-center'>
        <p className='pr-2 border-r border-gray-500'>분할</p>
        <div className="flex gap-2 items-center">
          <label>가로 : </label>
          <input
            type="number"
            min="1"
            value={cols}
            onChange={(e) => onColsChange(parseInt(e.target.value))}
            className="bg-gray-800 border border-gray-600 px-2 py-1 w-20 rounded appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="flex gap-2 items-center">
          <label>세로 : </label>
          <input
            type="number"
            min="1"
            value={rows}
            onChange={(e) => onRowsChange(parseInt(e.target.value))}
            className="bg-gray-800 border border-gray-600 px-2 py-1 w-20 rounded appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        
        <p className="text-xs text-gray-400 mt-3 ml-auto mr-4">총 페이지 수: {totalPages}장</p>
      </div>
    
  )
}

export default SplitDividerControl