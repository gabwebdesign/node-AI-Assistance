"use client";
import { faAtom } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";

export default function Home() {

  const [inputData, setInputData] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [response, setResponse] = useState('');
  const [inputEnabled, setInputEnabled] = useState(false);
  const [btnVisible, setBtnVisible] = useState(true);

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

      //console.log('Messages:', messages);

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

  const initFlow = async () => {
    setInputEnabled(true);
    setBtnVisible(false);

    try {
      const res = await axios.post('http://localhost:5001/api/flows', {
        respuesta: inputData
      } );
      console.log("response.data.pregunta ",res.data.pregunta)
      const assistanceResponse = res.data.pregunta ?? res.data.response;
      
      const updatedMessages = [{ role: "system", content: assistanceResponse }];
      setMessages(updatedMessages);
      setInputData('');
      return res.data.pregunta;
    } catch (error) { 
      console.error('Error al obtener la conversacion:', error)
    }
  }


  return (
    <div className="wrapper">
      <div className="container-grid">
          <div className="p-10"><h1 className="pb-3">Hola,<br /> ¿Deseas viajar a Costa Rica, pero no sabes qué hacer? Soy un asesor de viajes y puedo ayudarte con tu itinerario acorde a tus necesidades.</h1></div>
          <div className="chat p-10">
                <div className="w-full p-4 rounded-lg bg-blue-600">
                  {
                    inputEnabled &&
                    <input
                      type="text"
                      className="w-full p-4 h-20 bg-transparent text-white resize-none"
                      placeholder="Escribe tu pregunta aquí..."
                      autoFocus
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      onKeyUp={handleKeyPress}
                    />
                  }
                  
                  <div className="flex justify-between">
                        {/* <button  className="p-4">
                          <FontAwesomeIcon icon={faUpload} />
                        </button> 
                      <button onClick={handleAsk} className="rounded-lg p-4 bg-blue-500">
                          Pregúntame algo
                      </button>*/}
                        {
                        btnVisible ? (
                          <button 
                          className="rounded-lg p-4 bg-blue-500"
                          onClick={initFlow}>
                          Iniciar Itinerario
                          </button>
                          ) : (
                          <button  
                          onClick={initFlow} 
                          className="rounded-lg p-4 bg-blue-500"
                          disabled={inputData.trim() === ''}
                          >
                          Contestar
                          </button>
                          )
                        }
                  </div>
                </div>
                
                <br />
                <div>
                  <ul>
                    {messages.map((message, index) => (
                      <li key={index} className="p-4 m-2 box-assistance">
                        <div className={message.role === "system" ? "bg-indigo-700 p-4 box text-white" : "rounded-lg bg-blue-600 p-4 text-white"}>
                          {message.content}
                        </div>
                        <div className="">
                          { message.role === "user" ? 
                          ""
                          : 
                          <div className="bg-indigo-700 p-3 w-fit icon">
                            <FontAwesomeIcon icon={faAtom} />
                          </div>
                          }
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>
          </div>
    </div>
  );
}
