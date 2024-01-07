export function licenseHex(licenseClass: string) {
    switch(licenseClass) {
        case 'Rookie': return "#92342E";
        case 'D': return "#F98406";
        case 'C': return "#D3A400";
        case 'B': return "#3C6D56";
        case'A': default: return "#315187";
    }
}