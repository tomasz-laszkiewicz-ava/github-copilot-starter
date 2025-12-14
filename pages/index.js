import dynamic from 'next/dynamic'
import Head from 'next/head'

const SudokuBoard = dynamic(() => import('../components/SudokuBoard'), { ssr: false })

export default function Home() {
  return (
    <>
      <Head>
        <title>Sudoku Game</title>
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-start py-10">
        <h1 className="text-3xl font-bold mb-6">Sudoku Game</h1>
        <SudokuBoard />
      </main>
    </>
  )
}
