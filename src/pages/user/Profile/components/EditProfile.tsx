import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImagePlus } from "lucide-react";
import { useGetProfile, useUpdateProfile } from "@/lib/hooks/api/profile.hook";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useUserStore } from "@/store";
import { BiArrowBack } from "react-icons/bi";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(40, { message: "Name must not exceed 40 characters" }) 
    .regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9 ]*$/, {
      message: "Incorrect format",
    })
    .trim(),
  email: z
    .string()
    .email("Invalid email")
    .regex(/^\S+$/, { message: "Email cannot contain spaces" })
    .optional(),
  profilePhoto: z.string().optional(),
});

const EditProfile = () => {
  const { data: userProfile } = useGetProfile();
  const { user } = useUserStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { mutate: updateProfile, isLoading: updating } = useUpdateProfile();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      profilePhoto: "",
    },
  });

  const { control, handleSubmit, reset, formState } = form;
  const { dirtyFields } = formState;

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (userProfile?.data) {
      reset({
        name: userProfile?.data?.data?.name || "",
        email: userProfile?.data?.data?.email || "",
        profilePhoto: userProfile?.data?.data?.profilePhoto || "",
      });
      if (!selectedImage && userProfile?.data?.data?.profilePhoto) {
        setSelectedImage(
          `data:image/jpeg;base64,${userProfile?.data?.data.profilePhoto}`
        );
      }
    }
  }, [userProfile?.data]);

  const onSubmit = (data) => {
    const updatedFields: any = {};

    if (dirtyFields.name) {
      updatedFields.name = data.name;
    }
    if (dirtyFields.email) {
      updatedFields.email = data.email;
    }
    if (selectedImage && selectedImage.split(",")[1] !== userProfile?.data?.data?.profilePhoto) {
      updatedFields.profilePhoto = selectedImage.split(",")[1];
    }

    if (Object.keys(updatedFields).length > 0) {
      updateProfile(updatedFields, {
        onSuccess: () => {
          toast.success("Saved successfully!");
          setTimeout(() => {
            navigate("/profile");
          }, 1000);
        },
        onError: () => {
          toast.error("Failed to save profile. Please try again.");
        },
      });
    } else {
      toast.error("No changes detected.");
    }
  };

  return (
    <Card className="flex flex-col relative gap-0 justify-center items-center min-h-[80vh] bg-muted/10 px-4 py-8 sm:py-10 mt-4 overflow-hidden">
      <Link
        to="/profile"
        className="absolute top-6 left-4 md:left-10 hover:bg-gray-800 p-2 rounded-full"
      >
        <BiArrowBack size={24} />
      </Link>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-6 w-full max-w-sm"
        >
          <label htmlFor="file" className="cursor-pointer relative group">
            <Avatar className="w-44 h-44 rounded-full shadow border-4 border-primary">
              <AvatarImage
                src={
                  selectedImage ||
                  (userProfile?.data?.data?.profilePhoto
                    ? `data:image/jpeg;base64,${userProfile?.data?.data?.profilePhoto}`
                    : "")
                }
                alt="user img"
                className="w-full h-full object-cover"
              />
              <AvatarFallback>
                <h1 className="text-6xl uppercase">
                  {userProfile?.data?.data?.name[0]}
                </h1>
              </AvatarFallback>

              <input
                type="file"
                name="profilePhoto"
                id="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleAvatarChange}
              />

              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                <ImagePlus size={32} />
              </div>
            </Avatar>
          </label>

          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    disabled={user?.type === "email"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex justify-center">
            <Button type="submit" className="w-full" loading={updating}>
              Save Changes
            </Button>
            <Toaster theme="dark" />
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default EditProfile;
