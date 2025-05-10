import styled from "styled-components";

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 20rem 0.8fr; /* Two columns: label and input */
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.2rem;
  color: var(--color-red-700);
  grid-column: span 2; /* Error spans across both columns */
  margin-top: 0.8rem;
  padding-left: 1rem;
`;

function FormRow({ label, error, children }) {
  return (
    <StyledFormRow>
      {label && (
        <Label htmlFor={children.props?.id || children.props?.name}>
          {label}
        </Label>
      )}
      <div>
        {children}
        {error && <Error>{error}</Error>}
      </div>
    </StyledFormRow>
  );
}

export default FormRow;
