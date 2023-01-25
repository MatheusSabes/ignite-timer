import { ThemeProvider } from "styled-components"
import { Button } from "./components/Button"

import { GloboStyle } from "./styles/globa"
import { defaultTheme } from "./styles/themes/default"

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Button variant="primary"/>
      <Button variant="secondary"/>
      <Button variant="success"/>
      <Button variant="danger"/>
      <Button />
      teste
      <GloboStyle />
    </ThemeProvider>
  )
}

