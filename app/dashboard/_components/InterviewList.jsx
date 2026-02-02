"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import Card from './Card'

const InterviewList = () => {

    const {user}=useUser()
    const [list,setList]=useState([])

    useEffect(()=>{
        user && getList()
    },[user])

    const getList=async()=>{
        const result=await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id))

        setList(result)
    }
  return (
    <div>
      <h2 className='font-medium text-xl'>Previous Mock Interview</h2>
    
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
        {
            list && list.map((e,i)=>(
                <Card key={i} info={e}/>
            ))
        }
    </div>
    </div>
  )
}

export default InterviewList
