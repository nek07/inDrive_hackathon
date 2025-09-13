import { Camera, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PhotoUploadCardProps {
  title: string;
  image: string | null;
  onImageSelect: (file: File) => void;
}

export function PhotoUploadCard({ title, image, onImageSelect }: PhotoUploadCardProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        id={`upload-${title}`}
      />
      <label
        htmlFor={`upload-${title}`}
        className={`
          block w-full rounded-xl cursor-pointer transition-all duration-300 ease-in-out
          border-2 border-dashed shadow-sm hover:shadow-md group
          ${image 
            ? 'border-[#32CD32] bg-[#32CD32]/5 shadow-[#32CD32]/10' 
            : 'border-gray-200 bg-white hover:border-[#32CD32] hover:bg-[#32CD32]/5 hover:shadow-[#32CD32]/10 hover:scale-[1.02] hover:-translate-y-1'
          }
        `}
        style={{ aspectRatio: '1', minHeight: '120px', maxHeight: '140px' }}
      >
        <div className="flex flex-col items-center justify-center h-full p-4">
          {image ? (
            <div className="relative w-full h-full">
              <ImageWithFallback
                src={image}
                alt={title}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              <div className="absolute top-2 right-2 w-7 h-7 bg-[#32CD32] rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <span className="text-white text-xs font-medium drop-shadow-lg">
                  {title}
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-[#32CD32]/10 transition-colors duration-300">
                <Camera className="w-6 h-6 text-gray-400 group-hover:text-[#32CD32] transition-colors duration-300" />
              </div>
              <span className="text-center text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300 leading-tight px-1">
                {title}
              </span>
              <span className="text-center text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-300">
                Нажмите для загрузки
              </span>
            </>
          )}
        </div>
      </label>
    </div>
  );
}