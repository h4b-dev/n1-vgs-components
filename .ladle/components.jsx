import { useEffect } from "react"
import '../src/global.css'

export const Provider = ({ children, globalState }) => {
  useEffect(() => {
    if (globalState.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    if (!window.crypto.randomUUID) {
  	window.crypto.randomUUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }
}
  }, [globalState.theme])
  return children
}
