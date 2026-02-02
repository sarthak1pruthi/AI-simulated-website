"use client";

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'

const Feedback = ({params}) => {
    const router=useRouter()

    const [list,setList]=useState([])
    const [totalrating,setTotalrating]=useState(0);

    const getRating=()=>{
      const length=list.length;
      let total=0;
      // console.log("list",list)
      for(let i=0;i<length;i++){
      total += Number(list[i].rating) ;
      }
     const result=total/list.length;
     if(typeof(result)==="number"){     
       setTotalrating(result)
       }
       else{
        setTotalrating(0)
       }
    }
    useEffect(()=>{
      getFeedback()
        
    },[])
    useEffect(()=>{
      getRating()
    },[list])
    
    const getFeedback=async()=>{
        const result=await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef,params.interviewId))
        .orderBy(UserAnswer.id)

        setList(result)
      
    }
  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold text-gray-500'>
        Congratulations
      </h2>
      <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
    
    <h2 className='text-primary text-lg my-3'>Your overall interview rating:<strong>{totalrating}/10</strong></h2>
   <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, Your answer and feedback for immprovement</h2>
  
  {
    list && list.map((e,i)=>(
        <Collapsible key={i} className='my-7'>
        <CollapsibleTrigger className='flex justify-between p-2 bg-secondary rounded-lg
        my-2 text-left gap-7 w-full
        '>
        {e.question} <ChevronsUpDown className='h-5 w-5'/>
        </CollapsibleTrigger>
        <CollapsibleContent>
        <div className='flex flex-col gap-2'>
            <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{e.rating}</h2>
        <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{e.userAns}</h2>
        <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{e.correctAns}</h2>
        <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback: </strong>{e.feedback}</h2>
        </div>
        </CollapsibleContent>
        </Collapsible>
    ))
  }
  
  <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
   </div>
  )
}

export default Feedback
