const ImageList = ({ images, currentIndex, onSelect }) => {
  return (
    <div className="overflow-y-auto flex flex-col gap-3">
      {images.map((img, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`flex items-center gap-3 p-2 rounded-lg text-left transition border border-gray-700 hover:bg-gray-700
            ${index === currentIndex ? 'bg-gray-700' : ''}`}
        >
          <img
            src={img.url}
            alt={img.name}
            className="w-12 h-12 object-cover rounded"
          />
          <span className="text-sm truncate text-white">{img.name}</span>
        </button>
      ))}
    </div>
  )
}

export default ImageList