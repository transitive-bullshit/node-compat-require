// this program uses features only available in node >= 8.

const main = async (argv) => {
  // use async / await
  await new Promise((resolve) => {
    setTimeout(() => {
      // use destructuring
      const { argv, version } = process

      console.log('process.argv', JSON.stringify(argv, null, 2))
      console.log('process.version', version)
      resolve()
    }, 500)
  })
}

main()
