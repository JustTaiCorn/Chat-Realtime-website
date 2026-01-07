import {Search} from "lucide-react";

export default  function SearchComponent(){
    return (
        <div className="max-w-sm w-60  flex my-4
         items-center relative mx-auto flex items-center justify-center border-b border-base-200">
            <input  type="text" className=' rounded-full px-4 py-4 w-full h-10 border-y border-l border-base-content/400 outline-none' placeholder="Tìm kiếm User"/>
            <button className=" absolute right-0 top--1/2 w-10 h-10 bg-base-content rounded-full flex items-center justify-center shadow-lg">
                <Search className="text-white w-5 h-5" />
            </button>
        </div>
)
}