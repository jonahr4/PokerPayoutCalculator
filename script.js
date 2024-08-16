document.addEventListener('DOMContentLoaded', function () {
    const playerRows = document.getElementById('playerRows');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    document.querySelector('.container').appendChild(messageDiv);

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
        let totalBuyIns = 0;
        let totalWinnings = 0;

        rows.forEach(row => {
            const buyin = parseFloat(row.querySelector('input[name="buyin"]').value) || 0;
            const winnings = parseFloat(row.querySelector('input[name="winnings"]').value) || 0;
            const netResult = winnings - buyin;

            totalBuyIns += buyin;
            totalWinnings += winnings;

            row.querySelector('.net-result').textContent = netResult.toFixed(2);
        });

        if (totalBuyIns !== totalWinnings) {
            messageDiv.textContent = `Discrepancy found: Total Buy-Ins (${totalBuyIns.toFixed(2)}) do not equal Total Winnings (${totalWinnings.toFixed(2)}). Please check the entries.`;
            messageDiv.style.color = 'red';
        } else {
            messageDiv.textContent = 'All values are balanced.';
            messageDiv.style.color = 'green';
        }
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
                        payments.push(`Pays ${receiver.name} $${paymentAmount.toFixed(2)}`);
                    }
                    receiver.netResult -= paymentAmount;
                    toPay -= paymentAmount;
                }
            });

            payer.row.querySelector('.pays-who').textContent = payments.join(', ');
        });

    }
});
