import {useRef, useState} from "react";
import {type SubmitHandler, useForm} from "react-hook-form";
import {Image, Send, X} from "lucide-react";
type Message = {
    text: string;
    image?:File;
}
export default function MessageInput(){
    const [imagePreview, setImagePreview] = useState(null);
    const messageinputRef =useRef<HTMLInputElement>(null);
    const {register,handleSubmit} = useForm<Message>();
    const onSubmit: SubmitHandler<Message> = (data) => {
        console.log(data);

    }
    const handleChangeImage = () => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            // @ts-ignore
            reader.onload = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }
    const removeImage = () => {
        setImagePreview(null);
        if (messageinputRef.current) messageinputRef.current.value = "";
    };
    return(
        <div className="p-4 w-full">
        {
            imagePreview &&
        < div className= "flex items-center gap-2">
                <div className="relative ">
                    <img className="w-20 h-20 rounded-lg object-cover border border-zinc-700" src={imagePreview} alt="ImagePreview"/>
                    <button className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" onClick={removeImage}>
                        <X size={5}/>
                    </button>
                </div>
        </div>
        }
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">

            <div className="flex-1 flex gap-2">
                <input className="input outline-none rounded-xl input-sm sm:input-md input-border w-full"
                type="text" {...register("text")}/>
                <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={messageinputRef}

                />
                <button className={`hidden sm:flex btn btn-circle ${
                    imagePreview? "text-emerald-500" : "text-zinc-400"
                }`}
                onClick={()=> messageinputRef.current?.click()}>
                    <Image size={20} />
                </button>
            </div>
            <button type="submit" className="btn btn-lg btn-circle ">
                <Send size="20"/>
            </button>
        </form>
        </div>
    )
    
}