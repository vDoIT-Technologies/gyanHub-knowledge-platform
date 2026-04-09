import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const PersonalityCard = ({ assistant }) => {
  const navigate = useNavigate();
  const status = assistant?.status || "active";

  const handleChatStart = () => {
    if (status === "active") {
      navigate(`/chat/${assistant?.id}`);
    }
  };

  return (
    <Card
      className={`relative mx-0 sm:mx-2 flex flex-col items-center gap-6 p-4 sm:p-6 h-[300px] sm:h-[380px] rounded-xl overflow-hidden transition-all ${
        status === "active"
          ? "bg-[#FFFFFF0D] cursor-pointer hover:shadow-xl hover:scale-105"
          : "bg-white/10 border border-white/20 cursor-not-allowed"
      }`}
    >
      {/* Background Image (CLEAR for inactive) */}
      <img
        src={assistant?.imageUrl || "/img/teachers.png"}
        alt={assistant?.name}
        className={`absolute w-full h-full object-cover pb-20 transition-all ${
          status === "active"
            ? ""
            : "saturate-90 brightness-95"
        }`}
      />

   
      

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-4 justify-end w-full h-full">
        <div>
          <h3
            className={`font-semibold line-clamp-1 mb-1 px-2 ${
              status === "active" ? "text-white" : "text-white/70"
            }`}
          >
            {assistant?.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 sm:line-clamp-3 px-2">
            {assistant?.description}
          </p>
        </div>

        {/* Button */}
        <Button
          variant={status === "active" ? "default" : "secondary"}
          onClick={handleChatStart}
          disabled={status !== "active"}
          className={`w-full font-medium rounded-lg shadow-md transition-all ${
            status === "active"
              ? "bg-primary hover:bg-primary/90 text-white"
              : "bg-white/70 text-black cursor-not-allowed"
          }`}
        >
          {status === "active" ? "Join Class" : "Coming Soon"}
        </Button>
      </div>

      {/* Very Soft Bottom Gradient (no dark block) */}
      <span className="absolute bottom-0 w-full h-full bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
    </Card>
  );
};

export default PersonalityCard;
