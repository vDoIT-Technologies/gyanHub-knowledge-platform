import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetProfile } from "@/lib/hooks/api/profile.hook";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useTokenStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { Copy, CopyCheck } from "lucide-react";
import { ProfileDropdownSkeleton } from "../loaders/ProfileDropDownLoader";
import SOPH from "../../assets/images/Soph.svg";
import { Card } from "../ui/card";
import CountUp from "react-countup";
import { toast, Toaster } from "sonner";
import LogoutModal from "./LogoutModal";
import ConnectVault from "./twin-vault/ConnectVault";
import CreateVault from "./twin-vault/CreateVault";
import CreateSuccess from "./twin-vault/CreateSuccess";
import Verify from "./twin-vault/Verify";
export function ProfileDropdown() {
  const navigate = useNavigate();
  const[logoutModalOpen,setLogoutModalOpen]=useState(false)
  const[verifyModalOpen,setVerifyModalOpen]=useState(false)
  const[connectVaultModalOpen,setConnectVaultModalOpen]=useState(false)
  const[createVaultModalOpen,setCreateVaultModalOpen]=useState(false)
  const[ createSuccessModalOpen,setCreateSuccessModalOpen]=useState(false)
  const { token } = useTokenStore();
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useGetProfile({
    enabled: !!token,
  });

  const [copied, setCopied] = useState(false);


  const handleCopy = () => {
    if (userProfile?.data?.data?.walletAddress) {
      navigator.clipboard.writeText(userProfile.data.data.walletAddress).then(() => {
        setCopied(true);
        toast("Wallet address copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (isLoading) {
    return <ProfileDropdownSkeleton />;
  }

  const {
    sophToken = "",
    name = "",
    profilePhoto = "",
    walletAddress = "",
  } = userProfile?.data?.data || {};

  return (
    <>
    <LogoutModal logoutModalOpen={logoutModalOpen} setLogoutModalOpen={setLogoutModalOpen} />
    
    <Verify verifyModalOpen={verifyModalOpen} setVerifyModalOpen={setVerifyModalOpen}/>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center h-full rounded-none gap-4"
          >
            <Avatar>
              <AvatarImage
                src={
                  profilePhoto
                    ? `data:image/jpeg;base64,${profilePhoto}`
                    : undefined
                }
                alt="user"
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="uppercase">{name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <p>{name}</p>
             
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className=" w-56 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80" align="end">
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            My Account
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className="w-full cursor-pointer"
            onClick={()=>setLogoutModalOpen(true)}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <Toaster theme="dark" /> */}
    </>
  );
}
