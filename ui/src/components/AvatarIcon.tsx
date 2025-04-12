import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AvatarIcon = ({ name, image }: { name: string; image?: string }) => {
  return (
    <Avatar id="avatar-icon" className="w-6 h-6 cursor-pointer">
      <AvatarImage src={image} alt="Uploaded avatar" />
      <AvatarFallback className="bg-blue-500 text-white">
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarIcon;
