const etherlinkMainnetConfig = {
    chainId: '0xa729', // 42793 in hexadecimal
    chainName: 'Etherlink Mainnet',
    nativeCurrency: {
        name: 'Tezos',
        symbol: 'XTZ',
        decimals: 18
    },
    rpcUrls: ['https://node.mainnet.etherlink.com'],
    blockExplorerUrls: ['https://explorer.etherlink.com']
};

let provider;
let signer;

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();

            // Check if we're on the correct network
            const network = await provider.getNetwork();
            if (network.chainId !== parseInt(etherlinkMainnetConfig.chainId, 16)) {
                await switchToEtherlinkMainnet();
            }

            await updateWalletInfo();
            document.getElementById('connect-wallet').textContent = 'Wallet Connected';
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    } else {
        console.log('Please install MetaMask!');
        alert('Please install MetaMask to use this feature!');
    }
}

async function switchToEtherlinkMainnet() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: etherlinkMainnetConfig.chainId }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [etherlinkMainnetConfig],
                });
            } catch (addError) {
                console.error('Failed to add Etherlink Mainnet:', addError);
            }
        } else {
            console.error('Failed to switch to Etherlink Mainnet:', switchError);
        }
    }
}

async function updateWalletInfo() {
    if (signer) {
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        document.getElementById('wallet-address').textContent = `Address: ${address}`;
        document.getElementById('wallet-balance').textContent = `Balance: ${ethers.utils.formatEther(balance)} XTZ`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connect-wallet').addEventListener('click', connectWallet);
});

export { provider, signer, connectWallet };
