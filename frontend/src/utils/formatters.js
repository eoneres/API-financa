export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

export const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export const formatShortDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(new Date(date))
}