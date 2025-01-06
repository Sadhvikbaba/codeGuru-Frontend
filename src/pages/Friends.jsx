import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input"; // Input component for search
import avatar from "@/assets/avatar.png";
import { getUsers } from "@/connecting";
import { useNavigate } from "react-router-dom";

function Friends() {
  const Navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState(""); // New state for search query
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getUsers();
        if (response && response.response) {
          setFriends(response.response);
        }
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  // Filter friends based on the search query
  const filteredFriends = friends.filter((friend) =>
    friend.userName.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate filtered friends
  const paginatedFriends = filteredFriends.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col p-4">
      <h3 className="text-3xl font-semibold mb-4">Friends</h3>

      {/* Search Input */}
      <div className="mb-4">
        <Input
          placeholder="Search by User Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
      </div>

      {/* Table */}
      <Table>
        <TableCaption>A list of your friends and their solved problems.</TableCaption>
        <TableHeader className="border-gray-500 border-b-2">
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Solved Problems</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedFriends.map((friend, index) => (
            <TableRow
              key={friend._id || index}
              className="border-gray-700 dark:hover:bg-gray-600 hover:bg-gray-300 cursor-pointer"
              onClick={() => Navigate(`/friend-dashboard/${friend._id}`)}
            >
              <TableCell className="font-medium w-1/12">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell className="font-medium min-w-[30rem] flex items-center text-3xl space-x-3">
                <img
                  src={friend.avatar ? friend.avatar : avatar}
                  alt="avatar"
                  className="min-w-10 max-w-10 max-h-10 min-h-10 rounded-full"
                />
                <span>{friend.userName}</span>
              </TableCell>
              <TableCell className="font-medium min-w-[30rem]">
                {friend.fullName}
              </TableCell>
              <TableCell className="w-1/2">
                {friend.solved.length > 0 ? (
                  <Badge className="bg-green-600 text-white">
                    {friend.solved.length} Problems Solved
                  </Badge>
                ) : (
                  <Badge className="bg-red-600 text-white">No Problems Solved</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredFriends.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Friends;
