import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserRound } from "lucide-react";

const AvatarIcon = ({
  name,
  image,
  color,
  fallbackType = "icon",
}: {
  name: string;
  image?: string;
  color: string;
  fallbackType?: "icon" | "text";
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar id="avatar-icon" className="w-6 h-6 cursor-pointer">
            <AvatarImage src={image} alt="Uploaded avatar" />
            {color === "blue" ? (
              <AvatarFallback className="bg-blue-500 text-white">
                {fallbackType === "icon" ? (
                  <UserRound className="w-4 h-4" />
                ) : (
                  name.charAt(0)
                )}
              </AvatarFallback>
            ) : (
              <AvatarFallback className="bg-gray-500 text-white">
                {fallbackType === "icon" ? (
                  <UserRound className="w-4 h-4" />
                ) : (
                  name.charAt(0)
                )}
              </AvatarFallback>
            )}
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AvatarIcon;
