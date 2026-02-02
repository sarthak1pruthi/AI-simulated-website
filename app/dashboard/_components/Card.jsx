import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const Card = ({info}) => {

    const router=useRouter()

    const onStart=()=>{
        router.push('/dashboard/interview/'+info?.mockId)
    }

    const onFeedback=()=>{
        router.push('/dashboard/interview/'+info?.mockId+'/feedback')
    }
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-primary'>{info?.jobPosition}</h2>
        <h2 className='text-sm text-gray-600'>{info?.jobExperience} Years of Experience</h2>
   
   <h2 className='text-xs text-gray-400'>Created At:{info?.createdAt}</h2>
   
   <div className='flex justify-between my-2 mt-4 gap-5'>

    <Button size="sm" variant="outline" className="w-full"
    onClick={onFeedback}
>Feedback</Button>
 
    <Button size="sm" className="w-full"
onClick={onStart}
    >Start</Button>
   </div>
    </div>
  )
}

export default Card
