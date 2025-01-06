import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateDetails } from "@/connecting";
import { updateDetails as stateUpdate } from "@/store/authSlice";
import { useToast } from "@/hooks/use-toast"

const App = () => {
  const details = useSelector((state) => state.auth.userData)
  const Dispatch = useDispatch()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async(data) => {
    await updateDetails(data)
    .then((res) => {Dispatch(stateUpdate(res.response))
      toast({
        description: "Details Updated",
      })
    })
  };

  return (
    <div className="flex min-h-[39rem] items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 space-y-4 rounded-md shadow dark:bg-gray-800 bg-gray-200"
      >
        <h1 className="text-2xl font-semibold text-center">
          Update details
        </h1>

        {/* First Input */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium">
            full Name
          </label>
          <Input
            id="fullName"
            defaultValue = {details.fullName}
            {...register("fullName", { required: "First Name is required" })}
            className="mt-1"
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* Second Input */}
        <div>
          <label htmlFor="userName" className="block text-sm font-medium">
            user Name
          </label>
          <Input
            id="userName"
            defaultValue={details.userName}
            {...register("userName", { required: "Last Name is required" })}
            className="mt-1"
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full mb-2">
          Submit
        </Button>
        <Link to={"/dashboard"} className=" ml-1 text-base">Go Back</Link>
      </form>
    </div>
  );
};

export default App;
