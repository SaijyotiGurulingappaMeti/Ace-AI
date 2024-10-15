import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

function Dashboard() {
  return (
    <div className='p-10'>
      <h1 className='text-gray-500'><strong>Create and Start your Mock Interview</strong></h1>

      
      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewInterview/>
      </div>

      {/*Previous Interviews Attempted:*/}
      <InterviewList/>
    
    </div>
  )
}

export default Dashboard