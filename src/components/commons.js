import { Input } from "baseui/input";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #121212;
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 4rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(15, 15, 15, 0.6);
  background-color: #1c1c1c;
  max-height: 80vh;
  max-width: 80vw;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0;
`;

export const FormButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0;
  gap: 1rem;
  padding: 2rem 0 0 0;
`;


export const StyledInput = styled(Input)`
  width: 100%;
  margin-bottom: 20em !important;
`;

export const DefaultHeader = styled.span`
  color: white;
  font-size: xx-large;
  font-weight: bold;
  padding: 2rem;
  text-align: left;
  align-self: center;
`;
