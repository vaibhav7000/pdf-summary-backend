function generateOTP(): number {
    return Math.floor(1000 + Math.random() * 9000);
}

export {
    generateOTP
}