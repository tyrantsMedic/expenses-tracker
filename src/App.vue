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
import apiService from './utils/ApiService'

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
        await apiService.post('/addTransaction', data)
        await this.refresh()
      } catch (e) {
        console.error(e)
      }
    },
    async onDeleteTransaction(id) {
      try {
        await apiService.delete('/transaction', id)
        await this.refresh()
      } catch (e) {
        console.error(e)
      }
    },
    async onResetTransactions() {
      try {
        await apiService.delete('/all')
        await this.refresh()
      } catch (e) {
        console.error(e)
      }
    },
    onIsTextChangedToRed(isTextChangedToRed) {
      this.colorChangedToRed = isTextChangedToRed
    },
    async refresh() {
      try {
        const response = await apiService.get('/getAllTransactions')
        this.transactions = response.data
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }
  }
}
</script>
