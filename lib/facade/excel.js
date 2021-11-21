const {COLUMNS} = require('../utils/constans')

const ExcelJS = require('exceljs')
const chalk = require('chalk');

const buildDocument = (data) =>{
    const today = new Date()
    const fullDate = `${today.getDate()}-${ today.getMonth()}-${today.getFullYear()}_${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`

    const workbook = new ExcelJS.Workbook()
    const filename = `exports_${fullDate}.xlsx`

    const sheet = workbook.addWorksheet('Mercado Libre', {properties:{tabColor:{argb:'FFF159'}}})
    
    sheet.columns = COLUMNS

    sheet.addRows(data)

    //workbook.addWorksheet('Fravega', {properties:{tabColor:{argb:'654BB9'}}})

    workbook.xlsx.writeFile(filename).then((e) =>{
        console.log(chalk.green('✔Documento generado correctamente!'))
    }).catch(()=>{
        console.log(chalk.red('✘Error al generar el documento!'))
    })
}


module.exports = {
    buildDocument
}