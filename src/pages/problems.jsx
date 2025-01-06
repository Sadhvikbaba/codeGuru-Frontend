import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import target from "@/assets/target.png";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { getCodes } from "@/connecting";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Problems() {
  const Navigate = useNavigate()
  const details = useSelector((state) => state?.auth?.userData?.solved);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getCodes();
        setQuestions(res.response || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, difficultyFilter]);

  const filteredQuestions = questions
    ?.filter((q) => q.title.toLowerCase().includes(search.toLowerCase()))
    ?.filter((q) =>
      difficultyFilter && difficultyFilter !== "All Difficulties"
        ? q.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
        : true
    );

  const paginatedQuestions = filteredQuestions?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col p-4">
      <div className="p-4 rounded-lg">
        <div className="mb-10 flex w-full justify-between">
          <p className="text-[5rem] p-8 font-serif">
            Wish it. Plan it.<br />
            Do it. Today
          </p>
          <img src={target} className="w-72 h-72" alt="Target" />
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <Separator />
        <div className="mb-4 flex items-center gap-2 mt-2">
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          <div className="w-60">
            <Select onValueChange={(value) => setDifficultyFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Difficulties">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-4">Problems</h3>
        <Table>
          <TableCaption>A list of all questions</TableCaption>
          <TableHeader className="border-gray-500 border-b-2">
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="flex items-center justify-center w-64">
                Submissions
              </TableHead>
              <TableHead className="">Difficulty</TableHead>
              <TableHead className="">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedQuestions?.map((question, index) => (
              <TableRow
                key={index}
                className="border-gray-700 dark:hover:bg-gray-600 hover:bg-gray-300 cursor-pointer"
                onClick={() => {Navigate(`/code-editor/${question._id}`)}}
              >
                <TableCell className="font-medium w-1/12">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell className="font-medium w-1/2">
                  {question.title}
                </TableCell>
                <TableCell className="flex items-center justify-center w-64">
                  {question.submissions}
                </TableCell>
                <TableCell className="">
                  <Badge
                    className={`${
                      question.difficulty === "Hard"
                        ? "bg-red-600"
                        : question.difficulty === "Easy"
                        ? "bg-green-600"
                        : "bg-yellow-400"
                    }`}
                  >
                    {question.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div
                    className={`${
                      !details?.includes(question._id)
                        ? "bg-red-600"
                        : "bg-green-600"
                    } max-w-6 min-h-6 rounded-full`}
                  ></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredQuestions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Problems;
