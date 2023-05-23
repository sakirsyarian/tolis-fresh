const formatedAge = (age) => {
    return new Date().getFullYear() - age.getFullYear()
}

const formatedDate = (date) => {
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    const changeDate = date.toLocaleDateString('id-ID', options)
        .split('/').reverse().join('-')

    return changeDate
}

const formatedNumber = (number) => {
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
}

module.exports = { formatedAge, formatedDate, formatedNumber }