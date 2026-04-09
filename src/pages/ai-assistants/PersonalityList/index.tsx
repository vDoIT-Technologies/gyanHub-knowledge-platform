import { Card } from "@/components/ui/card";
import PersonalityCard from "./PersonalityCard";
import { useQuery } from "react-query";
import { apiGetPersonalityList } from "@/services/personality.api";
import { PersonalityListLoader } from "@/components/loaders/PersonalityListLoader";

const PersonalityList = () => {
  const { data, isLoading, isError } = useQuery(
    ["fetchPersonalities"],
    () => apiGetPersonalityList(),
    { refetchOnWindowFocus: false }
  );

  const allowedIds = [
    "8b9b2d51-df7f-40cc-9390-3ded80a2a3e0"
  ];
  
  const assistants = (data?.data?.data || [])
    .filter((a) => allowedIds.includes(a.id))
    .map((a) => {
      // Override description for this specific ID
      if (a.id === "8b9b2d51-df7f-40cc-9390-3ded80a2a3e0") {
        return {
          ...a,
          description: "Science Teacher | Physics, Chemistry & Biology Expert"
        };
      }
      return a;
    });
  
  // Hardcoded teachers
  const harshVerma = {
    id: "harsh-verma-english",
    name: "Harsh Verma",
    description: "English Teacher | Grammar & Literature Expert",
    avatarImg: "harsh-verma",
    status: "inactive",
    imageUrl:
      "https://img.freepik.com/premium-photo/indian-male-teacher_981168-3023.jpg?semt=ais_hybrid&w=740&q=80"
  };
  
  const priyaSharma = {
    id: "priya-sharma-science",
    name: "Deepak Shukla",
    description: "Computer Teacher | Programming Expert",
    avatarImg: "Deepak Shukla",
    status: "inactive",
    imageUrl:
      "https://img.freepik.com/premium-photo/smiling-young-indian-business-man-wearing-suit-standing-office-portrait_562687-3120.jpg?semt=ais_hybrid&w=740&q=80"
  };
  
 
  const allAssistants = [...assistants, harshVerma, priyaSharma];
  
  return (
    <div className="my-4">
      <h2 className="mb-8">Your Teachers</h2>
      <Card className="mx-auto border-none">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 px-2 sm:px-6">
            {isLoading || allAssistants.length === 0
              ? Array.from({ length: 6 }).map((_, index) => (
                  <PersonalityListLoader key={index} />
                ))
              : allAssistants.map((assistant) => (
                  <PersonalityCard key={assistant.id} assistant={assistant} />
                ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PersonalityList;