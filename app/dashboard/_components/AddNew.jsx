"use client"
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/Gemini";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';


const AddNew = () => {

    const router=useRouter()
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition,setJobPosition]=useState()
  const [jobDesc,setJobDesc]=useState()
  const [jobExperience,setJobExperience]=useState()
    const [response,setReponse]=useState([])
  const [loading,setLoading]=useState(false);

  const {user}=useUser();


  const handleSubmit=async(e)=>{
    setLoading(true)
    e.preventDefault()
    console.log(jobPosition,jobDesc,jobExperience)

    const InputPrompt="Job position: "+jobPosition+", Job description : "+jobDesc+" , Years of Experience : "+jobExperience+", Depends on Job Position , Job Description & Years of EXperience give us "+process.env.NEXT_PUBLIC_QUESTION_COUNT+" Interview question along with answer in JSON  format . Give Question and Answered as field in JSON"
    
    const result=await chatSession.sendMessage(InputPrompt)

    const response=(result.response.text().replace('```json','').replace('```',''));

    console.log(JSON.parse(response))
    setReponse(response)

    if(response){

        
        const responseData=await db.insert(MockInterview)
    .values({
        mockId:uuidv4(),
        jsonMockResp:response,
        jobPosition:jobPosition,
        jobDesc:jobDesc,
        jobExperience:jobExperience,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-YYYY') 

    }).returning({mockId:MockInterview.mockId});

console.log("INserted id",responseData)
if(responseData){
    setOpenDailog(false)

    router.push('/dashboard/interview/'+responseData[0]?.mockId)
}
}
else {
    console.log("Error")
}
    setLoading(false)

}
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary
      hover:scale-105 hover:shadow-md cursor-pointer transition-all
      "
        onClick={() => setOpenDailog(true)}
      >
        <h2 className=" text-lg text-center">+ Add New </h2>
      </div>

      <Dialog open={openDailog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about Job you are interviewing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit}>
                <div>
                  <h2>
                    Add Details about your job position/role, Job description
                    and years of experience
                  </h2>

                  <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input required placeholder="Ex. Full Stack Developer" 
                    onChange={(e)=>setJobPosition(e.target.value)}
                    />
                  </div>

                  <div className="my-3">
                    <label>Job Description/Tech Stack (In Short)</label>
                    <Textarea
                      required
                      placeholder="Ex. React, Angular, NodeJs, MySql etc"
                      onChange={(e)=>setJobDesc(e.target.value)}
                    />
                  </div>

                  <div className=" my-3">
                    <label>Years of experience</label>
                    <Input required placeholder="5" type="number" 
                     onChange={(e)=>setJobExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    onClick={() => setOpenDailog(false)}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {
                        loading ?
                        <>
                        <LoaderCircle className="animate-spin"/> 'Generating from AI'
                        </>
                        :
                        'Start Interview'
                    }
                    </Button>
                    
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNew;
