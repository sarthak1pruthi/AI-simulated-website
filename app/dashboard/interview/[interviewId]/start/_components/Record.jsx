"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/Gemini";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";


const Record = ({mockQuestion , activeIndex , interviewData}) => {

    const {user}=useUser()
    const [loading,setLoading]=useState(false)
    // console.log("mockQuestionanswer",mockQuestion[activeIndex]?.Answer)
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer,setUserAnswer]=useState('')
  useEffect(()=>{
    results.map((res)=>(
        setUserAnswer(prev=>prev+res?.transcript)
    ))
  },[results])


  useEffect(()=>{
    if(!isRecording && userAnswer.length>10){
      updateAnswerInDb()
    }
  },[userAnswer])

const updateAnswerInDb=async()=>{
  // console.log("hii buffy")
  // console.log("user ghjgjh",userAnswer)
  setLoading(true)
  const feedbackPrompt="Question:"+mockQuestion[activeIndex]?.Question +
  ", User Answer:"+userAnswer+",depends on question and user answer for give interview question "+
  "please give us rating for answer and feedback as area of improvment if any"+
  "in just 3 to 5 lines to improve in JSON format with rating field and feedback field"
  console.log("feedback prompt",feedbackPrompt)

  const result=await chatSession.sendMessage(feedbackPrompt);

  const mockJsonRes=(result.response.text().replace('```json','').replace('```',''));

  // console.log("df",mockJsonRes)

  const JsonFeedbackRes=JSON.parse(mockJsonRes);
  // console.log("ss",JsonFeedbackRes)

  const resp=await db.insert(UserAnswer)
  .values({
      mockIdRef:interviewData?.mockId,
      question:mockQuestion[activeIndex]?.Question,
      userAns:userAnswer,
      correctAns:mockQuestion[activeIndex]?.Answer,
      feedback:JsonFeedbackRes?.feedback,
      rating:JsonFeedbackRes?.rating,
      userEmail:user?.primaryEmailAddress?.emailAddress,
      createdAt:moment().format('DD-MM-YYYY')
  })

  if(resp){
    // console.log("Updated Successfully")
      toast("User Answer recorded successfully")
    setUserAnswer('')
    setResults([])
  }
  setResults([])
  setLoading(false)
}

  const startStopRec=async()=>{
    if(isRecording){
        stopSpeechToText()
    }
    else{
        startSpeechToText()
    }
  }

  

  return (
    <div className="flex items-center justify-center  flex-col">
      <div className="flex flex-col my-10 justify-center  items-center rounded-lg p-5">
        {/* <Image src={'/webcam.png'} width={200} height={200} */}
        {/* className='absolute' */}
        {/* /> */}
        <Webcam
          mirrored={true}
          style={{ height: 300, width: "100%", zIndex: 10 }}
        />
      </div>

      <Button variant="outline" className="my-5"
      disabled={loading}
      onClick={startStopRec}
      >
        {
            isRecording ? <h2 className="text-red-600 flex gap-2"><Mic />Stop Recording</h2> : "Record Answer"
        }
        
      </Button>


      {/* <Button onClick={()=>console.log(userAnswer)}>Show User Answer</Button> */}
    </div>
  );
};

export default Record;
