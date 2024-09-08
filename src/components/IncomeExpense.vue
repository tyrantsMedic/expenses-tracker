<template>
    <div class="income-expenses-container">
        <div class="income">
            <h4>INCOME</h4>
            <h4>{{ income }} PKR</h4>
        </div>
        <hr />
        <div class="expense">
            <h4>EXPENSE</h4>
            <h4>{{ expense }} PKR</h4>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        income: {
            type: String,
            required: true,
        },
        expense: {
            type: String,
            required: true,
        },
    },
};
</script>

<style>
.income-expenses-container {
    margin-top: 20px;
    display: flex;
    background: white;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    justify-content: center;
    align-items: center;
}

.income-expenses-container hr {
    height: 3rem;
}

h4 {
    margin: 0;
    font-weight: 500;
}

.income-expenses-container div {
    padding: 1rem 5rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.income h4:nth-child(2) {
    color: rgb(1, 218, 1);
    margin-top: 5px;
}

.expense h4:nth-child(2) {
    color: rgb(255, 0, 0);
    margin-top: 5px;
}

@media (max-width: 1000px) {
    .income-expenses-container div {
        padding: 1rem 1rem;
    }
}
</style>
