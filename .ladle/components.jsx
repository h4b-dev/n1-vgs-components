import { useEffect } from "react"
import '../src/global.css'

export const Provider = ({ children, globalState }) => {
  useEffect(() => {
    if (globalState.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [globalState.theme])
  return children
}
