document.addEventListener('DOMContentLoaded', function () {
    const playerRows = document.getElementById('playerRows');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const calculateBtn = document.getElementById('calculateBtn');

    addPlayerBtn.addEventListener('click', function () {
        addPlayerRow();
    });

    calculateBtn.addEventListener('click', function () {
        calculateNetResults();
        calculatePayments();
    });

    function addPlayerRow() {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" name="name" placeholder="Player Name"></td>
            <td><input type="number" name="buyin" placeholder="Buy-In"></td>
            <td><input type="number" name="winnings" placeholder="Winnings"></td>
            <td class="net-result">0</td>
            <td class="pays-who"></td>
        `;
        playerRows.appendChild(newRow);
    }

    function calculateNetResults() {
        const rows = playerRows.querySelectorAll('tr');
        rows.forEach(row => {
            const buyin = parseFloat(row.querySelector('input[name="buyin"]').value) || 0;
            const winnings = parseFloat(row.querySelector('input[name="winnings"]').value) || 0;
            const netResult = winnings - buyin;
            row.querySelector('.net-result').textContent = netResult.toFixed(2);
        });
    }

    function calculatePayments() {
        const rows = Array.from(playerRows.querySelectorAll('tr'));
        const players = rows.map(row => {
            return {
                name: row.querySelector('input[name="name"]').value,
                netResult: parseFloat(row.querySelector('.net-result').textContent),
                row: row
            };
        });
    
        const payers = players.filter(p => p.netResult < 0).sort((a, b) => a.netResult - b.netResult);
        const receivers = players.filter(p => p.netResult > 0).sort((a, b) => b.netResult - a.netResult);
    
        payers.forEach(payer => {
            let toPay = Math.abs(payer.netResult);
            const payments = [];
    
            receivers.forEach(receiver => {
                if (toPay > 0 && receiver.netResult > 0) {
                    const paymentAmount = Math.min(toPay, receiver.netResult);
                    if (paymentAmount > 0) {
                        payments.push(`pays ${receiver.name} $${paymentAmount.toFixed(2)}`);
                    }
                    receiver.netResult -= paymentAmount;
                    toPay -= paymentAmount;
                }
            });
    
            payer.row.querySelector('.pays-who').textContent = payments.join(', ');
        });
    
        receivers.forEach(receiver => {
            const payments = payers
                .filter(payer => payer.netResult < 0)
                .map(payer => {
                    const paymentAmount = Math.min(Math.abs(payer.netResult), receiver.netResult);
                    return paymentAmount > 0 ? `gets paid $${paymentAmount.toFixed(2)} from ${payer.name}` : null;
                })
                .filter(payment => payment);
    
            receiver.row.querySelector('.pays-who').textContent = payments.join(', ');
        });
    }
    
});
