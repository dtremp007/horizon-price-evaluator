export function convertToPrice(price: number | string): string {
    if ((typeof price === 'string' && isNaN(+price.charAt(0))) || (typeof price === 'number')) {
        return `$${price.toLocaleString()}`
    }

    return price
}
