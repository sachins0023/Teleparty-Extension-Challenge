import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function UserAvatar({
  name,
  image,
  onImageUpload,
}: {
  name: string;
  image?: string;
  onImageUpload: (image: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar
        className="w-24 h-24 cursor-pointer"
        onClick={() => document.getElementById("avatar-input")?.click()}
      >
        <AvatarImage src={image} alt="Uploaded avatar" />
        <AvatarFallback>
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-black animate-spin" />
          ) : (
            name.charAt(0)
          )}
        </AvatarFallback>
      </Avatar>

      <input
        id="avatar-input"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
