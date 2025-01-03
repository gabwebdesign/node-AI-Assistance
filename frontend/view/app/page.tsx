"use client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [inputData, setInputData] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [response, setResponse] = useState('');
  const [inputEnabled, setInputEnabled] = useState(false);
  const [btnVisible, setBtnVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [flowFinished, setFlowFinished] = useState(false);

  const handleAsk = async () => {

    if (inputData.trim() === '') {
      alert('Debes escribir una pregunta.');
      return;
    }
    const updatedMessages = [...messages, { role: "user", content: inputData }];
    setMessages(updatedMessages);

    try {

      const res = await axios.post('http://localhost:5001/api/ask', 
        { messages: updatedMessages.length ? updatedMessages : [{ role: "system", content: "You are a helpful assistant." }] });
      setResponse(JSON.stringify(res.data.response));

      const updateWithSystemAnswer = [...updatedMessages, { role: "system", content: res.data.response.content }];
      setMessages(updateWithSystemAnswer);

    } catch (error) {
      console.error('Error al obtener la respuesta:', error);
      setResponse('Hubo un error. Intenta nuevamente.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      initFlow();
    }
  };

  const resetDataUser = async () => {
    try{
      const res = await axios.get('http://localhost:5001/api/reset');
      return res;
    }catch(error){
      console.error('Error al resetear la conversacion:', error)
    }
  }

  const initFlow = async () => {
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5001/api/flows', {
        respuesta: inputData
      } );

      const userMessage = { role: "user", content: inputData };
      const assistanceResponse = res.data.pregunta ?? res.data.response;
      const systemMessage = { role: "system", content: assistanceResponse };
      if(assistanceResponse.includes('¡Aquí está tu itinerario!')) setFlowFinished(true);
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

  return (
    <div className="wrapper">
      <div className="">
          <div className="p-2 gap-2">
            <div className="flex justify-center">
              <Image src={"/assistant-trip.png"} className="pt-5 pb-5 w-auto h-auto" width={80} height={40} alt="assistant trip image" />
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
                        <div className={message.role === "system" ? "bg-gray p-4 box whitespace-break-spaces" : "rounded-lg bg-gray p-4 whitespace-break-spaces"}>
                          {message.content}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full p-4 ballon bg-gray flex flex-column md:flex-row justify-between">
                  {
                    inputEnabled &&
                    <div>
                        <input
                          type="text"
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
                            resetDataUser();
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
                                loading ? 'Cargando...' : 'Siguiente'
                              }
                            </button>
                        }
                        {
                            flowFinished &&
                            <button
                              onClick={handleAsk}
                              className="btn">
                            Preguntar
                          </button>
                        }
                  </div>
                </div>
                

            </div>
          </div>
    </div>
  );
}
