const fs = require("fs").promises
require("firebase/storage")

const uploadFiles = async (localData, localFolder, firebaseData) => {
  const { ref, prefix, filesNames } = firebaseData

  return new Promise(resolve => {
    const uploadedFiles = []
    let counter = 0
    localData.forEach(async row => {
      const fileName = `${row.id}.pdf`
      const localFilePath = `${localFolder}/${fileName}`

      try {
        if (!filesNames.includes(fileName)) {
          await fs.access(localFilePath)
          const localFile = await fs.readFile(localFilePath)

          const fileRef = ref.child(`${prefix}/${fileName}`)
          await fileRef.put(Uint8Array.from(localFile))
          const url = await fileRef.getDownloadURL()

          uploadedFiles.push({
            _id: row.id,
            hash: row.hash,
            url,
          })
        }
      } catch (error) {
        console.log(`::: Firebase : Error while uploading file: ${error}`)
      }
      counter++
      if (counter === localData.length) {
        console.log(`::: Firebase : All files were uploaded.`)
        resolve(uploadedFiles)
      }
    })
  })
}

module.exports = uploadFiles
