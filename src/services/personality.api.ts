import api from "@/services";

export const apiGetPersonalityList = async () => {
  return api.get("/user/fetch-allPersonalities");
};

export const apiGetPersonalityById=async(personalityId)=>{
  return api.get(`/user/personality/${personalityId}`)
}