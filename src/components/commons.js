import {Input} from "baseui/input";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {Select} from "baseui/select";

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

export const HomeWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 4rem;
    border-radius: 1rem;
    height: 80vh;
    width: 80vw;
`;


export const InputWrapper = styled.div`
  width: 100%;
  margin: 1rem 0;
`;

export const SearchInputWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 1rem 0;
    gap: 1rem;
`;

export const FormButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0;
  gap: 1rem;
  padding: 1rem 0 0 0;
`;

export const LoginLinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 1rem 0;
  padding: 1rem 0 0 0;
`;

export const RegisterLinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0;
  padding: 1rem 0 0 0;
`;

export const StyledInput = styled(Input)`
  width: 100%;
  margin-bottom: 20em !important;
`;

export const StyledSelect = styled(Select)`
  width: 100%;
  padding: 0 0 2rem 0;
`;

export const DefaultHeader = styled.span`
  color: white;
  font-size: xx-large;
  font-weight: bold;
  padding: 2rem;
  text-align: left;
  align-self: center;
`;


export const DefaultLink = styled(Link)`
  color: rebeccapurple;
  font-size: large;
  transition: transform .1s ease-in;

  &:hover {
    transform: scale(1.03);  
  }
`;

export const SearchWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
    padding: 1rem 0 2rem 0;
`;