import React from 'react';

const FormPage = () => {
  const formCode = `
    <form>
      <!-- Your form HTML code here -->
    </form>
  `;

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(formCode)
      .then(() => {
        alert('Form code copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to copy form code:', error);
      });
  };

  return (
    <div>
      {/* Your form UI here */}
      <button onClick={copyCodeToClipboard}>Copy Form Code</button>
    </div>
  );
};

export default FormPage;
