"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'


function AddNewInterview() {
    const [openDialog,setOpenDialog]=useState(false)
    const [jobPosition,setJobPosition]=useState();
    const [jobDesc,setJobDesc]=useState();
    const [jobExperience,setJobExperience]=useState();
    const [loading,setLoading]=useState(false);
    const [JsonResponse,setJsonResponse]=useState([]);
    const router=useRouter();
    const {user}=useUser();
    

    const onSubmit=async(e)=>{
        setLoading(true)
        e.preventDefault()

        console.log(jobPosition,jobDesc,jobExperience);

        const InputPrompt="Job position: "+jobPosition+", Job Description: "+jobDesc+", Years of Experience:"+jobExperience+", Depends on this information please give me  "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questions with answers in JSON format, Give question and answered as field in JSON"

        const result=await chatSession.sendMessage(InputPrompt);
        const MockJsonResp=(result.response.text()).replace('```json','').replace('```','');
        console.log(JSON.parse(MockJsonResp));
        setJsonResponse(MockJsonResp);
        if(MockJsonResp){

        const response=await db.insert(MockInterview)
        .values({
            mockId:uuidv4(),
            jsonMockResp:MockJsonResp,
            jobPosition:jobPosition,
            jobDesc:jobDesc,
            jobExperience:jobExperience,
            createdBy:user?.primaryEmailAddress.emailAddress,
            createdAt:moment().format('DD-MM-YYYY')


        }).returning({mockId:MockInterview.mockId});

        console.log("Inserted ID:",response)
        if(response){
            setOpenDialog(false);
            router.push('/dashboard/interview/'+response[0]?.mockId)
        }
    }
    else{
        console.log("ERROR!!!");
    }
        setLoading(false);

    }

  return (
    <div>
        <div className='pd-50 border rounded-lg bg-secondary
        hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={()=>setOpenDialog(true)}>
            <h2 className='font-bold text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDialog}>
        
        <DialogContent className='max-w-2xl'>
            <DialogHeader>
            <DialogTitle className='text-2xl'>Tell me more about the job you're Interviewing!</DialogTitle>
            <DialogDescription>
                <form onSubmit={onSubmit}>
                <div>
                    <h2>Add Details about your Job Position/role, Job Description and Years of experience </h2>
                    <div className='mt-10 my-2'>
                        <label>Job Position/Role</label>
                        <Input placeholder="Eg- Full Stack Developer" required
                        onChange={(event)=>setJobPosition(event.target.value)}
                        />
                    </div>
                    <div className='my-2'>
                        <label>Job Description/ Tech Stack (provided in the Description)</label>
                        <Textarea placeholder="Eg- React, Angular, NodeJs" required
                        onChange={(event)=>setJobDesc(event.target.value)}
                        />
                    </div>
                    <div className='my-2'>
                        <label>Years of Experience (only Numbers)</label>
                        <Input placeholder="Eg- 5" type="number" max="50" min="0" required 
                        onChange={(event)=>setJobExperience(event.target.value)}
                        />
                    </div>
                </div>
                <div className='flex gap-5 justify-end'>
                    <Button type="button"variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading? 
                        <>
                        <LoaderCircle className='animate-spin'/>Please Wait
                        </>:'Start Interview'
                    }
                        </Button>
                </div>
                </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewInterview