"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  
  const [inputData, setInputData] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [btnVisible, setBtnVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [flowFinished, setFlowFinished] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [itineraryCorrected, setItineraryCorrected] = useState(false);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if(!flowFinished){
        initFlow() 
      }else{
        sendFeedback();
      }
    }
  };

  /*const resetDataUser = async () => {
    try{
      const res = await axios.get('http://localhost:5001/api/reset');
      return res;
    }catch(error){
      console.error('Error al resetear la conversacion:', error)
    }
  }*/

  const initFlow = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`/api/generate-itinerary`, {
        respuesta: inputData
      },{
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${apiKey}`
        }
      });

      const userMessage = { role: "user", content: inputData };
      const assistanceResponse = res.data.pregunta ?? res.data.response;
      const systemMessage = { role: "system", content: assistanceResponse };
      
      if(assistanceResponse.includes('¡Aquí está tu itinerario!')){
        setFlowFinished(true);
      };
      // Actualiza el estado de messages usando la función de actualización
      setMessages(prevMessages => [...prevMessages, userMessage, systemMessage]);
      console.log('messages:', messages);

      setInputData('');
      setLoading(false);
      
      //return res.data.pregunta;
    } catch (error) { 
      console.error('Error al obtener la conversacion:', error)
    }
  }

  const sendFeedback = async () => {
    try {
      const res = await axios.post(`/api/feedback-itinerary`, {
        feedback: inputData
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${apiKey}`
        }
      });
      console.log('nuevo itinerario:', res.data.response);

      updateMessages(res.data.response, inputData);
      setItineraryCorrected(true);
    } catch (error) {
      console.error('Error al obtener el itinerario corregido:', error);
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateMessages = (messageFormAI: string, inputDataUser:string) => {
    // Actualiza el estado de messages usando la función de actualización
    const userMessage = { role: "user", content: inputDataUser };
    const systemMessage = { role: "system", content: messageFormAI };
    setMessages(prevMessages => [...prevMessages, userMessage, systemMessage]);
  }

  return (
    <div className="wrapper">
      <div className="">
          <div className="p-2 gap-2">
            <div className="flex justify-center">
              <Image src="/assistant-trip.png" className="pt-5 pb-5 w-auto h-auto" width={80} height={40} alt="assistant trip image" />
            </div>
            {
              btnVisible && 
              <div className="bg-gray ballon">
                <h1 className="pb-3 h1">Hola ¿Deseas viajar a Costa Rica, pero no sabes qué hacer? Soy un asesor de viajes y puedo ayudarte con tu itinerario acorde a tus necesidades.</h1>
              </div>
            }
            
          </div>
          <div className="chat p-2">

              <div className="mb-3">
                  <ul>
                    {messages.map((message, index) => (
                      <li key={index} className="box-assistance mb-3">
                        {
                          message.content && 
                          <div ref={messagesEndRef} className={message.role === "system" ? "bg-turquoise p-4 box whitespace-break-spaces" : "bg-gray p-4 box whitespace-break-spaces"}>
                          {message.content}
                          </div>
                        }
                      </li>
                    ))}
                  </ul>
                </div>
                {!itineraryCorrected &&  
                                  <div className="w-full p-4 ballon bg-gray flex flex-column md:flex-row justify-between">
                                  {
                                    inputEnabled && 
                                    <div className="w-full">
                                        <textarea
                                          className="w-full p-4 h-20 bg-transparent resize-none"
                                          placeholder={ !flowFinished ? "Tu respuesta aquí..." : "Deseas modificar algo?"}
                                          autoFocus
                                          value={inputData}
                                          onChange={(e) => setInputData(e.target.value)}
                                          onKeyUp={handleKeyPress}
                                      />
                                    </div>
                                    
                                  }
                                  
                                  <div className="flex justify-between">
                                        {/* <button  className="p-4">
                                          <FontAwesomeIcon icon={faUpload} />
                                        </button> 
                                      <button onClick={handleAsk} className="rounded-lg p-4 bg-blue-500">
                                          Pregúntame algo
                                      </button>*/}
                                        {
                                          btnVisible && 
                                          <button 
                                          onClick={()=>{
                                            setBtnVisible(false);
                                            setInputEnabled(true);
                                            //resetDataUser();
                                            initFlow();
                                          }}
                                          className="btn">
                                          Iniciar Itinerario
                                          </button>
                                        }
                                        { 
                                            !btnVisible && !flowFinished &&
                                            <button  
                                            onClick={initFlow} 
                                            className="btn"
                                            disabled={inputData.trim() === '' || loading}>
                                              {
                                                loading ? 'Generando Itinerario...' : 'Siguiente'
                                              }
                                            </button>
                                        }
                                        {
                                            flowFinished &&
                                            <button
                                              onClick={()=>{sendFeedback()}}
                                              className="btn">
                                            Modificar algo
                                          </button>
                                        }
                                  </div>
                                </div>
                }
            </div>
          </div>
    </div>
  );
}
