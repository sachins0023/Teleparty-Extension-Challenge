import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import UserAvatar from "./UserAvatar";
import { useState } from "react";
import { toastMessage } from "./Toast";
import { ActionButtonProps } from "@/types/ActionButton";

export default function ActionButton({
  action,
  buttonText,
  onSubmit,
  name: initialName,
  sessionId: initialSessionId,
  imageUrl: initialImageUrl,
}: ActionButtonProps) {
  const [name, setName] = useState<string>(initialName);
  const [sessionId, setSessionId] = useState<string>(initialSessionId);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
  const [errors, setErrors] = useState<{ name?: string; sessionId?: string }>(
    {}
  );
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (action === "create") {
      if (!name) {
        toastMessage("Name is required", "Error");
        setErrors({ name: "Name is required" });
        return;
      }
      setErrors({});
      onSubmit({ name, sessionId: undefined, imageUrl });
      setOpen(false);
    } else {
      if (!name) {
        toastMessage("Name is required", "Error");
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "Name is required",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: undefined,
        }));
      }
      if (!sessionId) {
        toastMessage("Session ID is required", "Error");
        setErrors((prevErrors) => ({
          ...prevErrors,
          sessionId: "Session ID is required",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          sessionId: undefined,
        }));
      }
      if (name && sessionId) {
        const payload = {
          name,
          sessionId,
          imageUrl,
        };
        onSubmit(payload);
        setOpen(false);
      }
    }
  };

  const reset = () => {
    setErrors({});
    setName("");
    setSessionId("");
    setImageUrl(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white p-2 rounded-md cursor-pointer">
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[505px]">
        <DialogHeader>
          <DialogTitle>
            {action === "create" ? "Create" : "Join"} Chat Room
          </DialogTitle>
          <DialogDescription>
            How would you like others to call you?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <UserAvatar
              name={name || "User"}
              image={imageUrl}
              onImageUpload={(imageString) => {
                setImageUrl(imageString);
              }}
            />
            <div className="col-span-3 space-y-2">
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    name: undefined,
                  }));
                  setName(e.target.value);
                }}
                placeholder="Enter nickname"
              />
              <p className="text-gray-400 text-xs">
                * Upload an image to use as your avatar
              </p>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
          </div>
          {action === "join" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sessionId">Chat Room ID:</Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="sessionId"
                  value={sessionId}
                  onChange={(e) => {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      sessionId: undefined,
                    }));
                    setSessionId(e.target.value);
                  }}
                />
                {errors.sessionId && (
                  <p className="text-red-500 text-sm">{errors.sessionId}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={reset} className="cursor-pointer">
            Reset
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 cursor-pointer"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
