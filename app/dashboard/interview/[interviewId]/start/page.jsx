"use client"

import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import QuestionSection from './_components/QuestionSection'
import Record from './_components/Record'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const StartInterview = ({params}) => {

    const [interviewData,setInterviewData]=useState()
    const [mockQuestion,setMockQuestion]=useState()
    const [activeIndex,setActiveIndex]=useState(0)
    useEffect(()=>{
        getData()
    },[])

    const getData=async()=>{
        const result=await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId,params.interviewId))

        
        const jsonMockResp=JSON.parse(result[0]?.jsonMockResp)
        // console.log("res",jsonMockResp)

        setMockQuestion(jsonMockResp);
        setInterviewData(result[0]);
        // setInterviewData(result[0])
    }
  return (
    <div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

        {/* Questions  */}
        <QuestionSection mockQuestion={mockQuestion} activeIndex={activeIndex}/>

        {/* video recording  */}
        <Record 
        interviewData={interviewData}
        mockQuestion={mockQuestion} activeIndex={activeIndex}
        />
      </div>
      <div className='flex justify-end gap-6'>
       {activeIndex>0
       &&
        <Button onClick={()=>setActiveIndex(activeIndex-1)}>Previous Question</Button>
       }
        {activeIndex!=mockQuestion?.length-1
        &&
        <Button onClick={()=>setActiveIndex(activeIndex+1)}>Next Question</Button>
        }
        {
          activeIndex == mockQuestion?.length-1 &&
       
       <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
          <Button >End Interview</Button>
       </Link>
        }
      </div>
    </div>
  )
}

export default StartInterview
