import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

const QuestionSection = ({ mockQuestion, activeIndex }) => {
    // console.log("asdas",mockQuestion)

    const textToSpeech=(text)=>{
      if('speechSynthesis' in window){
        const speech=new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
      }
      else{
        alert('Sorry , Your Browser does not support text to speech')
      }
    }
  return mockQuestion &&(
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockQuestion &&
          mockQuestion.map((e, i) => {
            return (
              <React.Fragment key={i}>
                <h2 className={`cursor-pointer p-2  rounded-full text-xs md:text:sm text-center
                    ${activeIndex==i ? 'bg-primary text-white' :'bg-secondary'}
                    `}>
                  Question # {i + 1}
                </h2>
              </React.Fragment>
            );
          })}
      </div>
          <h2 className="my-5 text-sm md:text-lg">{mockQuestion[activeIndex]?.Question}</h2>
          <Volume2 className="cursor-pointer" onClick={()=>textToSpeech(mockQuestion[activeIndex]?.Question)}/>
          <div className="border rounded-lg p-5 bg-blue-100 my-20">
            <h2 className="flex gap-2 items-center text-primary"><Lightbulb />
            <strong>Note:</strong>
            </h2>
            <h2 className="text-sm text-primary my-2">
          Click on Record Answer when you want to answer the question. At the end of interview we will give you the feedback along with correct answer for each of question and your answer to compare it.

            </h2>
          </div>
    
    
    </div>
  );
};

export default QuestionSection;
