import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar({
  name,
  image,
  onImageUpload,
}: {
  name: string;
  image?: string;
  onImageUpload: (image: string) => void;
}) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result as string);
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
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
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
