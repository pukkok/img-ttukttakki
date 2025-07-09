const EditModeToggle = ({ isEditMode, onToggle, leftText = '수정', rightText = '잠금' }) => {

  return (
    <div className="flex border border-gray-600 rounded overflow-hidden text-sm">
      <button
        onClick={() => !isEditMode && onToggle()}
        className={`px-3 py-1 transition-all ${
          isEditMode
            ? 'bg-emerald-600 text-white shadow-inner'
            : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
        }`}
      >
        {leftText}
      </button>
      <button
        onClick={() => isEditMode && onToggle()}
        className={`px-3 py-1 transition-all ${
          !isEditMode
            ? 'bg-emerald-600 text-white shadow-inner'
            : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
        }`}
      >
        {rightText}
      </button>
    </div>
  )
}

export default EditModeToggle