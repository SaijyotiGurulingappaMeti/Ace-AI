"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { chatSession } from '@/utils/GeminiAIModel'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { Mic } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useSpeechToText from 'react-hook-speech-to-text'
import Webcam from 'react-webcam'
import { toast } from 'sonner'

function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {

  const [userAnswer,setUserAnswer]=useState('');
  const {user}=useUser();
  const [loading,setLoading]=useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });


  useEffect(()=>{
    results.map((result)=>(
      setUserAnswer(prevAns=>prevAns+result.transcript)
    ))

  },[results])

  useEffect(()=>{
    if(!isRecording&&userAnswer.length>10)
    {
      UpdateUserAnswer();
      
    }
    
  },[userAnswer])

  const StartStopRecording=async()=>{
    if(isRecording)
    {
      stopSpeechToText()
      console.log(userAnswer)
      if(userAnswer?.length<10)
        {
          setLoading(false);
          toast('Error Saving your Answer, Record Again!')
          return ;
        }
    }
    else
    {
      startSpeechToText();
    }
  }

  const UpdateUserAnswer=async()=>{


    console.log(userAnswer)
    setLoading(true)
    const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+
    ", User Answer:"+userAnswer+",Depends on Question and User Answer for given Interview Question"+
    ", please give us rating for the answer and Feedback for Area of Improvement"+
    " in just 3 to 5 lines to improve in JSON format with rating field and feedback field";

      const result=await chatSession.sendMessage(feedbackPrompt);

      const MockJsonResp=(result.response.text()).replace('```json','').replace('```','');
      console.log(MockJsonResp);
      const JsonFeedbackResp=JSON.parse(MockJsonResp);

      const resp= await db.insert(UserAnswer)
      .values({
        mockIdRef:interviewData?.mockId,
        question:mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns:userAnswer,
        feedback:JsonFeedbackResp?.feedback,
        rating:JsonFeedbackResp?.rating,
        userEmail:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-YYYY')
      })

      if(resp)
      {
        toast('User Answer Recorded Successfully');
        setUserAnswer('');
        setResults([]);
      }
      setResults([]);
      setLoading(false);



  }

  return (
    <div className='flex items-center justify-center flex-col'>


        <div className='flex flex-col justify-center items-center bg-secondary rounded-lg p-5 my-10 mx-10'>
            <Image src={'/webcam.svg'} width={200} height={200} className='absolute' />

        
            <Webcam
            mirrored={true}
            style={{
                height:300,
                width:'100%',
                zIndex:10,
                

            }}/>
        </div>
        <Button 
        disabled={loading}
        variant="outline" className='my-10'

          onClick={StartStopRecording}>
        {isRecording?
    
        <h2 className='text-red-600 flex gap-2'>
          <Mic/> Stop Recording
        </h2>
        :
        'Record Answer'}</Button>
    </div>
  )
}

export default RecordAnswerSection