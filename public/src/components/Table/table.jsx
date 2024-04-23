import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAppContext } from '../Context/AppProvider';
import './table.css';
import { SERVER_URL } from '../../../constants';

function Table() {
  const navigate = useNavigate();
  const { transactions, updateTransactions } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVER_URL}/api/getRecipientTransactions`, {
          method: 'GET', 
          headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
        });

        if (response.ok) {
          const transactionD = await response.json();
          //console.log('Transactions from API:', transactionD);
          const transactions = transactionD.transactions;
          updateTransactions(transactions);
          setDataLoaded(true);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (index) => {
    const selected = transactions[index];
    setSelectedTransaction(selected);
    //console.log('Download action for index:', index);
    navigate(`/download/${index}`);
  };

  const setFullContentAsTitle = () => {
    const cells = document.querySelectorAll('td');
    cells.forEach((cell) => {
      cell.setAttribute('title', cell.textContent);
    });
  };

  useEffect(() => {
    setFullContentAsTitle();
  }, [transactions]);

  const transactionsPerPage = 14;
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const currentTransactions = transactions.slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {dataLoaded && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1px' }}>
          <thead>
            <tr>
              <th>Transaction Name</th>
              <th>Recipient</th>
              {/* <th>Token</th> */}
              <th>Classification</th>
              <th>Description</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions?.map((transaction, index) => (
              <tr key={index} onClick={() => handleRowClick((currentPage - 1) * transactionsPerPage + index)} className="clickable-row" style={{ height: '50px' }}>
                <td>{transaction?.transactionName || '{...}'}</td>
                <td>
                {transaction && transaction?.recipients && transaction.recipients.length > 0 && (
  <>
    {transaction.recipients.map((recipient) => recipient.name).join(', ')}
  </>
)}

</td>
                {/* <td>{transaction?.token || '{...}'}</td> */}
                <td>{transaction?.classification.classificationName || '{...}'}</td>
                <td>{transaction?.description.descriptionName || '{...}'}</td>
                <td>{transaction?.createdAt ? new Date(transaction.createdAt).toLocaleString() : '{...}'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <span>
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                      <Icon icon="bi:arrow-left" />
                    </button>
                    Previous
                  </span>
                  <span>
                    Next   
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                     <Icon icon="bi:arrow-right" />
                    </button>
                  </span>
                </div>
                <div>Total Transactions: {transactions.length}</div>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}

export default Table;
