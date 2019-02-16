import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const Navigation = styled.div`
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  height: 100vh;
  border-right: 1px solid rgba(0, 0, 0, 0.125);
`;
export const Body = styled.div`
  padding: 12px;
  height: 100vh;
`;

export const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
`;

export const ExampleContainer = styled.div`
  background: #fff;
  border: 1px solid #e5e5e5;
  height: calc(100vh - 40px);
`;

export const ExampleNavigation = styled(Navigation)`
  height: 100%;
  margin-right: 4px;
  border: 1px solid rgba(0, 0, 0, 0.125);  
`;

export const ExampleBody = styled.div`  
  background: #fff;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.125);
`;
