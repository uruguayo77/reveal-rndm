import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function RNDMReveal() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null)
  const [userNFTs, setUserNFTs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      window.solana.connect({ onlyIfTrusted: true }).then(({ publicKey }) => {
        if (publicKey) {
          setWalletConnected(true)
          setWalletAddress(publicKey.toString())
        }
      })
    }
  }, [])

  const connectWallet = async () => {
    if (window.solana) {
      try {
        const res = await window.solana.connect()
        if (res.publicKey) {
          setWalletConnected(true)
          setWalletAddress(res.publicKey.toString())
        }
      } catch (err) {
        console.error('Connection failed', err)
      }
    }
  }

  const fetchNFTs = async () => {
    if (!walletAddress) return
    setLoading(true)
    try {
      const exampleNFTs = [
        {
          name: 'RNDM #0421',
          image: 'https://i.ibb.co/2VjD56H/file-00000000f8ec51f685ad8a4f5559b17f-conversation-id-67eca286-4f24-8008-80de-44188064729b-message-i.png',
          reward: '2.2275 SOL',
          level: 'Silver',
        },
        {
          name: 'RNDM #0879',
          image: 'https://i.ibb.co/2VjD56H/file-00000000f8ec51f685ad8a4f5559b17f-conversation-id-67eca286-4f24-8008-80de-44188064729b-message-i.png',
          reward: '0.12375 SOL',
          level: 'Consolation',
        },
      ]
      setUserNFTs(exampleNFTs)
    } catch (err) {
      console.error('Failed to fetch NFTs', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-4">RNDM | Reveal</h1>
      {!walletConnected ? (
        <Button onClick={connectWallet}>Подключить Phantom</Button>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-400">Кошелёк: {walletAddress}</p>
          <Button onClick={fetchNFTs} disabled={loading}>
            {loading ? 'Загрузка...' : 'Показать мои NFT'}
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {userNFTs.map((nft, i) => (
              <motion.div
                key={i}
                className="bg-white/10 rounded-xl p-4 shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <img src={nft.image} alt={nft.name} className="rounded mb-2 w-full" />
                <h2 className="text-lg font-semibold">{nft.name}</h2>
                <p className="text-sm">Уровень: {nft.level}</p>
                <p className="text-sm mb-2">Приз: {nft.reward}</p>
                <Button
                  onClick={() => alert(`Запрос на выплату отправлен для ${nft.name}`)}
                  className="text-xs"
                >
                  Запросить выплату
                </Button>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}