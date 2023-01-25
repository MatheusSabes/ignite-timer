import styled, { css } from "styled-components";

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'

interface ButtonContainerProps {
  variant: ButtonVariant;
}

const buttonVariants = {
  primary: 'purple',
  secondary: 'orange',
  danger: 'red',
  success: 'green'
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height:40px;
  border: none;
  border-radius: 4px;
  margin: 0 8px;
  color: ${props => props.theme.white};
  background-color: ${props => props.theme["green-500"]};
  
 
`