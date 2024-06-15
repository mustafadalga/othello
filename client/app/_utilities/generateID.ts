export default function generateID(): string {
    const timestamp = new Date().getTime();
    const randomComponent1 = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    const randomComponent2 = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    const randomComponent3 = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

    return `${timestamp}-${randomComponent1}-${randomComponent2}-${randomComponent3}`;
}
