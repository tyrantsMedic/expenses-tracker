<template>
  <div class="container">
    <h2>Expense Tracker</h2>
    <TotalBalance :total="total" />
    <IncomeExpense :income="income" :expense="expense" />
    <ExpenseHistory
      :transactions="transactions"
      :colorChangedToRed="colorChangedToRed"
      @deleteTransaction="onDeleteTransaction"
      @resetTransactions="onResetTransactions"
    />
    <TransactionForm
      @addTransaction="onAddTransaction"
      @isTextChangedToRed="onIsTextChangedToRed"
    />
  </div>
</template>

<script>
import TotalBalance from './components/TotalBalance.vue'
import IncomeExpense from './components/IncomeExpense.vue'
import ExpenseHistory from './components/ExpenseHistory.vue'
import TransactionForm from './components/TransactionForm.vue'
import axios from 'axios'

export default {
  components: {
    TotalBalance,
    IncomeExpense,
    ExpenseHistory,
    TransactionForm
  },
  data() {
    return {
      transactions: [],
      colorChangedToRed: false
    }
  },
  async mounted() {
    await this.refresh()
  },
  computed: {
    income() {
      return this.transactions
        .reduce((total, transaction) => {
          if (transaction.amount > 0) total += Number(transaction.amount)
          return total
        }, 0)
        .toFixed(2)
    },
    expense() {
      return this.transactions
        .reduce((total, transaction) => {
          if (transaction.amount < 0) total += Number(transaction.amount)
          return total
        }, 0)
        .toFixed(2)
    },
    total() {
      return this.transactions
        .reduce((total, transaction) => (total += Number(transaction.amount)), 0)
        .toFixed(2)
    }
  },
  methods: {
    async onAddTransaction(data) {
      try {
        await axios.post('http://localhost:3000/api/addTransaction', data)
        await this.refresh()
      } catch (e) {
        console.error(e)
      }
      // localStorage.setItem('transactions', JSON.stringify(this.transactions))
    },
    async onDeleteTransaction(id) {
      try {
        await axios.delete('http://localhost:3000/api/transaction', { data: { id: id } })
        await this.refresh()
      } catch (e) {
        console.error(e)
      }
      // this.transactions = this.transactions.filter((transaction) => transaction.id != id)
      // localStorage.setItem('transactions', JSON.stringify(this.transactions))
    },
    async onResetTransactions() {
      try {
        await axios.delete('http://localhost:3000/api/all')
        await this.refresh()
      } catch (e) {
        console.error(e)
      }
      // await localStorage.setItem('transactions', [''])
      // this.transactions = []
    },
    onIsTextChangedToRed(isTextChangedToRed) {
      this.colorChangedToRed = isTextChangedToRed
    },
    async refresh() {
      try {
        const response = await axios.get('http://localhost:3000/api/getAllTransactions')
        this.transactions = response.data
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }
  }
}
</script>
