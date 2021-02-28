import React, { useEffect, useRef, useState, useMemo } from "react"
import Form from "react-bootstrap/esm/Form"
import Button from "react-bootstrap/esm/Button"
import { getNewQuote } from "../requests"
import ProgressBar from "react-bootstrap/esm/ProgressBar"

interface Props {
  socket: any
  username: string
}

interface User {
  username: string
  progress: number
}

interface Text {
  quote: string
  lider: string
}

interface Self {
  username: string
  progress: number
  isLider: boolean
}

const Race: React.FC<Props> = ({ socket, username }) => {
  const input: any = useRef(null)

  const [user, setUser] = useState<Self>({
    username,
    progress: 0,
    isLider: false,
  })
  const [text, setText] = useState<Text>({ quote: "", lider: "" })
  const [myText, setMyText] = useState<string>("")
  const [isCorrect, setIsCorrect] = useState<boolean>(true)
  const [isFinished, setIsFinished] = useState<boolean>(false)
  const [users, setUsers] = useState<User[]>([])

  const focus = () => {
    input.current.focus()
  }

  useEffect(() => {
    socket.on("text", (text: Text) => {
      setText(text)
      let { lider, quote } = text
      if (lider === user.username) {
        setUser({ ...user, isLider: true })
      } else if (quote !== "") {
        setIsFinished(false)
      }
      setMyText("")
    })
  }, [socket])

  useEffect(() => {
    socket.on("users", (users: User[]) => {
      setUsers(users)
    })
				}, [socket])

  useEffect(() => {
    if (text.quote === myText) {
      setIsFinished(true)
      return
    }
    let correct = false
    if (text.quote.indexOf(myText) === 0) {
      correct = true
    }
    setIsCorrect(correct)
  }, [myText]) // Maybe this is bad only "TEXT"

  useEffect(() => {
    socket.emit("update-progress", { progress: user.progress, username })
  }, [user.progress, socket, username])

  useEffect(() => {
    socket.emit("update-text", text)
  }, [text.quote, socket])

  const newQuote = async () => {
    setMyText("")
    const newQuote = await getNewQuote()
    setText({ ...text, quote: newQuote })
    focus()
    setIsFinished(false)
  }

  const haveUsersFinished = useMemo(() => {
    let finished: boolean = true
    if (text.quote === "") return true
    users.every(({ progress }: User) => {
      if (progress != 100) {
        finished = false
        return false
      }
      return true
    })
    debugger
    return finished
  }, [users, text.quote])

  useEffect(() => {
    const progress = Math.floor(
      isFinished
        ? 100
        : (100 * (myText.split(" ").length - 1)) / text.quote.split(" ").length
    )
    setUser({ ...user, progress })
  }, [myText, text.quote, isFinished])

  console.log(haveUsersFinished)

  return (
    <div className="race">
      <Form.Group
        // onChange={(e: any) => setRace(e.target.value)}
        controlId="exampleForm.ControlmyTextarea1"
      >
        <Form.Label>
          {" "}
          <h2>{text.quote}</h2>{" "}
        </Form.Label>
        <Form.Control
          readOnly={isFinished}
          value={myText}
          onChange={(e: any) => setMyText(e.target.value)}
          as="textarea"
          className={`${isFinished ? "" : isCorrect ? "correct" : "incorrect"}`}
          rows={3}
          ref={input}
        />
      </Form.Group>

      <ProgressBar className="bar" now={user.progress} />
      <Button
        disabled={!user.isLider || !haveUsersFinished}
        onClick={newQuote}
        variant="primary"
      >
        {" "}
        New quote{" "}
      </Button>
      {isFinished ? <h1> GG </h1> : null}
      <hr></hr>
      {users.map(({ username, progress }: User, index: number) => (
        <div key={index}>
          <h2> Username: {username} </h2>
          <ProgressBar className="bar" now={progress} />
        </div>
      ))}
    </div>
  )
}
export default Race
