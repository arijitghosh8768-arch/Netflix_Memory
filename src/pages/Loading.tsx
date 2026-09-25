import { useNavigate } from "react-router"
import LoadingScreen from "../components/LoadingScreen"

function Loading() {
  const navigate = useNavigate()

  const handleComplete = () => {
    navigate("/profiles", { replace: true })
  }

  return <LoadingScreen onComplete={handleComplete} />
}

export default Loading
