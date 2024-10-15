"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router=useRouter();
  const onInterviewPress=()=>{
    router.push('/dashboard')
  }

  return (
   <div className="flex justify-center items-center h-screen">
    
    <Button onClick={onInterviewPress}>Lets Get Interview Ready!</Button>
   </div>
  );
}
