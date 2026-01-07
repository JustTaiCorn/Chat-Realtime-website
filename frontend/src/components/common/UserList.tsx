import { PersonStandingIcon } from "lucide-react";
import SearchComponent from "./SearchComponent.tsx";
import { useChatStore } from "../../zustands/userStore.ts";
import List from "./List.tsx";
import { useQuery } from "@tanstack/react-query";

export default function UserList() {
  const { getUsers, setSelectedUser, selectedUser } = useChatStore();

  const { isLoading, data: userList } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
  });

  console.log("userList", userList);

  return (
    <div className="h-[calc(100vh-6rem)] lg:w-72 w-20 flex flex-col bg-base-300 ml-35 mr-2.5 rounded-2xl">
      <div className=" flex p-4 font-bold text-left border-b border-base-200 ">
        <PersonStandingIcon className="w-6 h-6 mr-2" />
        <span className="text-lg font-bold">Liên hệ có trong Website</span>
      </div>
      <div className=" p-1 font-bold  border-b border-base-200 ">
        <SearchComponent />
      </div>

      <div className="flex-grow">
        <List
          isLoading={isLoading}
          users={userList || []}
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
        />
      </div>
    </div>
  );
}
