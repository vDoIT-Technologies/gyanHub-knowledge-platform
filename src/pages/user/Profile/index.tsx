import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useGetProfile } from "@/lib/hooks/api/profile.hook";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ProfileLoader from "@/components/loaders/ProfileLoader";
import { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";
import { toast, Toaster } from "sonner";
import { BiSolidEdit } from "react-icons/bi";
import { useUserStore } from "@/store";
const Profile = () => {
  const navigate = useNavigate();
  const { data: userProfile, isLoading, isError } = useGetProfile();
  const [copied, setCopied] = useState(false);
  const { user } = useUserStore();
  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleCopy = () => {
    if (userProfile?.data?.data?.walletAddress) {
      navigator.clipboard.writeText(userProfile.data.walletAddress).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
      toast("Wallet address copied to clipboard!");
    }
  };

  if (isLoading) {
    return <ProfileLoader />;
  }

  if (isError || !userProfile?.data) {
    return <div>Error loading profile data</div>;
  }

  const {
    profilePhoto = "",
    name = "",
    walletAddress = "",
    email = "",
    joinedOn = "",
  } = userProfile?.data?.data;

  return (
    <>
      <Toaster theme="dark" />
      <Card className="flex flex-col relative gap-4 justify-center items-center min-h-[80vh] bg-muted/10 mt-4 px-4 py-8 sm:py-12 overflow-hidden">
        <Avatar className="w-44 h-44 rounded-full shadow object-cover border-4 border-primary mb-4">
          <AvatarImage
            src={
              profilePhoto
                ? `data:image/jpeg;base64,${profilePhoto}`
                : undefined
            }
            alt="Profile Image"
            className="w-full h-full object-cover"
          />
          <AvatarFallback>
            <h1 className="text-6xl uppercase">{name[0]}</h1>
          </AvatarFallback>
        </Avatar>

        <h2 className="text-center break-words max-w-64">
          {name}
        </h2>
        <p className="text-stone-400">{email}</p>
       

        <p className="text-stone-300 mt-5">
          Joined on{" "}
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(joinedOn))}
        </p>

        <Button
          className="absolute z-[5] space-x-2 top-4 md:top-6 right-4 px-4"
          onClick={handleEdit}
        >
          {" "}
          <BiSolidEdit size={20} />
          <p className="hidden md:block">Edit Profile</p>
        </Button>

        <div className="absolute bg-primary/30 blur-3xl -top-16 left-28 w-[26rem] h-[10rem] rounded-full hidden sm:block" />
        <div className="absolute bg-primary/50 blur-3xl -bottom-16 right-16 w-[26rem] h-[10rem] rounded-full hidden sm:block" />
      </Card>
    </>
  );
};

export default Profile;
