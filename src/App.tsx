import { useState } from "react"
interface ChatHistory {
  role: 'user' | 'model'
  parts: string
}
export default function App() {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])

  const surpriseOption: Array<string> = [
    "Who won the last football World Cup?",
    "where does the fox live?",
    "who makes the best cake?",
  ]


  const getResponse = async () => {
    if (!value) {
      setError("Error! Please enter a question")
      return
    }

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }

      const res = await fetch("http://localhost:8000/gemini", options)
      const data = await res.text()
      setChatHistory(oldHistory => [...oldHistory, {
        role: "user",
        parts: value
      }, {
        role: "model",
        parts: data
      }
      ])
      setValue("")

    } catch (error) {
      setError("Something went wrong. Please try again later.")
    }

  }

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }

  const surprise = () => {
    const randomValue = surpriseOption[Math.floor(Math.random() * surpriseOption.length)]
    setValue(randomValue)
  }

  return (
    <main className="h-screen  flex  items-center justify-center">
      <div className="w-[80%] flex flex-col gap-4">
        <section className="flex items-center justify-start gap-4 ">
          <p className="text-gray-500 text-xl font-thin">What do you Want to Know?</p>
          <button
            className="bg-gray-200 px-2 font-semibold py-1 rounded-md"
            type="button"
            onClick={surprise} disabled={!chatHistory}
          >
            Surpise Me
          </button>
        </section>

        <section className="flex items-center gap-2 rounded-md h-14 overflow-hidden shadow-md p-2">
          <input
            type="text"
            value={value}
            placeholder="Enter Your Question"
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-full outline-none"
          />
          {!error && <button onClick={getResponse} className="text-gray-500 font-bold border-l-2 w-24 h-full" type="button">Ask Me</button>}
          {error && <button onClick={clear} className="text-gray-500 font-bold border-l-2 w-24 h-full" type="button">Clear</button>}
        </section>

        <section className="flex items-center gap-2 justify-center text-red-500">
          {error && <p>{error}</p>}
        </section>


        <section className="flex flex-col gap-2">
          {
            chatHistory.length <= 0 ? <p className="text-gray-500">No Chats Found</p>
              :
              chatHistory.map((data, index) => {
                return <div key={index} className="text-gray-500 flex gap-4  rounded-md  overflow-hidden shadow-md p-4">
                  <span className="capitalize" >{data.role}:</span>
                  <span>
                    {data.parts}
                  </span>

                </div>
              })
          }
        </section>
      </div>

    </main >

  )
}