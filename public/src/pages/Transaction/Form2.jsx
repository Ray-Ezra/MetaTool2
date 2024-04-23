
import React, { useState,useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddToken from './addToken';
import { useTokenContext } from '../../../constants/TokenContext';
import { FaUserPlus, FaTrash } from 'react-icons/fa';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import TokenTable from '../Transaction/tokens';
import CSVDetailsModal from './csvForms/local';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const Form2 = ({ onNextForm }) => {
  const { tokens: initialTokens, setTokens } = useTokenContext();
  const [recipients, setRecipients] = useState([
    { id: 1, name: '', organization: '', wallet: '', selectedTokens: [], tokenCount: 0,   cryptoData: null },
  ]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showTokenTable, setShowTokenTable] = useState(false);
  const [selectedRecipientId, setSelectedRecipientId] = useState(0)
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvCurrencyName, setCsvCurrencyName] = useState('');
  const [csvAmount, setCsvAmount] = useState(0);
  const [csvRate, setCsvRate] = useState(0);
  const cryptoData = JSON.parse(localStorage.getItem('cryptoData'))
  console.log(cryptoData)


  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
  };

  useEffect(() => {
    // Fetch cryptoData from local storage
    const cryptoData = JSON.parse(localStorage.getItem('cryptoData'));
    if (cryptoData) {
      // Update recipients with cryptoData
      setRecipients(prevRecipients => {
        const updatedRecipients = prevRecipients.map(recipient => {
          return {
            ...recipient,
            cryptoData: cryptoData,
          };
        });
        return updatedRecipients;
      });
    }
  }, []);
 

  const isNameValid = /^[a-zA-Z]+[a-zA-Z\s]*$/;
  const isWalletValid = /^[a-zA-Z0-9]{25,}$/;

  const handleNext = () => {
    if (recipients.some((recipient) => !recipient.name || !recipient.organization)) {
      toast.error('All fields are required for each recipient, and at least one token must be selected.', toastOptions);
      return;
    }

    if (recipients.every((recipient) => isNameValid.test(recipient.name) && isWalletValid.test(recipient.wallet))) {
      console.log('Form2 Data:', recipients);
      const formData = {
        recipients: recipients,
        tokens: initialTokens.map((token) => ({
          name: token.name,
          amount: token.amount,
        })),
        csvDetails: {
          currencyName: csvCurrencyName,
          amount: csvAmount,
          rate: csvRate,
        }
      };
      onNextForm(4, formData);
    } else {
      toast.error('Invalid Name or Wallet Address.', toastOptions);
    }
  };

  const handleRecipientChange = (id, field, value) => {
    setRecipients((prevRecipients) =>
      prevRecipients.map((recipient) =>
        recipient.id === id ? { ...recipient, [field]: value } : recipient
      )
    );
  };


  const handleTokenChange = (id, selectedTokens) => {
    const newCryptoData = JSON.parse(localStorage.getItem('cryptoData'))
    setRecipients(prevRecipients => {
      const updatedRecipients = prevRecipients.map(recipient => {
        if (recipient.id === id) {
          return { ...recipient, selectedTokens: selectedTokens, tokenCount: selectedTokens.length, cryptoData: newCryptoData };
        }
        return recipient;
      });
      setTokens(getCombinedTokens(updatedRecipients)); 
      // setSelectedRecipientId(id)
      // console.log('selected:',selectedRecipientId)
      return updatedRecipients;
    });
  };

  const getCombinedTokens = (recipients) => {
    let combinedTokens = [];
    recipients.forEach(recipient => {
      combinedTokens = combinedTokens.concat(recipient.selectedTokens);
    });
    // Remove duplicates if any
    combinedTokens = combinedTokens.filter((token, index) => combinedTokens.indexOf(token) === index);
    return combinedTokens;
  };


  const addRecipient = () => {
    const newRecipientId = recipients.length + 1;
    setRecipients((prevRecipients) => [
      ...prevRecipients,
      { id: newRecipientId, name: '', organization: '', wallet: '', selectedTokens: [], tokenCount: 0 ,cryptoData: null },
    ]);
  };

  const removeRecipient = (id) => {
    setRecipients((prevRecipients) =>
      prevRecipients.filter((recipient) => recipient.id !== id)
    );
  };

  //  const handleOverlaySubmit = (submittedTokens) => {     setTokens(submittedTokens); // Update tokens state with the submitted tokens
  //   setShowOverlay(false); // Close the overlay after submission
  // };
  const handleTokenClick = (recipientId) => {
    setShowTokenTable(!showTokenTable);
    setSelectedRecipientId(recipientId);
    console.log('selected:', recipientId);
  };

  // Function to close the token table
  const handleCloseTokenTable = () => {
    setShowTokenTable(false);
  };

  // const updateTokenCount = (recipientId) => {
  //   setRecipients(prevRecipients => {
  //     return prevRecipients.map(recipient => {
  //       if (recipient.id === recipientId) {
  //         return { ...recipient, tokenCount: recipient.selectedTokens.length };
  //       }
  //       return recipient;
  //     });
  //   });
  // };

  const handleRemoveToken = (recipientId, tokenIndex) => {
    setRecipients(prevRecipients => {
      const updatedRecipients = prevRecipients.map(recipient => {
        if (recipient.id === recipientId) {
          const updatedTokens = [...recipient.selectedTokens];
          updatedTokens.splice(tokenIndex, 1);
          return { ...recipient, selectedTokens: updatedTokens, tokenCount: updatedTokens.length };
        }
        return recipient;
      });
      // updateTokenCount(recipientId)
      return updatedRecipients;
    });
  };

  const handleOverlaySubmit = (submittedTokens) => {
    setTokens(submittedTokens);
    setShowOverlay(false);
  };
  const handleAddToken = (recipientId, newToken) => {
    const newCryptoData = JSON.parse(localStorage.getItem('cryptoData'));
    setRecipients(prevRecipients => {
      const updatedRecipients = prevRecipients.map(recipient => {
        if (recipient.id === recipientId) {
          let updatedTokens;
          // Check if no tokens have been selected
          if (recipient.selectedTokens.length === 0 && newCryptoData) {
            // If no tokens have been selected and cryptoData is available, use tokens from cryptoData
            const selectedTokensFromCryptoData = newCryptoData.map(data => ({
              name: data.name,
              amount: data.amount,
            }));
            updatedTokens = [...selectedTokensFromCryptoData, newToken];
          } else {
            // Otherwise, add the new token to the selectedTokens array
            updatedTokens = [...recipient.selectedTokens, newToken];
          }
          return { ...recipient, selectedTokens: updatedTokens, tokenCount: updatedTokens.length };
        }
        return recipient;
      });
      return updatedRecipients;
    });
  };
  
  

  // const handleAddToken = (recipientId, newToken) => {
  //   // const newCryptoData = JSON.parse(localStorage.getItem('cryptoData'));
  //   setRecipients(prevRecipients => {
  //     const updatedRecipients = prevRecipients.map(recipient => {
  //       if (recipient.id === recipientId) {
  //         const updatedTokens = [...recipient.selectedTokens, newToken];
  //         // const updatedCryptoData = { ...newCryptoData };
  //         return { ...recipient, selectedTokens: updatedTokens, tokenCount: updatedTokens.length,
  //           //  cryptoData: updatedCryptoData
  //            };
  //       }
  //       return recipient;
  //     });
  //     // updateTokenCount(recipientId)
  //     return updatedRecipients;
  //   });
  // };
  console.log('s:', selectedRecipientId)

  const handleCSVSubmit = (formData) => {
    setRecipients(prevRecipients => {
      const updatedRecipients = prevRecipients.map(recipient => {
        if (recipient.id === selectedRecipientId) {
          return { 
            ...recipient, 
            cryptoData: formData, // Update recipient's cryptoData
          };
        }
        return recipient;
      });
      return updatedRecipients;
    });
  };
  

  
  return (
    <div style={{marginTop: '20px'}}>
      {recipients.map((recipient, index) => (
        <div key={index} style={{ backgroundColor: '#F2EEE3', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', padding: '20px', borderRadius: '10px', marginBottom: '20px', color: 'black', width: '400px' }}>
          <h2 style={{ transform: 'translateX(32%)' }}>Recipient {index + 1}</h2>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label htmlFor={`name-${recipient.id}`} style={{ marginBottom: '5px', display: 'block', width: '80%', minWidth: '80px', fontWeight: 'bold' }}>Name:</label>
            <input
              type="text"
              id={`name-${recipient.id}`}
              name={`name-${recipient.id}`}
              value={recipient.name}
              onChange={(e) => handleRecipientChange(recipient.id, 'name', e.target.value)}
              style={{
                width: 'calc(100% - 20px)', // Adjusted width
                padding: '10px',
                marginBottom: '10px',
                border: 'none', // Remove default border
                borderBottom: '1px solid black', // Add bottom border
                boxSizing: 'border-box',
                background: 'transparent', // Set transparent background
                transition: 'border-bottom-color 0.3s, box-shadow 0.3s', // Add transition for smooth color change and box shadow
                outline: 'none', // Remove default focus outline
              }}
              onFocus={(e) => {
                e.target.style.borderBottomColor = '#6B8065'; // Change bottom border color on focus
                e.target.style.boxShadow = '0 0 10px 3px #6B8065'; // Add box shadow on focus
              }}
              onBlur={(e) => {
                e.target.style.borderBottomColor = 'black'; // Reset bottom border color on blur
                e.target.style.boxShadow = 'none'; // Remove box shadow on blur
              }}
            />

          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label htmlFor={`organization-${recipient.id}`} style={{ marginBottom: '5px', display: 'block', width: '80%', minWidth: '80px', fontWeight: 'bold' }}>Organization:</label>
            <input
              type="text"
              id={`organization-${recipient.id}`}
              name={`organization-${recipient.id}`}
              value={recipient.organization}
              onChange={(e) => handleRecipientChange(recipient.id, 'organization', e.target.value)}
              style={{
                width: 'calc(100% - 20px)', // Adjusted width
                padding: '10px',
                marginBottom: '10px',
                border: 'none', // Remove default border
                borderBottom: '1px solid black', // Add bottom border with black color
                boxSizing: 'border-box',
                background: 'transparent', // Set transparent background
                transition: 'border-bottom-color 0.3s, box-shadow 0.3s', // Add transition for smooth color change and box shadow
                outline: 'none', // Remove default focus outline
              }}
              onFocus={(e) => {
                e.target.style.borderBottomColor = '#6B8065'; // Change bottom border color on focus
                e.target.style.boxShadow = '0 0 10px 3px #6B8065'; // Add box shadow on focus
              }}
              onBlur={(e) => {
                e.target.style.borderBottomColor = 'black'; // Reset bottom border color on blur
                e.target.style.boxShadow = 'none'; // Remove box shadow on blur
              }}
            />


          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label htmlFor={`wallet-${recipient.id}`} style={{ marginBottom: '5px', display: 'block', width: '80%', minWidth: '80px', fontWeight: 'bold' }}>Wallet Address:</label>
            <textarea
              id={`wallet-${recipient.id}`}
              name={`wallet-${recipient.id}`}
              value={recipient.wallet}
              rows="4"
              onChange={(e) => handleRecipientChange(recipient.id, 'wallet', e.target.value)}
              style={{
                width: 'calc(100% - 20px)', // Adjusted width
                padding: '5px',
                marginBottom: '10px',
                border: '1px solid black', // Add all borders with black color
                borderRadius: '5px', // Add border radius
                boxSizing: 'border-box',
                background: 'transparent', // Set transparent background
                transition: 'border-color 0.3s, box-shadow 0.3s', // Add transition for smooth color change and box shadow
                outline: 'none', // Remove default focus outline
                resize: 'vertical', // Allow vertical resizing
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6B8065'; // Change border color on focus
                e.target.style.boxShadow = '0 0 10px 3px #6B8065'; // Add box shadow on focus
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'black'; // Reset border color on blur
                e.target.style.boxShadow = 'none'; // Remove box shadow on blur
              }}
            />



          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="token-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px', width: '8rem', borderRadius: '10px', padding: '2px' }}>
              <div className="token-count" onClick={() => handleTokenClick(recipient.id)} style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', borderRadius: '10px', marginRight: '10px', marginLeft: '2px' }}>
                {recipient.tokenCount}
              </div>
              <button className="addicon1" type="button" onClick={() => setShowOverlay(true)} style={{ padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', transform: 'translateY(4%)' }}>
                Crypto
              </button>
            </div>
            <div className="token-info" style={{ display: 'flex', transform: 'translateX(-60%)', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px', width: '6rem', borderRadius: '10px', padding: '2px' }}>
              <button onClick={() => setShowCSVModal(true)} style={{ padding: '8px', marginLeft: '4px', borderRadius: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Local Currency</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              {recipients.length > 1 && (
                <button onClick={() => removeRecipient(recipient.id)} style={{ border: '1px black', padding: '20px', borderRadius: '20px' }}>
                  <FontAwesomeIcon icon={faTrashCan} style={{ color: "#ff0000", height: '22px', width: '22px' }} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {showTokenTable && (
        <TokenTable
          recipients={recipients}
          selectedRecipientId={selectedRecipientId}
          onClose={handleCloseTokenTable}
          onRemoveToken={handleRemoveToken}
          onAddToken={handleAddToken}
        />
      )}

      {showOverlay && (
        <AddToken
          recipientId={recipients[recipients.length - 1].id} //Pass recipient ID
          initialTokens={initialTokens}
          onSubmit={(selectedTokens) => {
            handleTokenChange(recipients[recipients.length - 1].id, selectedTokens);// Pass recipient ID here
            setShowOverlay(false);
          }}
          onClose={() => setShowOverlay(false)}
        />
      )}
      {showCSVModal && <CSVDetailsModal onClose={() => setShowCSVModal(false)} onSubmit={handleCSVSubmit} />}
      <ToastContainer />
      <div>
        <button type="button" onClick={addRecipient} style={{ width: '100%', border: '1px dotted black', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
          ADD RECIPIENT
        </button>
        <div style={{ textAlign: 'left' }}>
          <button onClick={handleNext} style={{ border: 'none', backgroundColor: '#6B8065', color: 'white', padding: '10px 20px', borderRadius: '5px' }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Form2;

