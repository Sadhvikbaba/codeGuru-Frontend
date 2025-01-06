import React, { useState , useEffect} from "react";
import avatar from "@/assets/avatar.png"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {ChartContainer,ChartTooltip,ChartTooltipContent,} from "@/components/ui/chart"
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { getUserDashboard } from "@/connecting";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";


const parse = (submissions) => {
  return Object.values(
    submissions.reduce((acc, submission) => {
      const date = submission.updatedAt.split('T')[0]; 
      if (!acc[date]) {
        acc[date] = { date, count: 0 }; 
      }
      acc[date].count++; 
      return acc;
    }, {})
  );
}

const UserDashboard = () => {
  const Navigate = useNavigate()

  const details = useSelector((state) => state?.auth?.userData)
  const [loading , setLoading] = useState(true)
  const [userInfo , setUserInfo] = useState()
  const [chartData , setChartData] = useState()


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let res = await getUserDashboard(details._id);
        
        res.submissions = parse(res.submissions)
        setChartData(res.submissions)
        setUserInfo(res)
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  if(!loading) return (
    <div className="flex w-full h-screen p-6 space-x-6">
      {/* Left Section */}
      <div className="w-1/4 p-4 rounded-lg ">
      <div className="w-full flex justify-end text-xl cursor-pointer">
        <IoMdSettings onClick={()=> Navigate("/update-details")}/>
      </div>
        <img
          src={userInfo.avatar ? userInfo.avatar : avatar}
          alt="User Avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-center mb-2">
          {userInfo.fullName}
        </h2>
        <p className="text-center text-gray-600 mb-1">@{userInfo.userName}</p>
        <p className="text-center text-gray-600">{userInfo.email}</p>
        <p className="text-center text-gray-600">{userInfo.createdAt.slice(0,10)}</p>
      </div>

      {/* Right Section */}
      <div className="w-3/4 space-y-6">
        {/* Graph Section */}
        <div className=" p-4 rounded-lg ">
        <h3 className="text-lg font-semibold mb-4">Submissions Per Day</h3>
        <div className="w-full h-64 flex justify-center">
          <ChartContainer config={userInfo.submissions} className="w-full">
            <AreaChart
              data={chartData}
              width={1000}
              height={250}
              margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    className="dark:stopColor-white stopColor-black"
                    stopColor="currentColor"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    className="dark:stopColor-transparent stopColor-black"
                    stopColor="currentColor"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => value.slice(5)} />
              <Area
                type="monotone"
                dataKey="count"
                className="dark:stroke-white stroke-black"
                stroke="currentColor"
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
        </div>

        {/* Table Section */}
        <div className="bg-gray-100 dark:bg-gray-950 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Submitted Questions</h3>
          <Table>
            <TableCaption>A list of questions you have submitted.</TableCaption>
            <TableHeader className="border-gray-500 border-b-2">
              <TableRow>
                <TableHead >Title</TableHead>
                <TableHead >Difficulty</TableHead>
                <TableHead >Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userInfo &&  userInfo.solved.map((question, index) => (
                <TableRow key={index} className="border-gray-700 dark:hover:bg-gray-600 hover:bg-gray-300">
                  <TableCell className="font-medium">{question.question.title}</TableCell>
                  <TableCell className=""><Badge
                    className={`${
                      question.question.difficulty === "Hard"
                        ? "bg-red-600"
                        : question.question.difficulty === "Easy"
                        ? "bg-green-600"
                        : "bg-yellow-400"
                    }`}
                  >
                    {question.question.difficulty}
                  </Badge></TableCell>
                  <TableCell>{question.updatedAt.slice(0 ,10)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
