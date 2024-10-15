import { Lightbulb, Speaker, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSection({mockInterviewQuestion,activeQuestionIndex}) {
  
    const textToSpeach=(text)=>{
        if('speechSynthesis' in window){
            const speech=new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(speech)

        }
        else{
            alert('Sorry, Browser does not support Text to Speach')
        }
    }
    return mockInterviewQuestion&&(
    <div className='p-5 border rounded-lg my-10 gap-4'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        </div>
        <h2 className='my-5 text-md md:text-lg'>
                {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>
        <Volume2 className='cursor-pointer' onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}/>
        <div className='border rounded-lg p-5 bg-blue-300 my-10'>
            <h2 className='flex gap-4 items-center text-blue-950 '>
                <Lightbulb/>
                <strong>Note:</strong>
            </h2>
            <h2 className='text-sm text-black my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
        </div>

    </div>
  )
}

export default QuestionsSection