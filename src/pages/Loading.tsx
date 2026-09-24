import { useEffect } from "react"
import { useNavigate } from "react-router"

import LoadingScreen from "../components/LoadingScreen"

function Loading() {
  const navigate = useNavigate()

  useEffect(() => {
    // ponytail: forced 3.2s delay purely for cinematic effect. 
    // Upgrade path: tie this to actual asset preloading if the bundle/assets get large.
    const timer = setTimeout(() => {
      navigate("/profiles", { replace: true })
    }, 3200)

    return () => clearTimeout(timer)
  }, [navigate])

  return <LoadingScreen />
}

export default Loading
