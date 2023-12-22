// DownloadPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_URL } from '../../../constants';

function DownloadPage() {
  const navigate = useNavigate();
  const { index } = useParams();
  const [downloadLink, setDownloadLink] = useState(null);

  useEffect(() => {
    const fetchDownloadLink = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVER_URL}/api/getRecipientTransactions`, {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('data:', data);
          const selectedTransaction = data.transactions[index];
          setDownloadLink(selectedTransaction.downloadLink);
        } else {
          console.error('Failed to fetch download link');
        }
      } catch (error) {
        console.error('Error fetching download link:', error);
      }
    };

    fetchDownloadLink();
  }, [index]);

  const handleDownload = () => {
    // Create an anchor element
    const anchor = document.createElement('a');
    anchor.href = downloadLink;
    anchor.download = `recipient_data_${index}.json`; // Set the desired file name

    // Trigger a click on the anchor element
    document.body.appendChild(anchor);
    anchor.click();

    // Remove the anchor element from the DOM
    document.body.removeChild(anchor);
  };

  return (
    <div>
      <h1>Download Page</h1>
      {downloadLink && (
        <button onClick={handleDownload}>
          Download File
        </button>
      )}
    </div>
  );
}

export default DownloadPage;