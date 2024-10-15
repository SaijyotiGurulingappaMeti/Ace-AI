"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import Link from 'next/link'



function Interview({params}) {

    const [interviewData,setInterviewData]=useState();
    const [webCamEnabled,setWebCamEnabled]=useState(false);

    useEffect(()=>{
        console.log(params.interviewId)
        GetInterviewDetails();
    },[])

    const GetInterviewDetails=async()=>{
        const result= await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId,params.interviewId))

        console.log(result);
        setInterviewData(result[0]);
    }
  return (
    <div className='my-10'>
        <h2 className='font-bold text-2xl'>Are you Ready?</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

            <div >

            
                
                {webCamEnabled? <Webcam
                onUserMedia={()=>setWebCamEnabled(true)}
                onUserMediaError={()=>setWebCamEnabled(false)}
                mirrored={true}
                
                style={{
                    height:300,
                    width:300
                }}/>
                :
                <>
                <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary'/>
                <Button onClick={()=>setWebCamEnabled(true)}>Enable Camera and Microphone</Button>
           
                </>
                }
            </div>
            <div className='flex flex-col my-5 gap-5'>
            
                <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-200'>
                    <h2><Lightbulb/><strong>Information</strong></h2>
                    <h2>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                </div>
                <div>
                    <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
                
                    <Button>Start Interview</Button>
                    </Link>

                </div>
            </div>
        </div>
       
          
          
    </div>
  )
}

export default Interview