"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useReducer, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
  

function Feedback({params}) {

    const[feedbackList,setFeedbackList]=useState([]);
    const router=useRouter();
    useEffect(()=>{
        GetFeedback();
    },[])

    const GetFeedback=async()=>{
        const result=await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef,params.interviewId))
        .orderBy(UserAnswer.id);

        console.log(result);
        setFeedbackList(result);

    }
  return (
    <div className='p-10 gap-5'>
       
        {feedbackList?.length==0?
        <h2 className='font-bold text-xl text-gray-500'>No Interview Record Found! 🫤</h2>
        :
        <>
         <h2 className='text-2xl font-bold text-green-500'>
            Congratulations!🎉
        </h2>
        <h2 className='font-bold text-2xl'>
            Here is your Inteview Feedback!
        </h2>
        <h2 className='text-lg my-3'>Overall Performance: <strong></strong></h2>
        {feedbackList&&feedbackList.map((item,index)=>(
            
                <Collapsible key={index}>
                <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between text-left gap-7 w-full'>
                {item.question} <ChevronsUpDown className='h-5 w-5'/>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className='flex flex-col gap-2 my-3'>
                    <h2 className='text-blue-600 p-2 border rounded-lg'>
                        <strong>Rating:</strong>{item.rating}
                    </h2>
                    <h2 className='p-2 border rounded-lg bg-blue-300 text-sm text-blue-900'><strong>Your Answer:</strong>{item.userAns}</h2>
                    <h2 className='p-2 border rounded-lg bg-green-800 text-sm text-green-200'><strong>Correct Answer:</strong>{item.correctAns}</h2>
                    <h2 className='p-2 border rounded-lg text-sm text-black'><strong>Feedback:</strong>{item.feedback}</h2>
                </div>
                
                </CollapsibleContent>
            </Collapsible>
          
        ))}
        </>}
        <div className='gap-10 my-10'>
        <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
        </div>

    </div>
  )
}

export default Feedback